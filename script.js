
(() => {
  const openButton = document.getElementById("openLetter");
  const envelope = document.getElementById("envelope");
  const hint = document.getElementById("hint");
  const letterArea = document.getElementById("letterArea");
  const backButton = document.getElementById("backToTop");
  const opening = document.getElementById("opening");
  const canvas = document.getElementById("embers");
  const ctx = canvas.getContext("2d");

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles = [];
  let frameId = null;
  let isOpen = false;

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    particles = Array.from(
      { length: Math.min(45, Math.floor(width / 18)) },
      () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.4,
        speed: Math.random() * 0.28 + 0.08,
        alpha: Math.random() * 0.35 + 0.08
      })
    );

    if (frameId) {
      cancelAnimationFrame(frameId);
    }

    drawParticles();
  }

  function drawParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = "#ff526d";
      ctx.shadowBlur = 9;
      ctx.shadowColor = "#e51f43";

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      if (!reducedMotion) {
        p.y -= p.speed;
        p.x += Math.sin(p.y / 75) * 0.12;

        if (p.y < -5) {
          p.y = height + 5;
          p.x = Math.random() * width;
        }
      }
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;

    if (!reducedMotion) {
      frameId = requestAnimationFrame(drawParticles);
    }
  }

  function openLetter() {
    if (isOpen) return;

    isOpen = true;
    envelope.classList.add("open");
    hint.textContent = "your letter is opening…";
    openButton.setAttribute("aria-expanded", "true");

    window.setTimeout(() => {
      letterArea.classList.add("visible");
      letterArea.setAttribute("aria-hidden", "false");
      hint.textContent = "a letter, just for you ♡";

      window.setTimeout(() => {
        letterArea.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start"
        });
      }, reducedMotion ? 0 : 220);
    }, reducedMotion ? 0 : 650);
  }

  openButton.addEventListener("click", openLetter);

  backButton.addEventListener("click", () => {
    opening.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start"
    });
  });

  window.addEventListener("resize", resizeCanvas);

  resizeCanvas();
})();
