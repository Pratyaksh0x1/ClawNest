#!/usr/bin/env bun

import {Command} from "commander";
import { runWakeup } from "./tui/wakeup";

const program = new Command();

program 
 .name ("ClawNest")
 .description("A minimal open-source personal AI agent, inspired by OpenClaw")
 .version("0.0.1");

program 
 .command("wakeup")
 .description("Show the banner and show the main menu")
 .action(
    async () => {
        await runWakeup();
    }
 );

await program.parseAsync(process.argv);


