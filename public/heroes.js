document.addEventListener("DOMContentLoaded", async () => {
    const heroGallery = document.getElementById("hero-gallery");

    try {
        // Використовуємо динамічний URL (Render або локальний)
        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/api/heroes`);

        if (!response.ok) {
            throw new Error(`Помилка отримання даних: ${response.statusText}`);
        }

        const heroes = await response.json();

        // Генеруємо HTML для відображення героїв
        heroGallery.innerHTML = heroes
            .map(
                (hero) => `
            <div class="hero-card">
                <img src="${baseUrl}${hero.photo}" alt="${hero.name}">
                <h3>${hero.name}</h3>
                <p><strong>Категорія:</strong> ${hero.category}</p>
                <p>${hero.biography}</p>
            </div>
        `
            )
            .join("");
    } catch (error) {
        console.error("Помилка завантаження героїв:", error);
        heroGallery.innerHTML = "<p style='color: red;'>Не вдалося завантажити героїв. Спробуйте пізніше.</p>";
    }
});