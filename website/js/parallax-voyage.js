/* ==========================================================================
   BOY-COY STYLE MULTI-LAYER PARALLAX VOYAGE ENGINE
   Smooth 60fps scroll listener, layered physics & ship voyage guidance
   ========================================================================== */

export function initParallaxVoyage() {
  const sun = document.querySelector('.clay-sun');
  const clouds = document.querySelectorAll('.clay-cloud');
  const shipGuide = document.querySelector('.voyage-ship-guide');
  const hudItems = document.querySelectorAll('.hud-item');
  const sections = document.querySelectorAll('section[id]');

  let latestScrollY = 0;
  let ticking = false;
  let lastScrollY = 0;
  let shipVelocity = 0;

  function onScroll() {
    latestScrollY = window.scrollY;
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  function updateParallax() {
    const scrollY = latestScrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(Math.max(scrollY / (maxScroll || 1), 0), 1);

    // Calculate scroll velocity for ship tilt
    shipVelocity = (scrollY - lastScrollY) * 0.4;
    lastScrollY = scrollY;
    const shipTilt = Math.max(Math.min(shipVelocity, 25), -25);

    // 1. Sun subtle parallax
    if (sun) {
      sun.style.transform = `translate3d(0, ${scrollY * 0.12}px, 0)`;
    }

    // 2. Cloud layers differential speeds
    clouds.forEach((cloud, index) => {
      const speed = 0.18 + index * 0.08;
      const xOffset = (index % 2 === 0 ? 1 : -1) * (scrollY * 0.05);
      cloud.style.transform = `translate3d(${xOffset}px, ${scrollY * speed}px, 0)`;
    });

    // 3. Boy-Coy Ship Voyage Path (S-curve down the Grand Line)
    if (shipGuide) {
      // Moves subtly horizontally and vertically along the voyage
      const swayX = Math.sin(progress * Math.PI * 4) * 35;
      const verticalOffset = (progress - 0.5) * 120;
      shipGuide.style.transform = `translate3d(${swayX}px, calc(-50% + ${verticalOffset}px), 0) rotate(${shipTilt}deg)`;
    }

    // 4. Update HUD active state
    let currentSectionId = '';
    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.2) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    if (currentSectionId) {
      hudItems.forEach((item) => {
        if (item.getAttribute('href') === `#${currentSectionId}`) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }

    ticking = false;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  // Initial frame
  updateParallax();
}
