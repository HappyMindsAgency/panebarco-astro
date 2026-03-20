(function () {
  let cleanupHomePage = function () {};

  function setupRevealTitles(cleanups) {
    const revealTitles = document.querySelectorAll(".section-title-reveal:not([data-reveal-managed='self'])");
    if (!revealTitles.length) return;

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      revealTitles.forEach(function (title) {
        title.classList.add("is-in-view");
      });
      return;
    }

    let lastScrollY = window.scrollY;
    const observer = new IntersectionObserver(
      function (entries) {
        const currentScrollY = window.scrollY;
        const isScrollingUp = currentScrollY < lastScrollY;
        lastScrollY = currentScrollY;

        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in-view");
            return;
          }

          if (isScrollingUp) {
            entry.target.classList.remove("is-in-view");
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: "-35% 0px -35% 0px",
      }
    );

    revealTitles.forEach(function (title) {
      observer.observe(title);
    });

    cleanups.push(function () {
      observer.disconnect();
    });
  }

  function setupTypingText(cleanups) {
    const typingText = document.getElementById("typing-text");
    if (!typingText) return;

    const words = (typingText.dataset.words || "")
      .split("|")
      .map(function (word) {
        return word.trim();
      })
      .filter(Boolean);

    if (words.length === 0) return;

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentColor = "#009FE3";
    let timeoutId = null;
    let disposed = false;

    const palette = ["#009FE3", "#B03D4F", "#995791", "#3394B2", "#30997B"];
    const typingSpeed = 90;
    const deletingSpeed = 55;
    const wordPause = 1200;
    const restartPause = 350;

    function queue(nextStep, delay) {
      timeoutId = window.setTimeout(nextStep, delay);
    }

    function animateTyping() {
      if (disposed) return;

      const currentWord = words[wordIndex];

      if (!isDeleting) {
        if (charIndex === 0) {
          currentColor = palette[Math.floor(Math.random() * palette.length)];
          typingText.style.color = currentColor;
        }

        charIndex += 1;
        typingText.textContent = currentWord.slice(0, charIndex).toUpperCase();

        if (charIndex === currentWord.length) {
          isDeleting = true;
          queue(animateTyping, wordPause);
          return;
        }

        queue(animateTyping, typingSpeed);
        return;
      }

      charIndex -= 1;
      typingText.textContent = currentWord.slice(0, Math.max(0, charIndex)).toUpperCase();

      if (charIndex === 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        queue(animateTyping, restartPause);
        return;
      }

      queue(animateTyping, deletingSpeed);
    }

    typingText.textContent = "";
    queue(animateTyping, 500);

    cleanups.push(function () {
      disposed = true;
      if (timeoutId !== null) {
        window.clearTimeout(timeoutId);
      }
    });
  }

  function initHomePage() {
    cleanupHomePage();

    const cleanups = [];
    setupRevealTitles(cleanups);
    setupTypingText(cleanups);

    cleanupHomePage = function () {
      cleanups.forEach(function (dispose) {
        dispose();
      });
    };
  }

  if (!window.__panebarcoHomeBound) {
    document.addEventListener("astro:before-swap", function () {
      cleanupHomePage();
    });

    document.addEventListener("astro:page-load", initHomePage);
    window.__panebarcoHomeBound = true;
  }

  initHomePage();
})();
