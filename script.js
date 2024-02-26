// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import {
    getAuth,onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDG6KzHJX1Q8cGQII7eFfN8xY5tibu5X28",
    authDomain: "open-food-cloud.firebaseapp.com",
    projectId: "open-food-cloud",
    storageBucket: "open-food-cloud.appspot.com",
    messagingSenderId: "905128518957",
    appId: "1:905128518957:web:f92a44b234013b9ee29fa4",
    measurementId: "G-307149KDDQ"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);

// Login Form Handling
const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get email and password values from the form
    const email = loginForm.email.value;
    const password = loginForm.password.value;

    // Sign in the user with Firebase Authentication
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in successfully, redirect to dashboard
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            // Handle login errors, e.g., display error message to the user
            const errorMessage = error.message;
            console.error("Login error:", errorMessage);
            // Display error message to the user (e.g., in a <div> element)
            // Replace 'error-message' with the ID of your error message container
            document.getElementById("error-message").innerText = errorMessage;
        });
});

// Registration Form Handling
const registrationForm = document.getElementById("registration-form");

registrationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get email and password values from the form
    const email = registrationForm.email.value;
    const password = registrationForm.password.value;

    // Create a new user account with Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // User registered successfully, redirect to dashboard
            window.location.href = "dashboard.html";
        })
        .catch((error) => {
            // Handle registration errors, e.g., display error message to the user
            const errorMessage = error.message;
            console.error("Registration error:", errorMessage);
            // Display error message to the user (e.g., in a <div> element)
            // Replace 'error-message' with the ID of your error message container
            document.getElementById("error-message").innerText = errorMessage;
        });
});

// Script.js

// Function to retrieve user information from Firestore
const getUserInfo = () => {
    const user = auth.currentUser;
    if (user) {
        firestore.collection("users").doc(user.uid).get()
            .then((doc) => {
                if (doc.exists) {
                    const userData = doc.data();
                    document.getElementById('username').innerText = userData.username;
                    document.getElementById('email').innerText = userData.email;
                    // Add more fields as needed
                } else {
                    console.log("No such document!");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    } else {
        console.log("User not logged in");
    }
};

// Function to handle logout
const logout = () => {
    signOut(auth).then(() => {
        // Sign-out successful.
        window.location.href = "index.html"; // Redirect to the login page after logout
    }).catch((error) => {
        // An error happened.
        console.error('Logout error:', error);
    });
};

// Retrieve user information when the dashboard page loads
document.addEventListener('DOMContentLoaded', () => {
    getUserInfo();
});

// Logout event listener
const logoutLink = document.getElementById('logout-link');
logoutLink.addEventListener('click', (event) => {
    event.preventDefault();
    logout();
});

// Form Handling
const foodForm = document.getElementById("food-input-form");

foodForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Get user input values
    const breakfast = foodForm.breakfast.value.trim();
    const lunch = foodForm.lunch.value.trim();
    const dinner = foodForm.dinner.value.trim();

    // Get the current user
    const user = auth.currentUser;

    if (user) {
        // Construct the data object to be stored in the database
        const foodData = {
            breakfast: breakfast,
            lunch: lunch,
            dinner: dinner
        };

        // Set the document in the Firestore database under the user's ID
        setDoc(doc(firestore, "users", user.uid), foodData)
            .then(() => {
                console.log("Food data successfully stored in Firestore!");
                // Reset the form after successful submission
                foodForm.reset();
            })
            .catch((error) => {
                console.error("Error storing food data:", error);
            });
    } else {
        console.log("User not logged in.");
    }
});

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in.
        console.log("User is signed in:", user.uid);
    } else {
        // No user is signed in.
        console.log("No user is signed in.");
    }
});
 
 