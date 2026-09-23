import {select,isCancel} from "@clack/prompts";
import chalk from "chalk";
import figlet from "figlet";


const BANNER_FONT="ANSI Shadow";
const SHADOW=chalk.hex("#caadbb");
const FACE= chalk.hex("#de506a").bold;

function printBannerwithShadow(ascii:string){
    const bannerLines = ascii.replace(/\s+$/g, '').split('\n');
    const maxLen=Math.max(...bannerLines.map((l) => l.length),0);
    const rowWidth=maxLen+2;
    
    for(const line of bannerLines){
        console.log(SHADOW('  '+line).padEnd(rowWidth));
    }
    process.stdout.write(`\x1b[${bannerLines.length}A`);
    for(const line of bannerLines){
        console.log(FACE(line.padEnd(rowWidth)));
    }
    console.log();

}

export async function runWakeup() {
    let ascii:string;
    try{
        ascii = figlet.textSync("ClawNest", {
            font: BANNER_FONT,
        });
    }catch(error){
        ascii = figlet.textSync("ClawNest", {
            font: "Standard",
        });
    }
    printBannerwithShadow(ascii);

    const mode = await select({
        message: "Select a mode",
        options: [
            { value: "CLI", label: "CLI" },
            { value: "Telegram", label: "Telegram" }
        ]
    });

    if (isCancel(mode)) {
        console.log("Operation cancelled.");
        process.exit(0);
    }
    if (mode === "CLI") {
        console.log(chalk.greenBright("StartingCLI mode..."));
    } else if (mode === "Telegram") {
        console.log(chalk.greenBright("Starting Telegram mode..."));
    }   
}