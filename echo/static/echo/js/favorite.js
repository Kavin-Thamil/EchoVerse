function initFavorite() {
    const form = document.getElementById("favorite-form");
    if (!form || form.dataset.initialized) return;

    form.dataset.initialized = "true";

    const btn = document.getElementById("favorite-button");
    const text = document.getElementById("favorite-text");
    const count = document.getElementById("favorite-count");
    const csrf = form.querySelector('input[name="csrfmiddlewaretoken"]');

    if (!btn || !text || !count || !csrf) {
        console.error("Favorite form missing elements");
        return;
    }

    let isSubmitting = false;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        isSubmitting = true;
        btn.disabled = true;

        const originalText = text.textContent;
        text.textContent = "⏳ Updating...";

        try {
            const res = await fetch(form.action, {
                method: "POST",
                headers: {
                    "X-CSRFToken": csrf.value,
                    "X-Requested-With": "XMLHttpRequest",
                },
            });

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            
            const data = await res.json();
            if (!data.success) throw new Error("Server rejected operation");

            text.textContent = data.is_favorited ? "❤️ Favorited" : "🤍 Add to Favorites";
            count.textContent = data.favorites_count;

            if (typeof window.showToast === "function") {
                window.showToast({
                    title: "Favorites",
                    message: data.is_favorited ? "Song added to favorites." : "Song removed from favorites.",
                    type: data.is_favorited ? "success" : "secondary",
                });
            }
            btn.blur();
            
        } catch (err) {
            console.error("Favorite toggle failed:", err);
            text.textContent = originalText;
            
            if (typeof window.showToast === "function") {
                window.showToast({ 
                    title: "Error", 
                    message: "Something went wrong. Try again.", 
                    type: "danger" 
                });
            } else {
                alert("Something went wrong. Try again.");
            }
        } finally {
            isSubmitting = false;
            btn.disabled = false;
        }
    });
}

document.addEventListener("DOMContentLoaded", initFavorite);
document.addEventListener("turbo:load", initFavorite);