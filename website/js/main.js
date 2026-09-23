/* ==========================================================================
   MAIN JAVASCRIPT - CLAWNEST ONE PIECE CLAYMORPHISM LANDING PAGE
   OS Detection, 1-Line Command Hub, Clipboard Engine & Audio/Toast Feedback
   ========================================================================== */

import { initParallaxVoyage } from './parallax-voyage.js';
import { initTerminalSimulator } from './terminal-simulator.js';

const COMMANDS = {
  mac: "curl -fsSL https://raw.githubusercontent.com/Pratyaksh0x1/ClawNest/main/website/public/install.sh | bash",
  linux: "curl -fsSL https://raw.githubusercontent.com/Pratyaksh0x1/ClawNest/main/website/public/install.sh | bash",
  win: "irm https://raw.githubusercontent.com/Pratyaksh0x1/ClawNest/main/website/public/install.ps1 | iex",
  bun: "bunx clawnest-ai wakeup",
  npm: "npx clawnest-ai wakeup"
};

function detectUserOS() {
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.includes('win')) return 'win';
  if (ua.includes('mac')) return 'mac';
  if (ua.includes('linux')) return 'linux';
  return 'mac';
}

function showToast(message) {
  let toast = document.getElementById('clayToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'clayToast';
    toast.className = 'clay-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<span>🏴‍☠️</span> <span>${message}</span>`;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// Confetti micro-burst for successful copy
function spawnClaySparkles(x, y) {
  const colors = ['#fbbf24', '#ef4444', '#38bdf8', '#8b5cf6', '#ffffff'];
  for (let i = 0; i < 16; i++) {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.width = `${Math.random() * 8 + 6}px`;
    sparkle.style.height = sparkle.style.width;
    sparkle.style.borderRadius = '50%';
    sparkle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    sparkle.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    sparkle.style.zIndex = '999999';
    sparkle.style.pointerEvents = 'none';

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 80 + 30;
    const destX = Math.cos(angle) * velocity;
    const destY = Math.sin(angle) * velocity - 20;

    document.body.appendChild(sparkle);

    sparkle.animate([
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${destX}px, ${destY}px) scale(0)`, opacity: 0 }
    ], {
      duration: 650,
      easing: 'cubic-bezier(0.2, 0.9, 0.3, 1)'
    }).onfinish = () => sparkle.remove();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Parallax & Terminal
  initParallaxVoyage();
  initTerminalSimulator();

  // 2. Setup 1-Line Install Command Switcher
  const detectedOS = detectUserOS();
  const osTabs = document.querySelectorAll('.os-tab');
  const commandText = document.getElementById('commandText');
  const copyBtn = document.getElementById('copyBtn');

  function setActiveTab(targetOS) {
    osTabs.forEach(tab => {
      if (tab.getAttribute('data-os') === targetOS) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });

    if (commandText) {
      commandText.textContent = COMMANDS[targetOS] || COMMANDS.mac;
    }
  }

  // Pre-select based on visitor's OS
  setActiveTab(detectedOS === 'win' ? 'win' : 'mac');

  osTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const os = tab.getAttribute('data-os');
      setActiveTab(os);
    });
  });

  // 3. Setup 1-Click Copy
  if (copyBtn && commandText) {
    copyBtn.addEventListener('click', (e) => {
      const textToCopy = commandText.textContent;
      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast('Copied to Log Pose, Captain! 🏴‍☠️');
        const rect = copyBtn.getBoundingClientRect();
        spawnClaySparkles(rect.left + rect.width / 2, rect.top + rect.height / 2);

        // Tactile button squash
        copyBtn.style.transform = 'scale(0.92)';
        setTimeout(() => {
          copyBtn.style.transform = '';
        }, 150);
      }).catch(err => {
        console.error('Failed to copy', err);
      });
    });
  }

  // 4. Setup Documentation Tab Switcher
  const docButtons = document.querySelectorAll('.doc-nav-btn');
  const docPanes = document.querySelectorAll('.doc-pane');

  docButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTabId = btn.getAttribute('data-tab');

      docButtons.forEach(b => b.classList.remove('active'));
      docPanes.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const targetPane = document.getElementById(targetTabId);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
});

