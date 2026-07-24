document.addEventListener("DOMContentLoaded", () => {
    const favoriteForm = document.getElementById("favorite-form");

    if (!favoriteForm) {
        return;
    }

    const favoriteButton = document.getElementById("favorite-button");
    const favoriteText = document.getElementById("favorite-text");
    const favoriteCount = document.getElementById("favorite-count");
    const csrfInput = favoriteForm.querySelector(
        'input[name="csrfmiddlewaretoken"]'
    );

    if (
        !favoriteButton ||
        !favoriteText ||
        !favoriteCount ||
        !csrfInput
    ) {
        console.error("Favorite form is missing required elements.");
        return;
    }

    favoriteForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        favoriteButton.disabled = true;

        try {
            const response = await fetch(favoriteForm.action, {
                method: "POST",
                headers: {
                    "X-CSRFToken": csrfInput.value,
                    "X-Requested-With": "XMLHttpRequest",
                },
            });

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}.`);
            }

            const data = await response.json();

            if (!data.success) {
                throw new Error("Server reported an unsuccessful operation.");
            }

            favoriteText.textContent = data.is_favorited
                ? "❤️ Favorited"
                : "🤍 Add to Favorites";

            favoriteCount.textContent = data.favorites_count;

            favoriteButton.blur();
        } catch (error) {
            console.error("Favorite update failed:", error);
            alert("Something went wrong. Please try again.");
        } finally {
            favoriteButton.disabled = false;
        }
    });
});