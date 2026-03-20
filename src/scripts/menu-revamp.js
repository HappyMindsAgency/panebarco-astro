(function () {
  let cleanupMenu = function () {};

  function initMenu() {
    cleanupMenu();

    const menuBtn = document.querySelector(".menu-trigger");
    const topHeader = document.querySelector(".top-header");
    const overlay = document.getElementById("menuOverlayRevamp");
    const closeBtn = document.getElementById("menuOverlayRevampClose");
    const bubble = document.getElementById("menuOverlayRevampBubble");

    if (!menuBtn || !overlay || !closeBtn) {
      cleanupMenu = function () {};
      return;
    }

    const controller = new AbortController();
    const signal = controller.signal;
    const items = Array.from(overlay.querySelectorAll("[data-menu-item]"));
    const links = Array.from(overlay.querySelectorAll("[data-menu-link]"));
    const panelSections = Array.from(overlay.querySelectorAll("[data-panel-for]"));
    const toggles = Array.from(overlay.querySelectorAll(".menu-v2-toggle"));
    const mobileLinks = Array.from(overlay.querySelectorAll(".menu-v2-mobile-submenu-link, .menu-v2-panel-link, .menu-v2-panel-title"));
    const DESKTOP_HOVER_INTENT_MS = 120;
    let hoverIntentTimer = null;

    function isMobileViewport() {
      return window.matchMedia("(max-width: 767.98px)").matches;
    }

    function updateScrolledHeaderState() {
      if (!topHeader) return;
      const isScrolled = window.scrollY > 8;
      topHeader.classList.toggle("is-scrolled", isScrolled);
      topHeader.classList.toggle("shadow", isScrolled);
    }

    function setMenuCompensation() {
      const isMobileViewportActive = isMobileViewport();
      const scrollbarComp = isMobileViewportActive
        ? 0
        : Math.max(0, window.innerWidth - document.documentElement.clientWidth);

      document.documentElement.style.setProperty("--menu-scrollbar-comp", scrollbarComp + "px");
    }

    function collapseMobileSubmenus() {
      items.forEach(function (item) {
        item.classList.remove("is-open");
      });

      toggles.forEach(function (toggle) {
        toggle.setAttribute("aria-expanded", "false");
      });
    }

    function setActivePanel(id) {
      let hasMatchingPanel = false;

      panelSections.forEach(function (panel) {
        const isActive = panel.dataset.panelFor === id;
        panel.classList.toggle("is-active", isActive);
        if (isActive) hasMatchingPanel = true;
      });

      items.forEach(function (item) {
        item.classList.toggle("is-active", item.dataset.menuItem === id);
      });

      const activeItem = items.find(function (item) {
        return item.dataset.menuItem === id;
      });

      if (bubble && activeItem) {
        const src = activeItem.dataset.bubble || "";
        if (src) {
          bubble.src = src;
        }
      }

      overlay.classList.toggle("has-panel-content", hasMatchingPanel);
    }

    function clearHoverIntentTimer() {
      if (hoverIntentTimer) {
        window.clearTimeout(hoverIntentTimer);
        hoverIntentTimer = null;
      }
    }

    function scheduleDesktopPanelActivation(id) {
      clearHoverIntentTimer();
      hoverIntentTimer = window.setTimeout(function () {
        setActivePanel(id);
        hoverIntentTimer = null;
      }, DESKTOP_HOVER_INTENT_MS);
    }

    function getDefaultDesktopItemId() {
      const firstWithChildren = items.find(function (item) {
        return item.dataset.hasChildren === "true";
      });
      return firstWithChildren ? firstWithChildren.dataset.menuItem : items[0]?.dataset.menuItem;
    }

    function openMenu() {
      setMenuCompensation();
      collapseMobileSubmenus();
      overlay.classList.add("is-open");
      overlay.setAttribute("aria-hidden", "false");
      document.body.classList.add("menu-open");
      menuBtn.setAttribute("aria-expanded", "true");
      setActivePanel(getDefaultDesktopItemId());
    }

    function closeMenu() {
      clearHoverIntentTimer();
      collapseMobileSubmenus();
      overlay.classList.remove("is-open");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("menu-open");
      document.documentElement.style.removeProperty("--menu-scrollbar-comp");
      menuBtn.setAttribute("aria-expanded", "false");
    }

    menuBtn.setAttribute("aria-expanded", "false");
    updateScrolledHeaderState();

    menuBtn.addEventListener("click", function () {
      if (overlay.classList.contains("is-open")) {
        closeMenu();
        return;
      }

      openMenu();
    }, { signal });

    closeBtn.addEventListener("click", closeMenu, { signal });

    overlay.addEventListener("click", function (event) {
      if (event.target === overlay) {
        closeMenu();
      }
    }, { signal });

    links.forEach(function (link) {
      const id = link.dataset.menuLink;

      link.addEventListener("mouseenter", function () {
        if (isMobileViewport()) return;
        scheduleDesktopPanelActivation(id);
      }, { signal });

      link.addEventListener("focus", function () {
        if (isMobileViewport()) return;
        clearHoverIntentTimer();
        setActivePanel(id);
      }, { signal });

      link.addEventListener("click", closeMenu, { signal });
    });

    toggles.forEach(function (toggle) {
      toggle.addEventListener("click", function (event) {
        if (!isMobileViewport()) return;

        event.preventDefault();
        event.stopPropagation();

        const item = toggle.closest("[data-menu-item]");
        if (!item) return;

        const willOpen = !item.classList.contains("is-open");
        collapseMobileSubmenus();

        if (willOpen) {
          item.classList.add("is-open");
          toggle.setAttribute("aria-expanded", "true");
        }
      }, { signal });
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener("click", closeMenu, { signal });
    });

    window.addEventListener("resize", function () {
      clearHoverIntentTimer();
      if (overlay.classList.contains("is-open")) {
        setMenuCompensation();
        if (!isMobileViewport()) {
          collapseMobileSubmenus();
          setActivePanel(getDefaultDesktopItemId());
        }
      }
    }, { signal });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && overlay.classList.contains("is-open")) {
        closeMenu();
      }
    }, { signal });

    window.addEventListener("scroll", updateScrolledHeaderState, { passive: true, signal });

    cleanupMenu = function () {
      clearHoverIntentTimer();
      controller.abort();
    };
  }

  if (!window.__panebarcoMenuRevampBound) {
    document.addEventListener("astro:before-swap", function () {
      cleanupMenu();
    });

    document.addEventListener("astro:page-load", initMenu);
    window.__panebarcoMenuRevampBound = true;
  }

  initMenu();
})();
