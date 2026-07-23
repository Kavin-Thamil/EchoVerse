const favoriteForm = document.getElementById("favorite-form");

if (favoriteForm) {
    favoriteForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const favoriteButton = document.getElementById("favorite-button");
        const favoriteText = document.getElementById("favorite-text");
        const favoriteCount = document.getElementById("favorite-count");

        const csrfToken = document.querySelector(
            "[name=csrfmiddlewaretoken]"
        ).value;

        try {
            const response = await fetch(favoriteForm.action, {
                method: "POST",
                headers: {
                    "X-CSRFToken": csrfToken,
                    "X-Requested-With": "XMLHttpRequest",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to update favorite.");
            }

            const data = await response.json();

            if (data.success) {
                favoriteText.textContent = data.is_favorited
                    ? "❤️ Favorited"
                    : "🤍 Add to Favorites";

                favoriteCount.textContent = data.favorites_count;

                favoriteButton.blur();
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        }
    });
}