// Compat version using global variables
// Ensure firebase-config.js is loaded before this

const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const logoutBtn = document.getElementById('logout-btn');
const addRecipeForm = document.getElementById('add-recipe-form');

// Wait for Firebase to initialize
function initAdmin() {
    if (!window.auth || !window.db) {
        console.log("Waiting for Firebase...");
        setTimeout(initAdmin, 500);
        return;
    }

    // Auth State Observer
    window.auth.onAuthStateChanged((user) => {
        if (user) {
            // User is signed in
            loginSection.style.display = 'none';
            dashboardSection.style.display = 'block';
            loadAdminRecipes(); // Load list
        } else {
            // User is signed out
            loginSection.style.display = 'block';
            dashboardSection.style.display = 'none';
        }
    });

    // Login Logic
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            let email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            // Helper: Auto-format "admin" to email
            if (!email.includes('@')) {
                email += "@harvest.com";
            }

            try {
                // Try to login
                await window.auth.signInWithEmailAndPassword(email, password);
                console.log("Logged in!");
            } catch (error) {
                // If user not found, ask to register
                if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                    if (confirm("User not found. Do you want to create this account?")) {
                        try {
                            await window.auth.createUserWithEmailAndPassword(email, password);
                            alert("Account created! You are now logged in.");
                        } catch (regError) {
                            alert("Registration failed: " + regError.message);
                        }
                    }
                } else {
                    const errDiv = document.getElementById('login-error');
                    errDiv.style.display = 'block';
                    errDiv.textContent = "Error: " + error.message;
                    if (error.message.includes("api-key")) {
                        errDiv.textContent += " (Did you add your keys to firebase-config.js?)";
                    }
                }
            }
        });
    }

    // Logout Logic
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.auth.signOut();
        });
    }

    // Add/Edit Recipe Logic
    if (addRecipeForm) {
        addRecipeForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const id = document.getElementById('r-id').value; // Get hidden ID
            const title = document.getElementById('r-title').value;
            const category = document.getElementById('r-category').value;
            const image = document.getElementById('r-image').value;
            const time = document.getElementById('r-time').value;
            const calories = document.getElementById('r-cal').value;

            const ingredientsRaw = document.getElementById('r-ingredients').value;
            const ingredients = ingredientsRaw.split(',').map(item => item.trim());

            const instructionsRaw = document.getElementById('r-instructions').value;
            const instructions = instructionsRaw.split('.').map(item => item.trim()).filter(i => i.length > 0);

            const recipeData = {
                title, category, image, time, calories, ingredients, instructions,
                updatedAt: new Date()
            };

            const submitBtn = document.getElementById('submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = "Saving...";

            try {
                if (id) {
                    // Update existing
                    await window.db.collection("recipes").doc(id).update(recipeData);
                    alert("Recipe Updated!");
                } else {
                    // Create new
                    recipeData.createdAt = new Date();
                    await window.db.collection("recipes").add(recipeData);
                    alert("Recipe Added!");
                }
                resetForm();
                loadAdminRecipes(); // Refresh list
            } catch (error) {
                console.error("Error saving document: ", error);
                alert("Error: " + error.message);
            } finally {
                submitBtn.textContent = originalBtnText;
            }
        });
    }

    // Cancel Edit Button
    document.getElementById('cancel-btn').addEventListener('click', resetForm);
}

// Function to Reset Form
function resetForm() {
    document.getElementById('add-recipe-form').reset();
    document.getElementById('r-id').value = '';
    document.getElementById('form-title').textContent = "Add New Recipe";
    document.getElementById('submit-btn').textContent = "Save Recipe";
    document.getElementById('cancel-btn').style.display = 'none';
}

// Function to Load Recipes for Admin
async function loadAdminRecipes() {
    const listContainer = document.getElementById('admin-recipe-list');
    listContainer.innerHTML = '<p>Loading...</p>';

    try {
        const snapshot = await window.db.collection("recipes").orderBy("createdAt", "desc").get();
        listContainer.innerHTML = '';

        if (snapshot.empty) {
            listContainer.innerHTML = '<p>No recipes found in database.</p>';
            return;
        }

        snapshot.forEach(doc => {
            const data = doc.data();
            const el = document.createElement('div');
            el.style = "border: 1px solid #eee; padding: 15px; border-radius: 8px; background: #fff;";
            el.innerHTML = `
                <img src="${data.image}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 4px; margin-bottom: 10px;">
                <h4 style="margin: 0 0 5px 0;">${data.title}</h4>
                <p style="font-size: 0.8rem; color: #666; margin-bottom: 10px;">${data.category}</p>
                <div style="display: flex; gap: 10px;">
                    <button onclick="editRecipe('${doc.id}')" class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.8rem;">Edit</button>
                    <button onclick="deleteRecipe('${doc.id}')" class="btn btn-primary" style="padding: 5px 10px; font-size: 0.8rem; background: #ff4444; border: none;">Delete</button>
                </div>
`;
            listContainer.appendChild(el);
        });
    } catch (error) {
        listContainer.innerHTML = '<p>Error loading recipes. Check console.</p>';
        console.error(error);
    }
}

// Global functions for inline onclick
window.editRecipe = async function (id) {
    try {
        const doc = await window.db.collection("recipes").doc(id).get();
        if (doc.exists) {
            const data = doc.data();
            // Fill Form
            document.getElementById('r-id').value = doc.id;
            document.getElementById('r-title').value = data.title;
            document.getElementById('r-category').value = data.category;
            document.getElementById('r-image').value = data.image;
            document.getElementById('r-time').value = data.time;
            document.getElementById('r-cal').value = data.calories;

            // Join arrays back to string
            const ingStr = Array.isArray(data.ingredients) ? data.ingredients.join(', ') : data.ingredients;
            const instStr = Array.isArray(data.instructions) ? data.instructions.join('. ') : data.instructions;

            document.getElementById('r-ingredients').value = ingStr;
            document.getElementById('r-instructions').value = instStr;

            // Update UI State
            document.getElementById('form-title').textContent = "Edit Recipe";
            document.getElementById('submit-btn').textContent = "Update Recipe";
            document.getElementById('cancel-btn').style.display = 'inline-block';

            // Scroll to form
            document.getElementById('form-title').scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        alert("Error loading recipe details: " + error.message);
    }
};

window.deleteRecipe = async function (id) {
    if (confirm("Are you sure you want to delete this recipe?")) {
        try {
            await window.db.collection("recipes").doc(id).delete();
            loadAdminRecipes(); // Refresh
        } catch (error) {
            alert("Delete failed: " + error.message);
        }
    }
};

document.addEventListener('DOMContentLoaded', initAdmin);
