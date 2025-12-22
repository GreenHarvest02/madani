const recipes = [
    {
        id: 1,
        title: "Tuscan Mason Jar Salad",
        category: "italian",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600",
        calories: "350 kcal",
        time: "10 min"
    },
    {
        id: 2,
        title: "Classic Caprese Bottele",
        category: "italian",
        image: "https://images.unsplash.com/photo-1529312266912-b33cf6227e24?auto=format&fit=crop&q=80&w=600",
        calories: "280 kcal",
        time: "5 min"
    },
    {
        id: 3,
        title: "Pesto Pasta Power Jar",
        category: "italian",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=600",
        calories: "450 kcal",
        time: "15 min"
    },
    {
        id: 4,
        title: "Cobb Salad Shake",
        category: "american",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600",
        calories: "400 kcal",
        time: "12 min"
    },
    {
        id: 5,
        title: "Ranch Chicken Layered Bottele",
        category: "american",
        image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&q=80&w=600",
        calories: "500 kcal",
        time: "20 min"
    },
    {
        id: 6,
        title: "Southwest Fiesta Jar",
        category: "american",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600",
        calories: "380 kcal",
        time: "15 min"
    }
];

const recipeGrid = document.getElementById('recipe-grid');
const tabs = document.querySelectorAll('.tab-btn');

function renderRecipes(filter = 'italian') {
    if (!recipeGrid) return; // Guard clause

    recipeGrid.innerHTML = '';

    const filteredRecipes = recipes.filter(recipe => recipe.category === filter);

    filteredRecipes.forEach((recipe, index) => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.style.animationDelay = `${index * 0.1}s`;

        card.innerHTML = `
            <div class="recipe-img" style="background-image: url('${recipe.image}')"></div>
            <div class="recipe-content">
                <span class="recipe-tag">${recipe.category} Style</span>
                <h3 class="recipe-title">${recipe.title}</h3>
                <div class="recipe-meta">
                    <span><i data-lucide="clock"></i> ${recipe.time}</span>
                    <span><i data-lucide="flame"></i> ${recipe.calories}</span>
                </div>
            </div>
        `;

        recipeGrid.appendChild(card);
    });

    // Re-initialize icons for new elements
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Event Listeners
if (tabs.length > 0) {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all
            tabs.forEach(t => t.classList.remove('active'));
            // Add active to clicked
            tab.classList.add('active');

            const category = tab.getAttribute('data-category');
            renderRecipes(category);
        });
    });
}

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    if (recipeGrid) {
        renderRecipes('italian');
    }
});
