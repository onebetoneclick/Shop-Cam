/*
=========================================================
    SHOP CAMZON
    LOGIN PAGE

    PART 1

    • DOM Elements
    • Loader
    • Messages
    • Password Toggle
=========================================================
*/



/*=========================================================
    DOM ELEMENTS
=========================================================*/

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("loginButton");

const googleButton = document.getElementById("googleLogin");

const rememberCheckbox = document.getElementById("rememberMe");

const togglePassword = document.getElementById("togglePassword");

const loader = document.getElementById("loader");

const messageBox = document.getElementById("message");



/*=========================================================
    LOADER
=========================================================*/

window.addEventListener("load", () => {

    setTimeout(() => {

        loader.classList.add("hide");

    }, 1000);

});



/*=========================================================
    MESSAGE FUNCTIONS
=========================================================*/

function showMessage(text, type = "info") {

    messageBox.textContent = text;

    messageBox.className = "message";

    messageBox.classList.add(type);

}



function clearMessage() {

    messageBox.textContent = "";

    messageBox.className = "message";

}



/*=========================================================
    BUTTON LOADING
=========================================================*/

function setLoading(button, loading, text = "Loading...") {

    if (loading) {

        button.disabled = true;

        button.dataset.original = button.innerHTML;

        button.innerHTML = `

            <i class="fa-solid fa-spinner fa-spin"></i>

            ${text}

        `;

    } else {

        button.disabled = false;

        if (button.dataset.original) {

            button.innerHTML = button.dataset.original;

        }

    }

}



/*=========================================================
    PASSWORD TOGGLE
=========================================================*/

togglePassword.addEventListener("click", () => {

    if (passwordInput.type === "password") {

        passwordInput.type = "text";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye-slash"></i>';

    } else {

        passwordInput.type = "password";

        togglePassword.innerHTML =
            '<i class="fa-solid fa-eye"></i>';

    }

});



/*=========================================================
    REMEMBER EMAIL
=========================================================*/

const rememberedEmail = localStorage.getItem("rememberEmail");

if (rememberedEmail) {

    emailInput.value = rememberedEmail;

    rememberCheckbox.checked = true;

}



console.log("✅ Login Part 1 Ready");
