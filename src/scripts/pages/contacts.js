(function () {
  let cleanupContactsPage = function () {};

  function setupContactsTabs(cleanups) {
    const roots = Array.from(document.querySelectorAll("[data-contacts-tabs]"));
    if (roots.length === 0) return;

    roots.forEach(function (root) {
      const buttons = Array.from(root.querySelectorAll("[data-contacts-tab]"));
      const panels = Array.from(root.querySelectorAll("[data-contacts-panel]"));

      if (buttons.length === 0 || panels.length === 0 || buttons.length !== panels.length) {
        return;
      }

      const controller = new AbortController();
      const signal = controller.signal;

      function activateTab(targetKey) {
        buttons.forEach(function (button) {
          const isActive = button.getAttribute("data-contacts-tab") === targetKey;
          button.classList.toggle("is-active", isActive);
          button.setAttribute("aria-selected", String(isActive));
          button.tabIndex = isActive ? 0 : -1;
        });

        panels.forEach(function (panel) {
          const isActive = panel.getAttribute("data-contacts-panel") === targetKey;
          panel.classList.toggle("is-active", isActive);
          panel.hidden = !isActive;
        });
      }

      buttons.forEach(function (button, index) {
        button.addEventListener("click", function () {
          activateTab(button.getAttribute("data-contacts-tab"));
        }, { signal });

        button.addEventListener("keydown", function (event) {
          if (event.key !== "ArrowRight" && event.key !== "ArrowLeft" && event.key !== "Home" && event.key !== "End") {
            return;
          }

          event.preventDefault();

          let nextIndex = index;

          if (event.key === "ArrowRight") {
            nextIndex = (index + 1) % buttons.length;
          } else if (event.key === "ArrowLeft") {
            nextIndex = (index - 1 + buttons.length) % buttons.length;
          } else if (event.key === "Home") {
            nextIndex = 0;
          } else if (event.key === "End") {
            nextIndex = buttons.length - 1;
          }

          const nextButton = buttons[nextIndex];
          if (!nextButton) return;

          activateTab(nextButton.getAttribute("data-contacts-tab"));
          nextButton.focus();
        }, { signal });
      });

      const activeButton = buttons.find(function (button) {
        return button.classList.contains("is-active");
      }) || buttons[0];

      if (activeButton) {
        activateTab(activeButton.getAttribute("data-contacts-tab"));
      }

      cleanups.push(function () {
        controller.abort();
      });
    });
  }

  function initContactsPage() {
    cleanupContactsPage();

    const cleanups = [];
    setupContactsTabs(cleanups);

    cleanupContactsPage = function () {
      cleanups.forEach(function (dispose) {
        dispose();
      });
    };
  }

  if (!window.__panebarcoContactsBound) {
    document.addEventListener("astro:before-swap", function () {
      cleanupContactsPage();
    });

    document.addEventListener("astro:page-load", initContactsPage);
    window.__panebarcoContactsBound = true;
  }

  initContactsPage();
})();
