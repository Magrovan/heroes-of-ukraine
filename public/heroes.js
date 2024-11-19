document.addEventListener("DOMContentLoaded", async () => {
    const heroGallery = document.getElementById("hero-gallery");

    try {
        const response = await fetch("http://localhost:5000/api/heroes");
        if (!response.ok) {
            throw new Error(`Помилка отримання даних: ${response.statusText}`);
        }
        const heroes = await response.json();

        heroGallery.innerHTML = heroes
            .map(
                (hero) => `
            <div class="hero-card">
                <img src="http://localhost:5000${hero.photo}" alt="${hero.name}">
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
