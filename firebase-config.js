// Firebase Compat Configuration
// This uses the global 'firebase' object loaded from the scripts in HTML

const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

// Initialize Firebase or Mock Support
const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY_HERE";

if (isConfigured && typeof firebase !== 'undefined') {
    // --- REAL FIREBASE MODE ---
    firebase.initializeApp(firebaseConfig);
    window.db = firebase.firestore();
    window.auth = firebase.auth();
    console.log("Firebase initialized (Online Mode)");

} else {
    // --- OFFLINE / MOCK MODE ---
    console.warn("Using Mock Firebase (Offline Mode) - Data saved to LocalStorage");

    // Add a visual indicator for Offline Mode
    window.addEventListener('DOMContentLoaded', () => {
        const banner = document.createElement('div');
        banner.style = "background: #fff3cd; color: #856404; text-align: center; padding: 5px; font-size: 0.8rem; border-bottom: 1px solid #ffeeba;";
        banner.innerHTML = "<b>Demo Mode:</b> Running offline. Data is saved to your browser.";
        document.body.prepend(banner);
    });

    // 1. Mock Auth
    class MockAuth {
        constructor() {
            this.user = JSON.parse(localStorage.getItem('mockUser')) || null;
            this.listeners = [];
        }

        onAuthStateChanged(callback) {
            this.listeners.push(callback);
            callback(this.user); // Trigger immediately
            return () => this.listeners = this.listeners.filter(l => l !== callback);
        }

        async signInWithEmailAndPassword(email, password) {
            // Accept any login for demo purposes
            this.user = { email: email, uid: "mock-uid-" + Date.now() };
            localStorage.setItem('mockUser', JSON.stringify(this.user));
            this.notify();
            return { user: this.user };
        }

        async createUserWithEmailAndPassword(email, password) {
            return this.signInWithEmailAndPassword(email, password);
        }

        async signOut() {
            this.user = null;
            localStorage.removeItem('mockUser');
            this.notify();
        }

        notify() {
            this.listeners.forEach(cb => cb(this.user));
        }
    }

    // 2. Mock Firestore
    class MockFirestore {
        collection(name) {
            return new MockCollection(name);
        }
    }

    class MockCollection {
        constructor(name) {
            this.name = name;
        }

        _getData() {
            let data = JSON.parse(localStorage.getItem('mockDB_' + this.name));
            if (!data && this.name === 'recipes') {
                // Seed default data if empty
                data = [
                    {
                        id: 'seed1',
                        title: "Tuscan Mason Jar Salad",
                        category: "italian",
                        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600",
                        calories: "350 kcal",
                        time: "10 min",
                        ingredients: ["1/2 cup Cannellini beans", "1 cup Cherry tomatoes", "1/2 Cucumber", "1/4 Red onion", "2 cups Mixed greens"],
                        instructions: ["Pour dressing.", "Layer beans and veggies.", "Add greens.", "Shake well."],
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 'seed2',
                        title: "Rainbow Veggie Wrap",
                        category: "american",
                        image: "https://images.unsplash.com/photo-1540420773420-3366772f43fb?auto=format&fit=crop&q=80&w=600",
                        calories: "420 kcal",
                        time: "15 min",
                        ingredients: ["1 Tortilla", "Hummus", "Spinach", "Bell Peppers", "Carrots"],
                        instructions: ["Spread hummus.", "Layer veggies.", "Roll tightly.", "Slice."],
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 'seed3',
                        title: "Caprese Pasta Salad",
                        category: "italian",
                        image: "https://images.unsplash.com/photo-1529325868851-bc4755a9d6bf?auto=format&fit=crop&q=80&w=600",
                        calories: "380 kcal",
                        time: "20 min",
                        ingredients: ["Pasta", "Mozzarella balls", "Basil", "Balsamic Glaze"],
                        instructions: ["Boil pasta.", "Mix with cheese and basil.", "Drizzle glaze."],
                        createdAt: new Date().toISOString()
                    },
                    {
                        id: 'seed4',
                        title: "Quinoa Power Bowl",
                        category: "american",
                        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600",
                        calories: "450 kcal",
                        time: "25 min",
                        ingredients: ["Quinoa", "Avocado", "Chickpeas", "Kale"],
                        instructions: ["Cook quinoa.", "Roast chickpeas.", "Assemble bowl."],
                        createdAt: new Date().toISOString()
                    }
                ];
                this._saveData(data);
                console.log("Mock DB seeded with default recipes");
            }
            return data || [];
        }

        _saveData(data) {
            localStorage.setItem('mockDB_' + this.name, JSON.stringify(data));
        }

        orderBy() { return this; } // Mock chaining

        async get() {
            const data = this._getData();
            return {
                empty: data.length === 0,
                forEach: (cb) => data.forEach(item => cb({
                    id: item.id,
                    data: () => item
                }))
            };
        }

        async add(docData) {
            const data = this._getData();
            const id = "doc_" + Date.now();
            data.push({ ...docData, id });
            this._saveData(data);
            return { id };
        }

        doc(id) {
            return new MockDoc(this.name, id);
        }
    }

    class MockDoc {
        constructor(colName, id) {
            this.colName = colName;
            this.id = id;
        }

        async get() {
            const data = JSON.parse(localStorage.getItem('mockDB_' + this.colName)) || [];
            const item = data.find(d => d.id === this.id);
            return {
                exists: !!item,
                id: this.id,
                data: () => item
            };
        }

        async update(updates) {
            let data = JSON.parse(localStorage.getItem('mockDB_' + this.colName)) || [];
            const idx = data.findIndex(d => d.id === this.id);
            if (idx !== -1) {
                data[idx] = { ...data[idx], ...updates };
                localStorage.setItem('mockDB_' + this.colName, JSON.stringify(data));
            }
        }

        async delete() {
            let data = JSON.parse(localStorage.getItem('mockDB_' + this.colName)) || [];
            data = data.filter(d => d.id !== this.id);
            localStorage.setItem('mockDB_' + this.colName, JSON.stringify(data));
        }
    }

    // Initialize Mock Global Variables
    window.auth = new MockAuth();
    window.db = new MockFirestore();
}
