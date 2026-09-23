import chalk from "chalk";
import {select,isCancel} from "@clack/prompts";

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
        if (mode === "Agent") {console.log(chalk.greenBright("Starting Agent mode..."));}
        if (mode === "Plan") {console.log(chalk.greenBright("Starting Plan mode..."));}
        if (mode === "ASK") {console.log(chalk.greenBright("Starting ASK mode..."));}

        if(mode !=='ASK' && mode !=='Plan' && mode !=='Agent'){
            console.log(chalk.redBright("\n The mode is not implemented yet!"));
            return;
        }
    }
}