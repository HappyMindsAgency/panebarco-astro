(function () {
  let cleanupStudioPage = function () {};

  function setupTimeline(cleanups) {
    const timeline = document.querySelector("[data-studio-timeline]");
    if (!timeline) return;

    const slidesTrack = timeline.querySelector(".studio-timeline-slides");
    const slides = slidesTrack ? Array.from(slidesTrack.querySelectorAll(".studio-timeline-card")) : [];
    const prevBtn = timeline.querySelector("[data-timeline-prev]");
    const nextBtn = timeline.querySelector("[data-timeline-next]");
    const timelineSection = timeline.closest(".studio-timeline");
    const dots = timelineSection ? Array.from(timelineSection.querySelectorAll("[data-timeline-dot]")) : [];
    const viewport = timeline.querySelector(".studio-timeline-viewport");

    if (!slidesTrack || slides.length === 0 || !prevBtn || !nextBtn || dots.length !== slides.length) {
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;
    let activeIndex = 0;
    let touchStartX = null;
    const prefersReducedMotion = window.matchMedia
      && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      slidesTrack.style.transition = "none";
    }

    function mod(index, length) {
      return ((index % length) + length) % length;
    }

    function render(nextIndex) {
      activeIndex = mod(nextIndex, slides.length);
      slidesTrack.style.transform = "translateX(" + String(activeIndex * -100) + "%)";

      slides.forEach(function (slide, slideIndex) {
        const isActive = slideIndex === activeIndex;
        slide.classList.toggle("is-active", isActive);
        slide.setAttribute("aria-hidden", String(!isActive));
      });

      dots.forEach(function (dot, dotIndex) {
        const isActive = dotIndex === activeIndex;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-selected", String(isActive));
        dot.tabIndex = isActive ? 0 : -1;
      });
    }

    prevBtn.addEventListener("click", function () {
      render(activeIndex - 1);
    }, { signal });

    nextBtn.addEventListener("click", function () {
      render(activeIndex + 1);
    }, { signal });

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener("click", function () {
        render(dotIndex);
      }, { signal });
    });

    if (viewport) {
      viewport.addEventListener("touchstart", function (event) {
        if (!event.touches || event.touches.length === 0) return;
        touchStartX = event.touches[0].clientX;
      }, { passive: true, signal });

      viewport.addEventListener("touchend", function (event) {
        if (touchStartX === null || !event.changedTouches || event.changedTouches.length === 0) return;

        const deltaX = event.changedTouches[0].clientX - touchStartX;
        touchStartX = null;

        if (Math.abs(deltaX) < 40) return;
        if (deltaX > 0) {
          render(activeIndex - 1);
          return;
        }

        render(activeIndex + 1);
      }, { passive: true, signal });
    }

    render(0);

    cleanups.push(function () {
      controller.abort();
    });
  }

  function setupPanebarcosSlider(cleanups) {
    const image = document.querySelector("[data-studio-panebarcos-image]");
    const trigger = document.querySelector("[data-studio-panebarcos-trigger]");

    if (!image || !trigger) return;

    const controller = new AbortController();
    const signal = controller.signal;
    let images;
    try {
      images = JSON.parse(image.getAttribute("data-studio-panebarcos-images") || "[]");
    } catch (_error) {
      images = [];
    }

    if (!Array.isArray(images) || !images.length) {
      images = [
        { src: "/images/lo-studio-panebarcos-01.jpg", alt: "Il team Panebarcos in studio" },
        { src: "/images/lo-studio-panebarcos-02.jpg", alt: "Il team Panebarcos in studio" },
        { src: "/images/lo-studio-panebarcos-03.jpg", alt: "Il team Panebarcos in studio" },
        { src: "/images/lo-studio-panebarcos-04.jpg", alt: "Il team Panebarcos in studio" },
      ];
    }

    let activeIndex = images.findIndex(function (item) {
      return item && item.src === (image.getAttribute("src") || "");
    });
    if (activeIndex < 0) activeIndex = 0;

    images.slice(1).forEach(function (item) {
      const preloadImage = new Image();
      preloadImage.src = item.src;
    });

    trigger.addEventListener("click", function () {
      activeIndex = (activeIndex + 1) % images.length;
      image.setAttribute("src", images[activeIndex].src);
      image.setAttribute("alt", images[activeIndex].alt || image.getAttribute("alt") || "");
    }, { signal });

    cleanups.push(function () {
      controller.abort();
    });
  }

  function setupPanebarcosReveal(cleanups) {
    const items = Array.from(document.querySelectorAll("[data-panebarcos-reveal]"));
    if (!items.length) return;

    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(function (item) {
        item.classList.add("is-in-view");
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
        threshold: 0.12,
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    items.forEach(function (item) {
      observer.observe(item);
    });

    cleanups.push(function () {
      observer.disconnect();
    });
  }

  function initStudioPage() {
    cleanupStudioPage();

    const cleanups = [];
    setupTimeline(cleanups);
    setupPanebarcosSlider(cleanups);
    setupPanebarcosReveal(cleanups);

    cleanupStudioPage = function () {
      cleanups.forEach(function (dispose) {
        dispose();
      });
    };
  }

  if (!window.__panebarcoStudioBound) {
    document.addEventListener("astro:before-swap", function () {
      cleanupStudioPage();
    });

    document.addEventListener("astro:page-load", initStudioPage);
    window.__panebarcoStudioBound = true;
  }

  initStudioPage();
})();
