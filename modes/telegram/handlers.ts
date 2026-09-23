import type { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import { isOwner } from "./auth";
import { WELCOME } from "./constants";
import { clip, commandArg } from "./text";
import { runAgent, runAsk, runPlanSteps } from "./agent-run";
import { generatePlan } from "../plan/planner";
import { planKeyboard, planMessage, planSessions, refreshPlanUi, type PlanSession } from "./plan-session";
import { approvalDiff, approvalSessions } from "./approval-session";

const pendingInputs = new Map<number, "agent" | "ask" | "plan">();

async function startPlan(ctx: any, goal: string) {
  await ctx.reply("🧭 Generating a plan…");
  try {
    const plan = await generatePlan(goal);
    const session: PlanSession = {
      plan,
      selected: new Set(plan.steps.map((s) => s.id)),
    };
    await ctx.reply(planMessage(session), {
      parse_mode: "Markdown",
      ...planKeyboard(session),
    });
    planSessions.set(ctx.chat.id, session);
  } catch (err) {
    console.error("Plan generation error:", err);
    await ctx.reply("❌ Failed to generate plan. Please try again.");
  }
}

export function registerHandlers(bot: Telegraf) {
  bot.command("start", async (ctx) => {
    if (!isOwner(ctx.chat.id)) return;
    pendingInputs.delete(ctx.chat.id);
    await ctx.reply(WELCOME, { parse_mode: "Markdown" });
  });

  bot.command("cancel", async (ctx) => {
    if (!isOwner(ctx.chat.id)) return;
    if (pendingInputs.has(ctx.chat.id)) {
      pendingInputs.delete(ctx.chat.id);
      return ctx.reply("❌ Cancelled current prompt.");
    }
    return ctx.reply("Nothing to cancel.");
  });

  bot.command("ask", async (ctx) => {
    if (!isOwner(ctx.chat.id)) return;
    const q = commandArg(ctx.message.text, "ask");
    if (!q) {
      pendingInputs.set(ctx.chat.id, "ask");
      return ctx.reply(
        "🔍 *Ask Mode*\n\nPlease send your question about the codebase as your next message (or /cancel to abort):",
        { parse_mode: "Markdown" },
      );
    }

    pendingInputs.delete(ctx.chat.id);
    void runAsk(ctx, ctx.chat.id, q).catch(console.error);
  });

  bot.command("agent", async (ctx) => {
    if (!isOwner(ctx.chat.id)) return;
    const goal = commandArg(ctx.message.text, "agent");
    if (!goal) {
      pendingInputs.set(ctx.chat.id, "agent");
      return ctx.reply(
        "🤖 *Agent Mode*\n\nPlease send your task description as your next message (or /cancel to abort):",
        { parse_mode: "Markdown" },
      );
    }

    pendingInputs.delete(ctx.chat.id);
    void runAgent(ctx, ctx.chat.id, goal).catch(console.error);
  });

  bot.command("plan", async (ctx) => {
    if (!isOwner(ctx.chat.id)) return;
    const goal = commandArg(ctx.message.text, "plan");
    if (!goal) {
      pendingInputs.set(ctx.chat.id, "plan");
      return ctx.reply(
        "🧭 *Plan Mode*\n\nPlease send the goal you want to plan as your next message (or /cancel to abort):",
        { parse_mode: "Markdown" },
      );
    }

    pendingInputs.delete(ctx.chat.id);
    await startPlan(ctx, goal);
  });

  bot.on(message("text"), async (ctx) => {
    if (!isOwner(ctx.chat.id)) return;
    const text = ctx.message.text.trim();
    if (text.startsWith("/")) return;

    const pending = pendingInputs.get(ctx.chat.id);
    if (!pending) {
      return ctx.reply(
        "💡 Choose a command to get started:\n\n/agent — Run a task on your codebase\n/ask — Ask a question about the codebase\n/plan — Plan a feature or goal\n/start — View help menu",
      );
    }

    pendingInputs.delete(ctx.chat.id);

    if (pending === "agent") {
      void runAgent(ctx, ctx.chat.id, text).catch(console.error);
    } else if (pending === "ask") {
      void runAsk(ctx, ctx.chat.id, text).catch(console.error);
    } else if (pending === "plan") {
      await startPlan(ctx, text);
    }
  });

    bot.action(/^plan_toggle:(.+)$/, async (ctx) => {
    if (!isOwner(ctx.chat!.id)) return ctx.answerCbQuery();
    const s = planSessions.get(ctx.chat!.id);
    if (!s) return ctx.answerCbQuery();

    const id = ctx.match[1]!;
    if (s.selected.has(id)) s.selected.delete(id);
    else s.selected.add(id);

    await refreshPlanUi(ctx, s);
    await ctx.answerCbQuery();
  });

  
  bot.action('plan_all', async (ctx) => {
    if (!isOwner(ctx.chat!.id)) return ctx.answerCbQuery();
    const s = planSessions.get(ctx.chat!.id);
    if (!s) return ctx.answerCbQuery();
    for (const step of s.plan.steps) s.selected.add(step.id);
    await refreshPlanUi(ctx, s);
    await ctx.answerCbQuery();
  });

    bot.action('plan_none', async (ctx) => {
    if (!isOwner(ctx.chat!.id)) return ctx.answerCbQuery();
    const s = planSessions.get(ctx.chat!.id);
    if (!s) return ctx.answerCbQuery();
    s.selected.clear();
    await refreshPlanUi(ctx, s);
    await ctx.answerCbQuery();
  });

   bot.action('plan_proceed', async (ctx) => {
    if (!isOwner(ctx.chat!.id)) return ctx.answerCbQuery();
    const s = planSessions.get(ctx.chat!.id);
    if (!s) return ctx.answerCbQuery();

    const steps = s.plan.steps.filter((step) => s.selected.has(step.id));
    if (steps.length === 0) return ctx.answerCbQuery();

    const { plan } = s;
    planSessions.delete(ctx.chat!.id);
    const list = steps.map((step, i) => `${i + 1}. ${step.title}`).join('\n');
    await ctx.editMessageText(`🚀 Executing ${steps.length} step(s)…\n\n${list}`);
    await ctx.answerCbQuery();

    void runPlanSteps(ctx, ctx.chat!.id, plan, steps).catch(console.error);
  });

  bot.action('approval_diff', async (ctx) => {
    if (!isOwner(ctx.chat!.id)) return ctx.answerCbQuery();
    const s = approvalSessions.get(ctx.chat!.id);
    if (!s) return ctx.answerCbQuery();
    await ctx.answerCbQuery();
    await ctx.reply(clip(approvalDiff(s.pending)));
  });

  bot.action('approval_accept', async (ctx) => {
    if (!isOwner(ctx.chat!.id)) return ctx.answerCbQuery();
    const s = approvalSessions.get(ctx.chat!.id);
    if (!s) return ctx.answerCbQuery();

    approvalSessions.delete(ctx.chat!.id);
    for (const a of s.pending) s.tracker.updateStatus(a.id, 'approved', true);
    const { errors } = s.executor.applyApprovedFromTracker();
    s.executor.clearStaging();

    await ctx.editMessageText('✅ All changes applied.');
    await ctx.answerCbQuery('Applied!');
    if (errors.length) console.error(errors);
  });

  bot.action('approval_reject', async (ctx) => {
    if (!isOwner(ctx.chat!.id)) return ctx.answerCbQuery();
    const s = approvalSessions.get(ctx.chat!.id);
    if (!s) return ctx.answerCbQuery();

    approvalSessions.delete(ctx.chat!.id);
    for (const a of s.pending) s.tracker.updateStatus(a.id, 'rejected', false);
    s.executor.clearStaging();

    await ctx.editMessageText('❌ All changes rejected. Nothing was applied.');
    await ctx.answerCbQuery('Rejected');
  });

}
