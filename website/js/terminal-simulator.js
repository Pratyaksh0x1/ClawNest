/* ==========================================================================
   AUTHENTIC CLAWNEST TERMINAL SIMULATOR
   Matches the exact output, ANSI Shadow banner, and Clack prompts of ClawNest
   ========================================================================== */

const ASCII_BANNER = ` ██████╗██╗      █████╗ ██╗    ██╗███╗   ██╗███████╗███████╗████████╗
██╔════╝██║     ██╔══██╗██║    ██║████╗  ██║██╔════╝██╔════╝╚══██╔══╝
██║     ██║     ███████║██║ █╗ ██║██╔██╗ ██║█████╗  ███████╗   ██║   
██║     ██║     ██╔══██║██║███╗██║██║╚██╗██║██╔══╝  ╚════██║   ██║   
╚██████╗███████╗██║  ██║╚███╔███╔╝██║ ╚████║███████╗███████║   ██║   
 ╚═════╝╚══════╝╚═╝  ╚═╝ ╚══╝╚══╝ ╚═╝  ╚═══╝╚══════╝╚══════╝   ╚═╝   `;

const HEADER_LINES = [
  { html: `<span style="color:#94a3b8;">Windows PowerShell</span>`, delay: 40 },
  { html: `<span style="color:#94a3b8;">Copyright (C) Microsoft Corporation. All rights reserved.</span>`, delay: 40 },
  { html: `<span style="color:#64748b;">Loading personal and system profiles took 2759ms.</span>`, delay: 40 },
  { html: `<span style="color:#94a3b8;">(base) PS C:\\Users\\asus&gt; </span><span style="color:#fde047; font-weight:600;">ClawNest</span> wakeup`, delay: 80 }
];

const SCENARIOS = {
  wakeup: [
    ...HEADER_LINES,
    { type: 'banner', banner: ASCII_BANNER, delay: 100 },
    { html: `<span style="color:#38bdf8;">│</span>`, delay: 60 },
    { html: `<span style="color:#38bdf8;">◇</span>  <span style="color:#ffffff; font-weight:700;">Select a mode</span>`, delay: 60 },
    { html: `<span style="color:#38bdf8;">│</span>  <span style="color:#22c55e;">●</span> <span style="color:#ffffff; font-weight:600;">CLI</span>`, delay: 60 },
    { html: `<span style="color:#38bdf8;">│</span>  <span style="color:#64748b;">○ Telegram</span>`, delay: 60 },
    { html: `<span style="color:#38bdf8;">│</span>  <span style="color:#64748b;">○ Exit</span>`, delay: 60 },
    { html: `<span style="color:#38bdf8;">└</span>  <span style="color:#64748b;">↑/↓ to navigate • Enter: confirm</span>`, delay: 60 }
  ],
  cli_ask: [
    ...HEADER_LINES,
    { type: 'banner', banner: ASCII_BANNER, delay: 80 },
    { html: `<span style="color:#38bdf8;">│</span>`, delay: 40 },
    { html: `<span style="color:#38bdf8;">◇</span>  <span style="color:#ffffff; font-weight:700;">Select a mode</span>`, delay: 40 },
    { html: `<span style="color:#38bdf8;">│</span>  <span style="color:#22c55e;">●</span> <span style="color:#ffffff; font-weight:600;">CLI</span>`, delay: 40 },
    { html: `<span style="color:#4ade80; font-weight:600;">StartingCLI mode...</span>`, delay: 70 },
    { html: `<span style="color:#38bdf8;">│</span>`, delay: 40 },
    { html: `<span style="color:#38bdf8;">◇</span>  <span style="color:#ffffff; font-weight:700;">Choose an option</span>`, delay: 40 },
    { html: `<span style="color:#38bdf8;">│</span>  <span style="color:#64748b;">○ Agent Mode</span>`, delay: 40 },
    { html: `<span style="color:#38bdf8;">│</span>  <span style="color:#64748b;">○ Plan Mode</span>`, delay: 40 },
    { html: `<span style="color:#38bdf8;">│</span>  <span style="color:#22c55e;">●</span> <span style="color:#ffffff; font-weight:600;">ASK Mode</span>`, delay: 50 },
    { html: `<br><span style="color:#ffffff; font-weight:700;">❓ Ask Mode</span><br>`, delay: 70 },
    { html: `<span style="color:#38bdf8;">│</span>`, delay: 40 },
    { html: `<span style="color:#38bdf8;">◇</span>  <span style="color:#ffffff; font-weight:700;">What do you want to ask?</span>`, delay: 50 },
    { html: `<span style="color:#38bdf8;">│</span>  <span style="color:#38bdf8;">Explain how ActionTracker stages modifications before applying</span>`, delay: 80 },
    { html: `<br><span style="color:#94a3b8;">ClawNest tools utilize an ActionTracker: file edits and shell commands are held in a pending state until explicitly approved by the developer.</span><br>`, delay: 100 },
    { html: `<span style="color:#38bdf8;">│</span>`, delay: 40 },
    { html: `<span style="color:#38bdf8;">◇</span>  <span style="color:#ffffff; font-weight:700;">Save this answer to a .md file in the current directory?</span>`, delay: 50 },
    { html: `<span style="color:#38bdf8;">│</span>  <span style="color:#22c55e;">●</span> <span style="color:#ffffff; font-weight:600;">No</span>`, delay: 40 }
  ],
  cli_plan: [
    ...HEADER_LINES,
    { type: 'banner', banner: ASCII_BANNER, delay: 80 },
    { html: `<span style="color:#4ade80; font-weight:600;">StartingCLI mode...</span>`, delay: 50 },
    { html: `<span style="color:#38bdf8;">│</span>`, delay: 30 },
    { html: `<span style="color:#38bdf8;">◇</span>  <span style="color:#ffffff; font-weight:700;">Choose an option</span>`, delay: 40 },
    { html: `<span style="color:#38bdf8;">│</span>  <span style="color:#22c55e;">●</span> <span style="color:#ffffff; font-weight:600;">Plan Mode</span>`, delay: 50 },
    { html: `<br><span style="color:#ffffff; font-weight:700;">🧭 Plan Mode</span><br>`, delay: 60 },
    { html: `<span style="color:#38bdf8;">│</span>`, delay: 30 },
    { html: `<span style="color:#38bdf8;">◇</span>  <span style="color:#ffffff; font-weight:700;">What is your goal?</span>`, delay: 50 },
    { html: `<span style="color:#38bdf8;">│</span>  <span style="color:#38bdf8;">Refactor authentication to support JWT refresh tokens</span>`, delay: 80 },
    { html: `<br><span style="color:#06b6d4;">🔍 Researching & drafting a plan…</span><br>`, delay: 100 },
    { html: `<span style="color:#34d399; font-weight:700;">📋 Strategic Plan Generated:</span>`, delay: 50 },
    { html: `  <span style="color:#fbbf24;">1.</span> Create token generation & verification utility <span style="color:#a855f7;">[low]</span>`, delay: 40 },
    { html: `  <span style="color:#fbbf24;">2.</span> Add refresh token rotation schema & endpoint <span style="color:#f97316;">[medium]</span>`, delay: 40 },
    { html: `  <span style="color:#fbbf24;">3.</span> Update middleware with expired session interception <span style="color:#ef4444;">[high]</span>`, delay: 40 },
    { html: `<br><span style="color:#38bdf8;">✨ Plan saved to plan.md. Ready for execution!</span>`, delay: 50 }
  ],
  cli_agent: [
    ...HEADER_LINES,
    { type: 'banner', banner: ASCII_BANNER, delay: 80 },
    { html: `<span style="color:#4ade80; font-weight:600;">StartingCLI mode...</span>`, delay: 50 },
    { html: `<span style="color:#38bdf8;">│</span>`, delay: 30 },
    { html: `<span style="color:#38bdf8;">◇</span>  <span style="color:#ffffff; font-weight:700;">Choose an option</span>`, delay: 40 },
    { html: `<span style="color:#38bdf8;">│</span>  <span style="color:#22c55e;">●</span> <span style="color:#ffffff; font-weight:600;">Agent Mode</span>`, delay: 50 },
    { html: `<br><span style="color:#ffffff; font-weight:700;">🤖 Agent Mode</span><br>`, delay: 60 },
    { html: `<span style="color:#38bdf8;">│</span>`, delay: 30 },
    { html: `<span style="color:#38bdf8;">◇</span>  <span style="color:#ffffff; font-weight:700;">What is your task?</span>`, delay: 50 },
    { html: `<span style="color:#38bdf8;">│</span>  <span style="color:#38bdf8;">Add rate limiting to express auth route</span>`, delay: 80 },
    { html: `<br><span style="color:#94a3b8;">🔍 Reading workspace files: src/routes/auth.ts</span>`, delay: 60 },
    { html: `<span style="color:#fbbf24; font-weight:700;">📋 STAGED CHANGES WAITING FOR APPROVAL:</span>`, delay: 50 },
    { html: `  <span style="color:#4ade80;">+ import { rateLimiter } from "../middleware/rate-limit.ts";</span>`, delay: 40 },
    { html: `  <span style="color:#4ade80;">+ router.use("/login", rateLimiter({ max: 5, windowMs: 60000 }));</span>`, delay: 40 },
    { html: `<br><span style="color:#38bdf8;">│</span>`, delay: 30 },
    { html: `<span style="color:#38bdf8;">◇</span>  <span style="color:#ffffff; font-weight:700;">Approve and apply staged changes to vessel?</span>`, delay: 50 },
    { html: `<span style="color:#38bdf8;">│</span>  <span style="color:#22c55e;">● Yes</span>`, delay: 40 },
    { html: `<span style="color:#34d399; font-weight:700;">✅ Changes safely applied!</span>`, delay: 40 }
  ],
  telegram: [
    ...HEADER_LINES,
    { type: 'banner', banner: ASCII_BANNER, delay: 80 },
    { html: `<span style="color:#38bdf8;">│</span>`, delay: 40 },
    { html: `<span style="color:#38bdf8;">◇</span>  <span style="color:#ffffff; font-weight:700;">Select a mode</span>`, delay: 40 },
    { html: `<span style="color:#38bdf8;">│</span>  <span style="color:#64748b;">○ CLI</span>`, delay: 40 },
    { html: `<span style="color:#38bdf8;">│</span>  <span style="color:#22c55e;">●</span> <span style="color:#ffffff; font-weight:600;">Telegram</span>`, delay: 50 },
    { html: `<span style="color:#4ade80; font-weight:600;">Starting Telegram mode...</span>`, delay: 70 },
    { html: `<br><span style="color:#38bdf8; font-weight:700;">🤖 Starting Telegram Bot...</span>`, delay: 50 },
    { html: `<span style="color:#34d399;">✅ Bot is running! Press Ctrl+C to stop.</span>`, delay: 50 },
    { html: `<span style="color:#94a3b8;">Waiting for messages via Telegram...</span>`, delay: 60 }
  ]
};

let currentTimeoutId = null;

export function initTerminalSimulator() {
  const terminalBody = document.getElementById('terminalOutput');
  const triggerBtns = document.querySelectorAll('.cmd-trigger-btn');

  if (!terminalBody) return;

  function renderScenario(key) {
    if (currentTimeoutId) {
      clearTimeout(currentTimeoutId);
    }
    terminalBody.innerHTML = '';

    const lines = SCENARIOS[key] || SCENARIOS.wakeup;
    let accumulatedTime = 0;

    lines.forEach((line) => {
      accumulatedTime += (line.delay || 50);

      currentTimeoutId = setTimeout(() => {
        const lineElem = document.createElement('div');
        lineElem.style.fontFamily = "'JetBrains Mono', Consolas, 'Courier New', monospace";
        lineElem.style.lineHeight = '1.35';

        if (line.type === 'banner') {
          lineElem.className = 'terminal-banner-art';
          lineElem.textContent = line.banner;
        } else {
          lineElem.innerHTML = line.html;
        }

        terminalBody.appendChild(lineElem);
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }, accumulatedTime);
    });
  }

  triggerBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      triggerBtns.forEach(b => b.classList.remove('active-mode-btn'));
      btn.classList.add('active-mode-btn');
      const mode = btn.getAttribute('data-mode');
      renderScenario(mode);
    });
  });

  // Initial render with wakeup
  renderScenario('wakeup');
}
