/*
=========================================================
    SHOP CAMZON

    SIGNUP.JS

    PART 1
---------------------------------------------------------
    • Loader
    • DOM Elements
    • Password Toggle
    • Utility Functions
=========================================================
*/



/*=========================================================
    DOM ELEMENTS
=========================================================*/

const loader = document.getElementById("loader");

const signupForm = document.getElementById("signupForm");

const signupButton = document.getElementById("signupButton");

const message = document.getElementById("message");

const fullName = document.getElementById("fullName");

const email = document.getElementById("email");

const password = document.getElementById("password");

const confirmPassword = document.getElementById("confirmPassword");

const passwordToggle = document.querySelector(".toggle-password");

const confirmPasswordToggle = document.querySelector(".toggle-confirm-password");

const strengthBar = document.querySelector(".strength-bar");

const agreeCheckbox = document.getElementById("agree");



/*=========================================================
    LOADER
=========================================================*/

window.addEventListener("load", () => {

    setTimeout(() => {

        loader.classList.add("hide");

    }, 1200);

});



/*=========================================================
    PASSWORD TOGGLE
=========================================================*/

function togglePassword(input, button){

    const icon = button.querySelector("i");

    if(input.type === "password"){

        input.type = "text";

        icon.classList.remove("fa-eye");

        icon.classList.add("fa-eye-slash");

    }else{

        input.type = "password";

        icon.classList.remove("fa-eye-slash");

        icon.classList.add("fa-eye");

    }

}



passwordToggle.addEventListener("click",()=>{

    togglePassword(password,passwordToggle);

});



confirmPasswordToggle.addEventListener("click",()=>{

    togglePassword(confirmPassword,confirmPasswordToggle);

});



/*=========================================================
    MESSAGE FUNCTION
=========================================================*/

function showMessage(text,type){

    message.textContent = text;

    message.className = "form-message";

    message.classList.add(type);

}



/*=========================================================
    BUTTON LOADING
=========================================================*/

function setButtonLoading(state){

    if(state){

        signupButton.classList.add("loading");

        signupButton.innerHTML = `

            <i class="fa-solid fa-spinner fa-spin"></i>

            Creating Account...

        `;

    }else{

        signupButton.classList.remove("loading");

        signupButton.innerHTML = `

            <span>Create Account</span>

            <i class="fa-solid fa-arrow-right"></i>

        `;

    }

}



/*=========================================================
    CLEAR MESSAGE
=========================================================*/

function clearMessage(){

    message.textContent = "";

    message.className = "form-message";

}



/*=========================================================
    INITIALIZE
=========================================================*/

clearMessage();

console.log("✅ Shop Camzon Signup Part 1 Loaded");
/*
=========================================================
    SHOP CAMZON

    SIGNUP.JS

    PART 2
---------------------------------------------------------
    • Password Strength
    • Live Validation
    • Password Match
=========================================================
*/



/*=========================================================
    PASSWORD STRENGTH
=========================================================*/

password.addEventListener("input", updatePasswordStrength);

function updatePasswordStrength(){

    const value = password.value;

    let score = 0;

    if(value.length >= 8) score++;

    if(/[A-Z]/.test(value)) score++;

    if(/[a-z]/.test(value)) score++;

    if(/[0-9]/.test(value)) score++;

    if(/[^A-Za-z0-9]/.test(value)) score++;

    switch(score){

        case 0:
        case 1:

            strengthBar.style.width = "20%";
            strengthBar.style.background = "#ef4444";

            break;

        case 2:

            strengthBar.style.width = "40%";
            strengthBar.style.background = "#f97316";

            break;

        case 3:

            strengthBar.style.width = "60%";
            strengthBar.style.background = "#eab308";

            break;

        case 4:

            strengthBar.style.width = "80%";
            strengthBar.style.background = "#22c55e";

            break;

        case 5:

            strengthBar.style.width = "100%";
            strengthBar.style.background = "#16a34a";

            break;

    }

}



/*=========================================================
    EMAIL VALIDATION
=========================================================*/

function validateEmail(value){

    const pattern =

    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return pattern.test(value);

}



/*=========================================================
    NAME VALIDATION
=========================================================*/

function validateName(){

    if(fullName.value.trim().length < 3){

        fullName.parentElement.style.borderColor = "#ef4444";

        return false;

    }

    fullName.parentElement.style.borderColor = "#22c55e";

    return true;

}



/*=========================================================
    EMAIL CHECK
=========================================================*/

function validateEmailInput(){

    if(validateEmail(email.value)){

        email.parentElement.style.borderColor="#22c55e";

        return true;

    }

    email.parentElement.style.borderColor="#ef4444";

    return false;

}



/*=========================================================
    PASSWORD MATCH
=========================================================*/

function validatePasswordMatch(){

    if(confirmPassword.value===""){

        confirmPassword.parentElement.style.borderColor="#dbe4f0";

        return false;

    }

    if(password.value===confirmPassword.value){

        confirmPassword.parentElement.style.borderColor="#22c55e";

        return true;

    }

    confirmPassword.parentElement.style.borderColor="#ef4444";

    return false;

}



/*=========================================================
    PASSWORD LENGTH
=========================================================*/

function validatePassword(){

    if(password.value.length>=6){

        password.parentElement.style.borderColor="#22c55e";

        return true;

    }

    password.parentElement.style.borderColor="#ef4444";

    return false;

}



/*=========================================================
    LIVE VALIDATION
=========================================================*/

fullName.addEventListener("input",validateName);

email.addEventListener("input",validateEmailInput);

password.addEventListener("input",()=>{

    updatePasswordStrength();

    validatePassword();

    validatePasswordMatch();

});

confirmPassword.addEventListener(

    "input",

    validatePasswordMatch

);



/*=========================================================
    FORM VALIDATION
=========================================================*/

function validateForm(){

    if(!validateName()){

        showMessage(

            "Please enter your full name.",

            "error"

        );

        return false;

    }

    if(!validateEmailInput()){

        showMessage(

            "Please enter a valid email address.",

            "error"

        );

        return false;

    }

    if(!validatePassword()){

        showMessage(

            "Password must be at least 6 characters.",

            "error"

        );

        return false;

    }

    if(!validatePasswordMatch()){

        showMessage(

            "Passwords do not match.",

            "error"

        );

        return false;

    }

    if(!agreeCheckbox.checked){

        showMessage(

            "Please accept the Terms and Conditions.",

            "error"

        );

        return false;

    }

    clearMessage();

    return true;

}



console.log("✅ Shop Camzon Signup Part 2 Loaded");
/*
=========================================================
    SHOP CAMZON

    SIGNUP.JS

    PART 3
---------------------------------------------------------
    • Supabase Signup
    • Loading State
    • Error Handling
=========================================================
*/



/*=========================================================
    SIGNUP FORM SUBMIT
=========================================================*/

signupForm.addEventListener("submit", handleSignup);



/*=========================================================
    HANDLE SIGNUP
=========================================================*/

async function handleSignup(event){

    event.preventDefault();

    clearMessage();

    if(!validateForm()){

        return;

    }

    setButtonLoading(true);

    try{

        const { data, error } = await supabaseClient.auth.signUp({

            email: email.value.trim(),

            password: password.value,

            options:{

                data:{

                    full_name: fullName.value.trim()

                }

            }

        });

        if(error){

            throw error;

        }

        console.log("Signup Success:", data);

       await finishSignup(data);

    }

catch(error){

    console.error("Signup Error:", error);

    showMessage(

        error.message || "Something went wrong. Please try again.",

        "error"

    );

}

    finally{

        setButtonLoading(false);

    }

}



/*=========================================================
    PREVENT DOUBLE CLICK
=========================================================*/

signupButton.addEventListener("dblclick",(event)=>{

    event.preventDefault();

});



/*=========================================================
    DEBUG
=========================================================*/

console.log("✅ Shop Camzon Signup Part 3 Loaded");
/*
=========================================================
    SHOP CAMZON

    SIGNUP.JS

    PART 4
---------------------------------------------------------
    • Save User Profile
    • Better Success Flow
    • Redirect
=========================================================
*/



/*=========================================================
    SAVE PROFILE
=========================================================*/

async function saveUserProfile(user){

const { error } = await supabaseClient
.from("Profiles")
.insert({
    id: data.user.id,
    full_name: fullName.value.trim(),
    email: email.value.trim(),
    username: null,
    phone: null,
    avatar_url: null,
    gender: null,
    date_of_birth: null
});

    if(error){

        console.error("Profile Error:", error);

        throw error;

    }

}



/*=========================================================
    UPDATE SIGNUP FUNCTION
=========================================================*/

async function completeSignup(data){

    if(data.user){

        await saveUserProfile(data.user);

        showMessage(

            "🎉 Welcome to Shop Camzon! Your account has been created successfully.",

            "success"

        );

        signupForm.reset();

        strengthBar.style.width = "0%";

        setTimeout(()=>{

            window.location.href="login.html";

        },2500);

    }

}



/*=========================================================
    SUCCESS ANIMATION
=========================================================*/

function playSuccessAnimation(){

    signupButton.innerHTML = `

        <i class="fa-solid fa-circle-check"></i>

        Account Created

    `;

    signupButton.style.background=

    "linear-gradient(135deg,#16a34a,#22c55e)";

}



/*=========================================================
    RESET BUTTON
=========================================================*/

function resetSignupButton(){

    signupButton.innerHTML=`

        <span>Create Account</span>

        <i class="fa-solid fa-arrow-right"></i>

    `;

    signupButton.style.background="";

}



/*=========================================================
    SMALL HELPER
=========================================================*/

async function finishSignup(data){

    playSuccessAnimation();

    await completeSignup(data);

}



/*=========================================================
    READY
=========================================================*/

console.log("✅ Shop Camzon Signup Part 4 Loaded");
/*
=========================================================
    SHOP CAMZON

    SIGNUP.JS

    PART 5
---------------------------------------------------------
    • Prevent Duplicate Submission
    • Input Sanitization
    • Keyboard Support
    • Loading Overlay Helpers
=========================================================
*/



/*=========================================================
    SUBMISSION LOCK
=========================================================*/

let isSubmitting = false;



/*=========================================================
    SANITIZE INPUTS
=========================================================*/

function sanitizeInputs(){

    fullName.value = fullName.value.trim();

    email.value = email.value.trim().toLowerCase();

}



/*=========================================================
    ENABLE / DISABLE FORM
=========================================================*/

function toggleForm(disabled){

    const elements = signupForm.querySelectorAll(

        "input, button"

    );

    elements.forEach(element=>{

        element.disabled = disabled;

    });

}



/*=========================================================
    START LOADING
=========================================================*/

function beginSignupProcess(){

    isSubmitting = true;

    toggleForm(true);

    setButtonLoading(true);

}



/*=========================================================
    END LOADING
=========================================================*/

function endSignupProcess(){

    isSubmitting = false;

    toggleForm(false);

    setButtonLoading(false);

}



/*=========================================================
    ENTER KEY SUPPORT
=========================================================*/

signupForm.addEventListener("keydown",(event)=>{

    if(event.key==="Enter"){

        if(isSubmitting){

            event.preventDefault();

        }

    }

});



/*=========================================================
    AUTO SANITIZE
=========================================================*/

fullName.addEventListener("blur",()=>{

    fullName.value = fullName.value.trim();

});



email.addEventListener("blur",()=>{

    email.value = email.value.trim().toLowerCase();

});



/*=========================================================
    PASSWORD CLEANUP
=========================================================*/

password.addEventListener("paste",(event)=>{

    const pasted = event.clipboardData.getData("text");

    if(pasted.includes(" ")){

        event.preventDefault();

        showMessage(

            "Passwords cannot contain leading or trailing spaces.",

            "error"

        );

    }

});



/*=========================================================
    UPDATE HANDLE SIGNUP
=========================================================*/

/*
Inside handleSignup()

Replace

setButtonLoading(true);

With

sanitizeInputs();

if(isSubmitting){

    return;

}

beginSignupProcess();


Replace

setButtonLoading(false);

inside finally{} with

endSignupProcess();

*/



console.log("✅ Shop Camzon Signup Part 5 Loaded");
/*
=========================================================
    SHOP CAMZON

    SIGNUP.JS

    PART 6
---------------------------------------------------------
    • Password Strength Labels
    • Caps Lock Detection
    • Better Error Messages
    • Redirect Countdown
=========================================================
*/



/*=========================================================
    PASSWORD STRENGTH LABEL
=========================================================*/

const strengthText = document.querySelector(".password-strength small");



function updateStrengthLabel(score){

    switch(score){

        case 0:
        case 1:

            strengthText.textContent = "Weak Password";
            strengthText.style.color = "#ef4444";

            break;

        case 2:

            strengthText.textContent = "Fair Password";
            strengthText.style.color = "#f97316";

            break;

        case 3:

            strengthText.textContent = "Good Password";
            strengthText.style.color = "#eab308";

            break;

        case 4:

            strengthText.textContent = "Strong Password";
            strengthText.style.color = "#22c55e";

            break;

        case 5:

            strengthText.textContent = "Very Strong Password";
            strengthText.style.color = "#16a34a";

            break;

    }

}



/*=========================================================
    CAPS LOCK DETECTION
=========================================================*/

password.addEventListener("keyup", checkCapsLock);

confirmPassword.addEventListener("keyup", checkCapsLock);



function checkCapsLock(event){

    if(event.getModifierState("CapsLock")){

        showMessage(

            "⚠ Caps Lock is ON.",

            "error"

        );

    }else{

        clearMessage();

    }

}



/*=========================================================
    FRIENDLY SUPABASE ERRORS
=========================================================*/

function getReadableError(error){

    const message = error.message.toLowerCase();

    if(message.includes("already")){

        return "This email address is already registered.";

    }

    if(message.includes("password")){

        return "Please choose a stronger password.";

    }

    if(message.includes("network")){

        return "Unable to connect. Please check your internet connection.";

    }

    if(message.includes("invalid email")){

        return "Please enter a valid email address.";

    }

    return error.message;

}



/*=========================================================
    REDIRECT COUNTDOWN
=========================================================*/

function startRedirectCountdown(seconds = 5){

    let remaining = seconds;

    const timer = setInterval(()=>{

        showMessage(

            `🎉 Account created successfully! Redirecting in ${remaining} second${remaining === 1 ? "" : "s"}...`,

            "success"

        );

        remaining--;

        if(remaining < 0){

            clearInterval(timer);

            window.location.href = "login.html";

        }

    },1000);

}



/*=========================================================
    SUCCESS FLOW
=========================================================*/

async function finishSignupSuccess(data){

    playSuccessAnimation();

    await completeSignup(data);

    startRedirectCountdown();

}



/*=========================================================
    UPDATE ERROR HANDLING
=========================================================*/

/*
Inside your catch(error){

Replace:

showMessage(
    error.message,
    "error"
);

With:

showMessage(
    getReadableError(error),
    "error"
);




Inside the success section replace:

await finishSignup(data);

With:

await finishSignupSuccess(data);

*/



console.log("✅ Shop Camzon Signup Part 6 Loaded");
