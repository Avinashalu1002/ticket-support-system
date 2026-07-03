/* =====================================================================
   TICKET SUPPORT SYSTEM — TOAST NOTIFICATION ENGINE
   Enterprise-style, top-right toasts. Replaces every alert()/browser
   popup in the app. Auto-hides after 3.5s, has a progress bar, close
   button, icons per type, and is dark-mode compatible.

   Usage:
     Toast.success("Ticket Created", "Ticket #128 was created successfully.");
     Toast.error("Something went wrong", "Please try again.");
     Toast.warning("Heads up", "This ticket is overdue.");
     Toast.info("New comment", "An engineer replied to your ticket.");
     Toast.show({ type: "success", title: "...", message: "...", duration: 4000 });
   ===================================================================== */

(function (window) {
    "use strict";

    const ICONS = {
        success: "bi-check-circle-fill",
        error: "bi-x-circle-fill",
        warning: "bi-exclamation-triangle-fill",
        info: "bi-info-circle-fill"
    };

    const TITLES = {
        success: "Success",
        error: "Error",
        warning: "Warning",
        info: "Information"
    };

    const DEFAULT_DURATION = 3500;

    function ensureContainer() {
        let container = document.getElementById("dsToastContainer");

        if (!container) {
            container = document.createElement("div");
            container.id = "dsToastContainer";
            container.setAttribute("aria-live", "polite");
            container.setAttribute("aria-atomic", "true");
            document.body.appendChild(container);
        }

        return container;
    }

    function escapeHtml(str) {
        if (str === null || str === undefined) return "";
        return String(str)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function show(options) {
        if (typeof options === "string") {
            options = { type: "info", message: options };
        }

        const type = ["success", "error", "warning", "info"].includes(options.type)
            ? options.type
            : "info";

        const title = options.title || TITLES[type];
        const message = options.message || "";
        const duration = typeof options.duration === "number" ? options.duration : DEFAULT_DURATION;

        const container = ensureContainer();

        const toast = document.createElement("div");
        toast.className = `ds-toast ds-toast-${type}`;
        toast.setAttribute("role", "alert");

        toast.innerHTML = `
            <div class="ds-toast-icon">
                <i class="bi ${ICONS[type]}"></i>
            </div>
            <div class="ds-toast-body">
                <p class="ds-toast-title">${escapeHtml(title)}</p>
                ${message ? `<p class="ds-toast-message">${escapeHtml(message)}</p>` : ""}
            </div>
            <button type="button" class="ds-toast-close" aria-label="Close">
                <i class="bi bi-x-lg"></i>
            </button>
            <div class="ds-toast-progress-track">
                <div class="ds-toast-progress-bar" style="animation-duration:${duration}ms;"></div>
            </div>
        `;

        container.appendChild(toast);

        let dismissTimer = setTimeout(() => dismiss(toast), duration);

        toast.querySelector(".ds-toast-close").addEventListener("click", () => {
            clearTimeout(dismissTimer);
            dismiss(toast);
        });

        // Pause auto-dismiss + progress bar on hover
        toast.addEventListener("mouseenter", () => {
            clearTimeout(dismissTimer);
            const bar = toast.querySelector(".ds-toast-progress-bar");
            if (bar) bar.style.animationPlayState = "paused";
        });

        toast.addEventListener("mouseleave", () => {
            dismissTimer = setTimeout(() => dismiss(toast), 1200);
            const bar = toast.querySelector(".ds-toast-progress-bar");
            if (bar) bar.style.animationPlayState = "running";
        });

        return toast;
    }

    function dismiss(toast) {
        if (!toast || toast.classList.contains("ds-toast-hide")) return;

        toast.classList.add("ds-toast-hide");

        toast.addEventListener("animationend", () => {
            toast.remove();
        }, { once: true });

        // Fallback in case animationend doesn't fire
        setTimeout(() => {
            if (toast.parentNode) toast.remove();
        }, 400);
    }

    const Toast = {
        show,
        success(title, message, duration) {
            return show({ type: "success", title, message, duration });
        },
        error(title, message, duration) {
            return show({ type: "error", title, message, duration });
        },
        warning(title, message, duration) {
            return show({ type: "warning", title, message, duration });
        },
        info(title, message, duration) {
            return show({ type: "info", title, message, duration });
        },
        /**
         * Queue a toast to be shown on the NEXT page load — useful right
         * before a redirect (e.g. logout) where the current page is about
         * to be torn down before the toast would finish animating in.
         */
        queue(type, title, message) {
            try {
                sessionStorage.setItem(
                    "ds_pending_toast",
                    JSON.stringify({ type, title, message })
                );
            } catch (e) {
                // sessionStorage unavailable — fail silently
            }
        }
    };

    function showQueuedToast() {
        let pending;

        try {
            pending = sessionStorage.getItem("ds_pending_toast");
        } catch (e) {
            return;
        }

        if (!pending) return;

        sessionStorage.removeItem("ds_pending_toast");

        try {
            const data = JSON.parse(pending);
            show(data);
        } catch (e) {
            // ignore malformed payload
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", showQueuedToast);
    } else {
        showQueuedToast();
    }

    window.Toast = Toast;

})(window);
