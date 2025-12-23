import { auth, db, collection } from './firebase-config.js';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const loginForm = document.getElementById('login-form');
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');
const logoutBtn = document.getElementById('logout-btn');
const addRecipeForm = document.getElementById('add-recipe-form');

// Auth State Observer
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
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
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            console.log("Logged in!");
        } catch (error) {
            alert("Login Failed: " + error.message);
        }
    });
}

// Logout Logic
if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
        signOut(auth);
    });
}

// Add Recipe Logic
if (addRecipeForm) {
    addRecipeForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const title = document.getElementById('r-title').value;
        const category = document.getElementById('r-category').value;
        const image = document.getElementById('r-image').value;
        const time = document.getElementById('r-time').value;
        const calories = document.getElementById('r-cal').value;

        // Parse CSV to Array
        const ingredientsRaw = document.getElementById('r-ingredients').value;
        const ingredients = ingredientsRaw.split(',').map(item => item.trim());

        // Parse Sentences to Array
        const instructionsRaw = document.getElementById('r-instructions').value;
        // Split by period but filter out empty strings
        const instructions = instructionsRaw.split('.').map(item => item.trim()).filter(i => i.length > 0);

        const newRecipe = {
            title,
            category,
            image,
            time,
            calories,
            ingredients,
            instructions,
            createdAt: new Date()
        };

        try {
            await addDoc(collection(db, "recipes"), newRecipe);
            alert("Recipe Added Successfully!");
            addRecipeForm.reset();
        } catch (error) {
            console.error("Error adding document: ", error);
            alert("Error adding recipe: " + error.message);
        }
    });
}
