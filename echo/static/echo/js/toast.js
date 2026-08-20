// Define globally immediately; no need to wait for DOM load
window.showToast = function ({
    title = "EchoVerse",
    message = "",
    type = "primary",
    delay = 3000,
} = {}) {
    // Dynamically grab the container every time so it works seamlessly with Turbo page swaps
    const container = document.getElementById("toast-container");

    if (!container) {
        console.warn("Toast container not found in DOM.");
        return;
    }

    const toast = document.createElement("div");

    toast.className = `toast text-bg-${type} border-0 shadow-lg`;
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

    // Clean up the DOM node after it fades out
    toast.addEventListener("hidden.bs.toast", () => {
        toast.remove();
    });
};

function escapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = value ?? "";
    return div.innerHTML;
}