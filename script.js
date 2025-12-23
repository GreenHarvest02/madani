const recipes = [
    {
        id: 1,
        title: "Tuscan Mason Jar Salad",
        category: "italian",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600",
        calories: "350 kcal",
        time: "10 min",
        ingredients: [
            "1/2 cup Cannellini beans, rinsed",
            "1 cup Cherry tomatoes, halved",
            "1/2 Cucumber, diced",
            "1/4 Red onion, thinly sliced",
            "2 cups Mixed greens (arugula/spinach)",
            "2 tbsp Balsamic Vinaigrette",
            "1 tbsp Pine nuts"
        ],
        instructions: [
            "Pour dressing into the bottom of the Harvest Bottle.",
            "Layer the heavier ingredients: beans, then cucumbers and onions.",
            "Add the tomatoes.",
            "Pack the mixed greens on top to keep them crisp.",
            "Sprinkle pine nuts before sealing.",
            "Shake well before eating!"
        ]
    },
    {
        id: 2,
        title: "Classic Caprese Bottele",
        category: "italian",
        image: "https://images.unsplash.com/photo-1529312266912-b33cf6227e24?auto=format&fit=crop&q=80&w=600",
        calories: "280 kcal",
        time: "5 min",
        ingredients: [
            "1 cup Cherry tomatoes",
            "1 cup Mozzarella pearls",
            "1/2 cup Fresh basil leaves",
            "2 tbsp Extra virgin olive oil",
            "1 tbsp Balsamic glaze",
            "Salt and pepper to taste"
        ],
        instructions: [
            "Whisk olive oil, balsamic glaze, salt, and pepper in a small bowl.",
            "Pour the dressing into the bottom of the bottle.",
            "Add tomatoes, then mozzarella pearls.",
            "Top with fresh basil leaves (tear them for more flavor).",
            "Seal and refrigerate until lunch."
        ]
    },
    {
        id: 3,
        title: "Pesto Pasta Power Jar",
        category: "italian",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=600",
        calories: "450 kcal",
        time: "15 min",
        ingredients: [
            "1 cup Fusilli pasta, cooked and cooled",
            "3 tbsp Pesto sauce",
            "1/2 cup Cherry tomatoes",
            "1/4 cup Parmesan cheese, shaved",
            "1 cup Spinach",
            "1 tbsp Toasted walnuts"
        ],
        instructions: [
            "Mix the cooked pasta with 1 tbsp of pesto to prevent sticking.",
            "Place remaining pesto at the bottom.",
            "Layer pasta, tomatoes, and walnuts.",
            "Add spinach and top with parmesan cheese.",
            "Enjoy cold or at room temperature."
        ]
    },
    {
        id: 4,
        title: "Cobb Salad Shake",
        category: "american",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&q=80&w=600",
        calories: "400 kcal",
        time: "12 min",
        ingredients: [
            "1/2 cup Grilled chicken breast, cubed",
            "2 Hard-boiled eggs, sliced",
            "1/4 cup Blue cheese crumbles",
            "2 slices Bacon, crumbled",
            "1/2 Avocado, diced",
            "2 cups Romaine lettuce",
            "2 tbsp Ranch dressing"
        ],
        instructions: [
            "Pour Ranch dressing at the bottom.",
            "Layer chicken, bacon, and blue cheese.",
            "Add eggs and avocado (squeeze lemon on avocado to prevent browning).",
            "Fill the rest with romaine lettuce.",
            "Shake vigorously to mix before eating."
        ]
    },
    {
        id: 5,
        title: "Ranch Chicken Layered Bottele",
        category: "american",
        image: "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&q=80&w=600",
        calories: "500 kcal",
        time: "20 min",
        ingredients: [
            "1 cup Grilled chicken strips",
            "1/2 cup Black beans, rinsed",
            "1/2 cup Corn kernels",
            "1/2 cup Cheddar cheese",
            "2 cups Iceberg lettuce",
            "Tortilla strips for topping",
            "3 tbsp Spicy Ranch dressing"
        ],
        instructions: [
            "Add Spicy Ranch to the bottom.",
            "Layer beans, corn, and chicken.",
            "Add cheddar cheese.",
            "Pack with lettuce.",
            "Keep tortilla strips in a separate small bag or on top to stay crunchy."
        ]
    },
    {
        id: 6,
        title: "Southwest Fiesta Jar",
        category: "american",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600",
        calories: "380 kcal",
        time: "15 min",
        ingredients: [
            "1/2 cup Quinoa, cooked",
            "1/2 cup Black beans",
            "1/2 Red bell pepper, diced",
            "1/4 cup Cilantro, chopped",
            "1/2 Avocado, cubed",
            "2 tbsp Lime vinaigrette"
        ],
        instructions: [
            "Pour lime vinaigrette at the bottom.",
            "Layer beans, quinoa, and peppers.",
            "Add avocado and cilantro.",
            "You can add mixed greens if desired.",
            "Shake correctly to mix flavors."
        ]
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
                <button class="btn-view-recipe" onclick="openRecipeModal(${recipe.id})">View Recipe</button>
            </div>
        `;

        recipeGrid.appendChild(card);
    });

    // Re-initialize icons for new elements
    if (window.lucide) {
        lucide.createIcons();
    }
}

// Modal Logic
const modal = document.getElementById('recipe-modal');
const closeModalBtn = document.querySelector('.close-modal');

window.openRecipeModal = function (id) {
    const recipe = recipes.find(r => r.id === id);
    if (!recipe) return;

    document.getElementById('modal-title').textContent = recipe.title;
    document.getElementById('modal-img').src = recipe.image;
    document.getElementById('modal-time').textContent = recipe.time;
    document.getElementById('modal-cal').textContent = recipe.calories;

    const ingredientsList = document.getElementById('modal-ingredients');
    ingredientsList.innerHTML = recipe.ingredients.map(ing => `<li>${ing}</li>`).join('');

    const instructionsList = document.getElementById('modal-instructions');
    instructionsList.innerHTML = recipe.instructions.map(inst => `<li>${inst}</li>`).join('');

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

// Close on outside click
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

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
if (recipeGrid) {
    renderRecipes('italian');
}


/* Mobile Navigation Logic */
const burger = document.querySelector('.burger-menu');
const navMobile = document.querySelector('.nav-mobile-overlay');

if (burger) {
    burger.addEventListener('click', () => {
        navMobile.classList.toggle('active');
        burger.innerHTML = navMobile.classList.contains('active') ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
        lucide.createIcons();
    });
}

/* Scroll Reveal Animation */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));
