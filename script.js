// Fallback Static Data (used if DB connection fails)
const staticRecipes = [
    {
        id: 1,
        title: "Tuscan Mason Jar Salad",
        category: "italian",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600",
        calories: "350 kcal",
        time: "10 min",
        ingredients: ["1/2 cup Cannellini beans", "1 cup Cherry tomatoes", "1/2 Cucumber", "1/4 Red onion", "2 cups Mixed greens"],
        instructions: ["Pour dressing.", "Layer beans and veggies.", "Add greens.", "Shake well."]
    },
    // ... additional static data ...
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
                <span class="recipe-tag">${recipe.category} Style</span>
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
