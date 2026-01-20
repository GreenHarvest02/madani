// Fallback Static Data (used if DB connection fails)
const staticRecipes = [
    // Italian Recipes
    {
        id: "it-1",
        title: "Classic Caprese Jar",
        category: "italian",
        image: "https://images.unsplash.com/photo-1529312266912-b33cf6227e24?auto=format&fit=crop&q=80&w=800",
        calories: "280 kcal",
        time: "5 min",
        ingredients: [
            "2 tbsp Balsamic Glaze (bottom)",
            "1 cup Cherry Tomatoes, halved",
            "1 cup Mozzarella Pearls",
            "1/2 cup Fresh Basil Leaves",
            "1 cup Mixed Greens (top)"
        ],
        instructions: [
            "Pour balsamic glaze into the bottom of the jar.",
            "Layer tomatoes, then mozzarella.",
            "Add fresh basil leaves preventing them from touching the dressing.",
            "Pack mixed greens to the top.",
            "Shake vigorously before eating."
        ]
    },
    {
        id: "it-2",
        title: "Pesto Pasta Power",
        category: "italian",
        image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&q=80&w=800",
        calories: "450 kcal",
        time: "15 min",
        ingredients: [
            "2 tbsp Basil Pesto",
            "1 cup Cooked Fusilli Pasta",
            "1/4 cup Pine Nuts",
            "1/4 cup Cherry Tomatoes",
            "1/2 cup Arugula",
            "Shaved Parmesan Cheese"
        ],
        instructions: [
            "Spoon pesto into the bottom.",
            "Add tomatoes and pine nuts.",
            "Layer the cooked pasta.",
            "Top with arugula and parmesan cheese.",
            "Mix well when ready to serve."
        ]
    },
    {
        id: "it-3",
        title: "Mediterranean Quinoa",
        category: "italian",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800",
        calories: "320 kcal",
        time: "12 min",
        ingredients: [
            "2 tbsp Lemon Vinaigrette",
            "1/2 cup Cucumber, diced",
            "1/3 cup Kalamata Olives",
            "1/2 cup Quinoa, cooked",
            "1/4 cup Feta Cheese",
            "1/2 cup Spinach"
        ],
        instructions: [
            "Add vinaigrette first.",
            "Layer cucumbers and olives to marinate.",
            "Add quinoa as the substantial layer.",
            "Top with feta and spinach.",
            "Enjoy chilled."
        ]
    },

    // American Recipes
    {
        id: "us-1",
        title: "Cowboy Cobb Jar",
        category: "american",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
        calories: "480 kcal",
        time: "15 min",
        ingredients: [
            "2 tbsp Ranch Dressing",
            "1/2 cup Grilled Chicken, diced",
            "1 Hard-boiled Egg, chopped",
            "2 slices Bacon, crumbled",
            "1/4 cup Blue Cheese",
            "1 cup Romaine Lettuce"
        ],
        instructions: [
            "Dressing goes in first.",
            "Add chicken and heavier proteins.",
            "Layer egg and bacon.",
            "Fill the rest with vibrant Romaine lettuce.",
            "Shake to coat evenly."
        ]
    },
    {
        id: "us-2",
        title: "Southwest Fiesta",
        category: "american",
        image: "https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=800",
        calories: "410 kcal",
        time: "10 min",
        ingredients: [
            "2 tbsp Chipotle Dressing",
            "1/2 cup Black Beans, rinsed",
            "1/2 cup Corn Kernel",
            "1/4 cup Red Onion",
            "1/2 cup Grilled Chicken",
            "1 cup Iceberg Lettuce"
        ],
        instructions: [
            "Start with the spicy dressing.",
            "Layer beans, corn, and onion.",
            "Add the chicken.",
            "Top with crisp iceberg lettuce & tortilla strips (optional).",
            "Shake and enjoy!"
        ]
    },
    {
        id: "us-3",
        title: "Rainbow Veggie Crunch",
        category: "american",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800", // Reusing a nice salad image
        calories: "220 kcal",
        time: "8 min",
        ingredients: [
            "2 tbsp Hummus or Vinaigrette",
            "1/2 cup Carrots, shredded",
            "1/2 cup Red Bell Pepper",
            "1/2 cup Cucumber",
            "1/4 cup Sunflower Seeds",
            "1 cup Kale or Spinach"
        ],
        instructions: [
            "Hummus or dressing at the bottom.",
            "Layer hard veggies (carrots, peppers).",
            "Add cucumbers and seeds.",
            "Stuff the top with kale.",
            "Healthy and crunchy!"
        ]
    }
];

let recipes = [];

async function fetchRecipes() {
    // Check if Firebase DB is available
    if (window.db) {
        try {
            const querySnapshot = await window.db.collection("recipes").get();
            if (!querySnapshot.empty) {
                recipes = [];
                querySnapshot.forEach((doc) => {
                    recipes.push({ id: doc.id, ...doc.data() });
                });
                console.log("Recipes loaded from Firebase");
            } else {
                console.log("No recipes in DB, using fallback");
                recipes = staticRecipes;
            }
        } catch (error) {
            console.warn("Error fetching from Firebase. Using static data.", error);
            recipes = staticRecipes;
        }
    } else {
        console.warn("Firebase not loaded locally. Using static data.");
        recipes = staticRecipes;
    }
    renderRecipes('italian');
}

const recipeGrid = document.getElementById('recipe-grid');
const tabs = document.querySelectorAll('.tab-btn');

function renderRecipes(filter = 'italian') {
    if (!recipeGrid) return;
    recipeGrid.innerHTML = '';
    const filteredRecipes = recipes.filter(recipe => recipe.category === filter);

    if (filteredRecipes.length === 0) {
        recipeGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No recipes found.</p>';
        return;
    }

    filteredRecipes.forEach((recipe, index) => {
        const card = document.createElement('div');
        card.className = 'recipe-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <div class="recipe-img" style="background-image: url('${recipe.image}')"></div>
            <div class="recipe-content">
                <span class="recipe-tag">${recipe.category.charAt(0).toUpperCase() + recipe.category.slice(1)} Style</span>
                <h3 class="recipe-title">${recipe.title}</h3>
                <div class="recipe-meta">
                    <span><i data-lucide="clock"></i> ${recipe.time}</span>
                    <span><i data-lucide="flame"></i> ${recipe.calories}</span>
                </div>
                <button class="btn-view-recipe" onclick="window.openRecipeModal('${recipe.id}')">View Recipe</button>
            </div>
        `;
        recipeGrid.appendChild(card);
    });
    if (window.lucide) lucide.createIcons();
}

// Modal Logic
const modal = document.getElementById('recipe-modal');
const closeModalBtn = document.querySelector('.close-modal');

window.openRecipeModal = function (id) {
    // ID can be string (Firestore) or number (Static)
    // Coerce static IDs to string for comparison if needed, or just use loose comparison
    const recipe = recipes.find(r => r.id == id);
    if (!recipe) return;

    document.getElementById('modal-title').textContent = recipe.title;
    document.getElementById('modal-img').src = recipe.image;
    document.getElementById('modal-time').textContent = recipe.time;
    document.getElementById('modal-cal').textContent = recipe.calories;

    const ingredientsList = document.getElementById('modal-ingredients');
    // Handle simplified fallback ingredients vs potential object structure
    const ings = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
    ingredientsList.innerHTML = ings.map(ing => `<li>${ing}</li>`).join('');

    const instructionsList = document.getElementById('modal-instructions');
    const insts = Array.isArray(recipe.instructions) ? recipe.instructions : [];
    instructionsList.innerHTML = insts.map(inst => `<li>${inst}</li>`).join('');

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

// Event Listeners for Tabs
if (tabs.length > 0) {
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const category = tab.getAttribute('data-category');
            renderRecipes(category);
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Load Data
    if (recipeGrid) {
        fetchRecipes();
    }


    /* Mobile Navigation Logic */
    const burger = document.querySelector('.burger-menu');
    const navMobile = document.querySelector('.nav-mobile-overlay');

    if (burger) {
        burger.addEventListener('click', () => {
            navMobile.classList.toggle('active');
            burger.innerHTML = navMobile.classList.contains('active') ? '<i data-lucide="x"></i>' : '<i data-lucide="menu"></i>';
            if (window.lucide) lucide.createIcons();
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
});
