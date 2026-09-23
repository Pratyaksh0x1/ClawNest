import { z } from "zod";
import { ActionTracker } from "../agent/action-tracker.ts";
import { ToolExecutor } from "../agent/tool-executor.ts";
import { createAgentTools } from "../agent/agent-tools.ts";
import { defaultAgentConfig, type AgentConfig } from "../agent/types.ts";
import { createWebTools } from "../plan/web-tools.ts";
import type { Plan, PlanStep } from "../plan/types.ts";
import { replyMd } from "./text.ts";
import { finishOrApprove } from "./approval-session.ts";
import { getAgentModel } from "../../AI agent/index.ts";
import { stepCountIs, tool, ToolLoopAgent } from "ai";
import { TelegramProgress } from "./progress.ts";

function readOnlyConfig(): AgentConfig {
  const c = defaultAgentConfig();
  c.tools.allowFileCreation = false;
  c.tools.allowFileModification = false;
  c.tools.allowFolderCreation = false;
  c.tools.allowShellExecution = false;
  return c;
}

function agentOptions(config: AgentConfig, maxSteps: number) {
  return {
    model: getAgentModel(),
    stopWhen: stepCountIs(maxSteps),
    instructions: `Workspace root: ${config.codebasePath}`,
  };
}

function createReadOnlyTools(executor: ToolExecutor) {
  return {
    read_file: tool({
      description: "Read a workspace file (relative path).",
      inputSchema: z.object({ path: z.string() }),
      execute: async ({ path: p }) => executor.readFile(p),
    }),
    list_files: tool({
      description: "List files/dirs at a path.",
      inputSchema: z.object({
        path: z.string(),
        recursive: z.boolean().optional().default(false),
      }),
      execute: async ({ path: p, recursive }) =>
        executor.listFiles(p, recursive),
    }),
    search_files: tool({
      description:
        "Find files matching a glob pattern; optional content filter.",
      inputSchema: z.object({
        root: z.string(),
        pattern: z.string(),
        content_contains: z.string().optional(),
      }),
      execute: async ({ root, pattern, content_contains }) =>
        executor.searchFiles(root, pattern, content_contains),
    }),
    analyze_codebase: tool({
      description: "Summarize the codebase structure.",
      inputSchema: z.object({ path: z.string().default(".") }),
      execute: async ({ path: p }) => executor.analyzeCodebase(p),
    }),
  };
}

function extraWebTools(tracker: ActionTracker) {
  return process.env.FIRECRAWL_API_KEY ? createWebTools(tracker) : {};
}


export async function runAsk(
  ctx: { telegram: any; reply: (t: string, o?: object) => Promise<unknown> },
  chatId: number,
  question: string,
) {
  const config = readOnlyConfig();
  const tracker = new ActionTracker();
  const executor = new ToolExecutor(tracker, config);
  const tools = { ...createReadOnlyTools(executor), ...extraWebTools(tracker) };

  const progress = new TelegramProgress(ctx.telegram, chatId, "Researching Question");
  await progress.start();

  const agent = new ToolLoopAgent({
    ...agentOptions(config, 20),
    tools,
  });

  const { text } = await agent.generate({
    prompt: question,
    onStepFinish: ({ toolCalls }) => {
      for (const tc of toolCalls) {
        progress.addStep(tc.toolName, tc.input);
      }
    },
  });

  await progress.finish("Research complete.");
  await replyMd(ctx, text || "no answer");
}

export async function runAgent(
  ctx: { telegram: any; reply: (t: string, o?: object) => Promise<unknown> },
  chatId: number,
  goal: string,
) {
  const config = defaultAgentConfig();
  const tracker = new ActionTracker();
  const executor = new ToolExecutor(tracker, config);
  const tools = createAgentTools(executor);

  const progress = new TelegramProgress(ctx.telegram, chatId, "Agent Execution");
  await progress.start();

  const agent = new ToolLoopAgent({
    ...agentOptions(config, 40),
    tools,
  });

  const { text } = await agent.generate({
    prompt: goal,
    onStepFinish: ({ toolCalls }) => {
      for (const tc of toolCalls) {
        progress.addStep(tc.toolName, tc.input);
      }
    },
  });

  await progress.finish(text?.trim() ? "Completed steps." : "Finished.");
  if (text?.trim()) await replyMd(ctx, text.trim());
  await finishOrApprove(ctx, chatId, tracker, executor, "✅ Done. No file changes were needed.");
}

export async function runPlanSteps(
  ctx: { telegram: any; reply: (t: string, o?: object) => Promise<unknown> },
  chatId: number,
  plan: Plan,
  steps: PlanStep[],
) {
  const config = defaultAgentConfig();
  const tracker = new ActionTracker();
  const executor = new ToolExecutor(tracker, config);
  const tools = { ...createAgentTools(executor), ...extraWebTools(tracker) };

  for (const [i, step] of steps.entries()) {
    const progress = new TelegramProgress(
      ctx.telegram,
      chatId,
      `Step ${i + 1}/${steps.length}: ${step.title}`,
    );
    await progress.start();

    const prompt = [`Goal: ${plan.goal}`, `Step: ${step.title}`, step.description].join("\n");
    const agent = new ToolLoopAgent({
      ...agentOptions(config, 30),
      tools,
    });

    const { text } = await agent.generate({
      prompt,
      onStepFinish: ({ toolCalls }) => {
        for (const tc of toolCalls) {
          progress.addStep(tc.toolName, tc.input);
        }
      },
    });

    await progress.finish("Step completed.");
    if (text?.trim()) await replyMd(ctx, text.trim());
  }

  await finishOrApprove(ctx, chatId, tracker, executor, "✅ All steps done. No file changes needed.");
}

