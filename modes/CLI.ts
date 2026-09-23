import chalk from "chalk";
import {select,isCancel} from "@clack/prompts";
import { runPlanMode } from "./plan/orchestrator";
import { runAgentMode } from "./agent/orchestrator";
import { runAskMode } from "./ask/orchestrator";

export async function runCLImode() {
    while(true){
        const mode = await select({
            message: "Choose an option",
            options: [
                { value: "Agent", label: "Agent Mode" },
                { value: "Plan", label: "Plan Mode" },
                { value: "ASK", label: "ASK Mode" },
                { value: "Back", label: "Back" }
            ]
        });
        if (isCancel(mode || mode === "Back")) {
            return;
        }
        if (mode === "Agent") {
            await runAgentMode();
        }
        if (mode === "Plan") {
            await runPlanMode();
        }
        if (mode === "ASK") {
            await runAskMode();
        }

        if(mode !=='ASK' && mode !=='Plan' && mode !=='Agent'){
            console.log(chalk.redBright("\n The mode is not implemented yet!"));
            return;
        }
    }
}