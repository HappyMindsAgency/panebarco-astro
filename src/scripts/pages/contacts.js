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

  function setupBriefContactForm(cleanups) {
    var form = document.getElementById("contactBriefForm");
    if (!form) return;

    var controller = new AbortController();
    var signal = controller.signal;

    var REQUIRED_FIELD_IDS = [
      "briefNome",
      "briefCognome",
      "briefEmail",
      "briefTelefono",
      "briefAzienda",
      "briefRuolo",
      "briefPaese",
      "briefCitta",
      "briefMessaggio",
    ];

    function getFieldError(field) {
      var value = field.value.trim();
      if (field.tagName === "SELECT") {
        return value ? "" : "Seleziona un'opzione";
      }
      if (field.type === "email") {
        if (!value) return "Campo obbligatorio";
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Inserisci un indirizzo email valido";
      }
      return value ? "" : "Campo obbligatorio";
    }

    function setFieldError(fieldId, message) {
      var field = document.getElementById(fieldId);
      var errorEl = document.getElementById(fieldId + "-error");
      if (field) field.classList.toggle("is-brief-invalid", !!message);
      if (errorEl) {
        errorEl.hidden = !message;
        errorEl.textContent = message || "";
      }
    }

    function validateAll() {
      var firstInvalidEl = null;

      REQUIRED_FIELD_IDS.forEach(function (id) {
        var field = document.getElementById(id);
        if (!field) return;
        var err = getFieldError(field);
        setFieldError(id, err);
        if (err && !firstInvalidEl) firstInvalidEl = field;
      });

      // motivo: almeno una checkbox selezionata
      var motivoChecked = form.querySelectorAll('input[name="motivo"]:checked').length > 0;
      var motivoErrorEl = document.getElementById("briefMotivo-error");
      var motivoGroup = document.getElementById("briefMotivoGroup");
      if (!motivoChecked) {
        if (motivoErrorEl) { motivoErrorEl.hidden = false; motivoErrorEl.textContent = "Seleziona almeno un'opzione"; }
        if (motivoGroup) motivoGroup.classList.add("is-brief-invalid");
        if (!firstInvalidEl) firstInvalidEl = motivoGroup;
      } else {
        if (motivoErrorEl) { motivoErrorEl.hidden = true; motivoErrorEl.textContent = ""; }
        if (motivoGroup) motivoGroup.classList.remove("is-brief-invalid");
      }

      // privacy: obbligatorio
      var privacyField = document.getElementById("briefPrivacy");
      if (privacyField && !privacyField.checked) {
        setFieldError("briefPrivacy", "Devi accettare la Privacy Policy per procedere");
        if (!firstInvalidEl) firstInvalidEl = privacyField;
      } else {
        setFieldError("briefPrivacy", "");
      }

      return firstInvalidEl;
    }

    function setSubmitLoading(loading) {
      var btn = document.getElementById("briefFormSubmit");
      if (!btn) return;
      btn.disabled = loading;
      var textEl = btn.querySelector(".contacts-brief-submit__text");
      var loadingEl = btn.querySelector(".contacts-brief-submit__loading");
      if (textEl) textEl.hidden = loading;
      if (loadingEl) loadingEl.hidden = !loading;
    }

    function collectFormData() {
      var data = {};
      var fd = new FormData(form);
      fd.forEach(function (value, key) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          if (!Array.isArray(data[key])) data[key] = [data[key]];
          data[key].push(value);
        } else {
          data[key] = value;
        }
      });
      return data;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var firstInvalidEl = validateAll();
      if (firstInvalidEl) {
        firstInvalidEl.scrollIntoView({ behavior: "smooth", block: "center" });
        if (typeof firstInvalidEl.focus === "function") {
          setTimeout(function () { firstInvalidEl.focus(); }, 350);
        }
        return;
      }

      setSubmitLoading(true);

      var apiErrorEl = document.getElementById("briefFormApiError");
      if (apiErrorEl) apiErrorEl.hidden = true;

      var data = collectFormData();

      // TODO: sostituire con l'endpoint reale
      console.log("[ContactBriefForm] Invio dati:", data);
      var mockRequest = new Promise(function (resolve) { setTimeout(resolve, 1200); });

      mockRequest
        .then(function () {
          var successEl = document.getElementById("briefFormSuccess");
          if (successEl) successEl.hidden = false;
          form.hidden = true;
        })
        .catch(function (err) {
          console.error("[ContactBriefForm] Errore invio:", err);
          if (apiErrorEl) apiErrorEl.hidden = false;
          setSubmitLoading(false);
        });
    }, { signal: signal });

    cleanups.push(function () {
      controller.abort();
    });
  }

  function initContactsPage() {
    cleanupContactsPage();

    const cleanups = [];
    setupContactsTabs(cleanups);
    setupBriefContactForm(cleanups);

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
