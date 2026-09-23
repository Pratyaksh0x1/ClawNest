export class TelegramProgress {
  private logs: string[] = [];
  private messageId: number | null = null;
  private chatId: number;
  private telegram: any;
  private title: string;
  private lastUpdate = 0;
  private updateTimer: NodeJS.Timeout | null = null;

  constructor(telegram: any, chatId: number, title = "Agent is working...") {
    this.telegram = telegram;
    this.chatId = chatId;
    this.title = title;
  }

  async start(): Promise<void> {
    try {
      const msg = await this.telegram.sendMessage(
        this.chatId,
        `🤖 *${this.title}*\n\n_Starting task..._`,
        { parse_mode: "Markdown" },
      );
      this.messageId = msg.message_id;
    } catch {
      try {
        const msg = await this.telegram.sendMessage(
          this.chatId,
          `🤖 ${this.title}\n\nStarting task...`,
        );
        this.messageId = msg.message_id;
      } catch (err) {
        console.error("Failed to send initial progress message:", err);
      }
    }
  }

  addStep(toolName: string, input: any): void {
    const summary = this.formatToolCall(toolName, input);
    this.logs.push(summary);
    if (this.logs.length > 10) {
      this.logs = this.logs.slice(-10);
    }
    this.scheduleUpdate();
  }

  private formatToolCall(toolName: string, input: any): string {
    const safe = (val: string, max = 40) => {
      const s = String(val ?? "").replace(/[`*]/g, "'");
      return s.length > max ? s.slice(0, max) + "…" : s;
    };

    switch (toolName) {
      case "read_file":
        return `📖 \`read_file\` \`${safe(input?.path)}\``;
      case "create_file":
        return `📄 \`create_file\` \`${safe(input?.path)}\``;
      case "modify_file":
        return `✏️ \`modify_file\` \`${safe(input?.path)}\``;
      case "delete_file":
        return `🗑 \`delete_file\` \`${safe(input?.path)}\``;
      case "create_folder":
        return `📁 \`create_folder\` \`${safe(input?.path)}\``;
      case "list_files":
        return `📂 \`list_files\` \`${safe(input?.path ?? ".")}\``;
      case "search_files":
        return `🔎 \`search_files\` \`${safe(input?.pattern)}\``;
      case "analyze_codebase":
        return `📊 \`analyze_codebase\``;
      case "execute_shell":
        return `🖥 \`execute_shell\` \`${safe(input?.command)}\``;
      case "web_search":
        return `🌐 \`web_search\` "${safe(input?.query)}"`;
      case "web_crawl":
        return `🕸 \`web_crawl\` \`${safe(input?.url)}\``;
      case "fetch_url":
        return `🔗 \`fetch_url\` \`${safe(input?.url)}\``;
      case "list_skills":
        return `⚡ \`list_skills\``;
      case "read_skill":
        return `⚡ \`read_skill\` \`${safe(input?.path)}\``;
      default: {
        const inp = input ? JSON.stringify(input) : "";
        return `⚙️ \`${toolName}\` ${inp ? `\`${safe(inp, 30)}\`` : ""}`.trim();
      }
    }
  }

  private scheduleUpdate(): void {
    if (!this.messageId) return;
    const now = Date.now();
    const throttleMs = 1200;
    const delay = Math.max(0, throttleMs - (now - this.lastUpdate));

    if (this.updateTimer) clearTimeout(this.updateTimer);

    this.updateTimer = setTimeout(async () => {
      this.lastUpdate = Date.now();
      const body = this.logs.map((l) => `✓ ${l}`).join("\n");
      const text = `⚙️ *${this.title}*\n\n${body ? body + "\n\n" : ""}_Executing steps..._`;
      await this.flush(text);
    }, delay);
  }

  private async flush(text: string): Promise<void> {
    if (!this.messageId) return;
    try {
      await this.telegram.editMessageText(
        this.chatId,
        this.messageId,
        undefined,
        text,
        { parse_mode: "Markdown" },
      );
    } catch {
      try {
        const plain = text.replace(/[*`_]/g, "");
        await this.telegram.editMessageText(
          this.chatId,
          this.messageId,
          undefined,
          plain,
        );
      } catch {
        // Ignore "message is not modified" or network hiccups
      }
    }
  }

  async finish(statusText = "Completed"): Promise<void> {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
      this.updateTimer = null;
    }
    const body = this.logs.map((l) => `✓ ${l}`).join("\n");
    const text = `✅ *${this.title}*\n\n${body ? body + "\n\n" : ""}_${statusText}_`;
    await this.flush(text);
  }
}
