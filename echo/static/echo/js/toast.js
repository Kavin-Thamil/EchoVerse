document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("toast-container");

    if (!container) {
        return;
    }

    window.showToast = function ({
        title = "EchoVerse",
        message = "",
        type = "primary",
        delay = 3000,
    } = {}) {
        const toast = document.createElement("div");

        toast.className = `toast text-bg-${type} border-0`;
        toast.role = "alert";
        toast.ariaLive = "assertive";
        toast.ariaAtomic = "true";

        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <strong>${escapeHtml(title)}</strong><br>
                    ${escapeHtml(message)}
                </div>

                <button
                    type="button"
                    class="btn-close btn-close-white me-2 m-auto"
                    data-bs-dismiss="toast"
                    aria-label="Close"
                ></button>
            </div>
        `;

        container.appendChild(toast);

        const bootstrapToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay,
        });

        bootstrapToast.show();

        toast.addEventListener("hidden.bs.toast", () => {
            toast.remove();
        });
    };

    function escapeHtml(value) {
        const div = document.createElement("div");
        div.textContent = value ?? "";
        return div.innerHTML;
    }
});