import { Telegraf } from "telegraf";
import chalk from "chalk";
import { WELCOME } from "./constants";
import { registerHandlers } from "./handlers";

export async function runTelegramMode() {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const ownerId = process.env.TELEGRAM_OWNER_ID?.trim();

  if (!token) {
    console.log(
      chalk.red("\n❌ Error: TELEGRAM_BOT_TOKEN is not set in environment or .env file.\n")
    );
    return;
  }

  if (!ownerId) {
    console.log(
      chalk.red("\n❌ Error: TELEGRAM_OWNER_ID is not set in environment or .env file.\n")
    );
    return;
  }

  const bot = new Telegraf(token);
  registerHandlers(bot);

  try {
    await bot.telegram.sendMessage(ownerId, WELCOME, { parse_mode: "Markdown" });
    console.log(chalk.green("✓ Sent welcome message to Telegram.\n"));
  } catch (error: any) {
    console.log(
      chalk.yellow(
        `⚠ Could not send welcome message to owner (${error.message ?? error}).`
      )
    );
    console.log(
      chalk.dim("  Make sure the owner has messaged the bot at least once.\n")
    );
  }

  try {
    await bot.launch();
    console.log(chalk.green("✓ Telegram bot is running. Press Ctrl+C to stop.\n"));
  } catch (error: any) {
    console.log(
      chalk.red(`\n❌ Failed to start Telegram bot: ${error.message ?? error}\n`)
    );
    return;
  }

  await new Promise<void>((resolvePromise) => {
    const stop = () => {
      bot.stop("SIGINT");
      resolvePromise();
    };
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  });
}
