/* =====================================================================
   TICKET SUPPORT SYSTEM — STANDARDIZED STATUS BADGE RENDERER
   One source of truth for status badge markup across Employee,
   Engineer and Admin modules. Pairs with css/design-system.css
   (.status-badge, .status-open, .status-inprogress, ...).

   Usage:
     renderStatusBadge("In Progress")  -> <span class="status-badge status-inprogress">...</span>
     renderPriorityBadge("High")       -> <span class="badge priority-badge-high">High</span>
   ===================================================================== */

(function (window) {
    "use strict";

    const STATUS_MAP = {
        "open":              { cls: "status-open",       icon: "bi-hourglass",            label: "Open" },
        "inprogress":        { cls: "status-inprogress",  icon: "bi-arrow-repeat",         label: "In Progress" },
        "in progress":       { cls: "status-inprogress",  icon: "bi-arrow-repeat",         label: "In Progress" },
        "resolved":          { cls: "status-resolved",    icon: "bi-check-circle-fill",    label: "Resolved" },
        "closed":            { cls: "status-closed",      icon: "bi-lock-fill",            label: "Closed" },
        "rejected":          { cls: "status-rejected",    icon: "bi-x-circle-fill",        label: "Rejected" },
        "pendingapproval":   { cls: "status-pending",     icon: "bi-clock-history",        label: "Pending Approval" },
        "pending approval":  { cls: "status-pending",     icon: "bi-clock-history",        label: "Pending Approval" }
    };

    function normalize(status) {
        return String(status || "").trim().toLowerCase();
    }

    function renderStatusBadge(status) {
        const key = normalize(status);
        const meta = STATUS_MAP[key] || {
            cls: "status-closed",
            icon: "bi-question-circle",
            label: status || "Unknown"
        };

        return `<span class="status-badge ${meta.cls}"><i class="bi ${meta.icon}"></i>${meta.label}</span>`;
    }

    function renderPriorityBadge(priority) {
        const key = normalize(priority);

        const PRIORITY_MAP = {
            high:   { cls: "priority-high",   icon: "bi-arrow-up-circle-fill" },
            medium: { cls: "priority-medium", icon: "bi-dash-circle-fill" },
            low:    { cls: "priority-low",    icon: "bi-arrow-down-circle-fill" }
        };

        const meta = PRIORITY_MAP[key] || { cls: "priority-medium", icon: "bi-circle-fill" };

        return `<span class="priority-badge ${meta.cls}"><i class="bi ${meta.icon}"></i>${priority || "N/A"}</span>`;
    }

    window.renderStatusBadge = renderStatusBadge;
    window.renderPriorityBadge = renderPriorityBadge;

    // Backwards-compatible aliases used by existing page scripts
    window.getStatusBadge = renderStatusBadge;
    window.getPriorityBadge = renderPriorityBadge;

})(window);
