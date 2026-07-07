/*
=========================================================
    SHOP CAMZON

    CONFIRM EMAIL

    PART 1

    • Loader
    • DOM Elements
    • Utility Functions
=========================================================
*/



/*=========================================================
    DOM ELEMENTS
=========================================================*/

const loader = document.getElementById("loader");

const checkVerificationButton = document.getElementById("checkVerification");

const resendEmailButton = document.getElementById("resendEmail");

const message = document.getElementById("message");



/*=========================================================
    LOADER
=========================================================*/

window.addEventListener("load", () => {

    setTimeout(() => {

        loader.classList.add("hide");

    }, 1200);

});



/*=========================================================
    MESSAGE FUNCTION
=========================================================*/

function showMessage(text, type = "info") {

    message.textContent = text;

    message.className = "message";

    message.classList.add(type);

}



/*=========================================================
    CLEAR MESSAGE
=========================================================*/

function clearMessage() {

    message.textContent = "";

    message.className = "message";

}



/*=========================================================
    BUTTON LOADING
=========================================================*/

function setButtonLoading(button, loading, text) {

    if (loading) {

        button.disabled = true;

        button.classList.add("loading");

        button.dataset.originalText = button.innerHTML;

        button.innerHTML = `

            <i class="fa-solid fa-spinner fa-spin"></i>

            ${text}

        `;

    } else {

        button.disabled = false;

        button.classList.remove("loading");

        if (button.dataset.originalText) {

            button.innerHTML = button.dataset.originalText;

        }

    }

}



/*=========================================================
    CHECK INTERNET CONNECTION
=========================================================*/

function isOnline() {

    return navigator.onLine;

}



/*=========================================================
    NETWORK EVENTS
=========================================================*/

window.addEventListener("offline", () => {

    showMessage(

        "No internet connection. Please reconnect and try again.",

        "error"

    );

});



window.addEventListener("online", () => {

    showMessage(

        "Internet connection restored.",

        "success"

    );

    setTimeout(clearMessage, 2000);

});



/*=========================================================
    INITIALIZE
=========================================================*/

clearMessage();

console.log("✅ Confirm Email Part 1 Loaded");
/*
=========================================================
    SHOP CAMZON

    CONFIRM EMAIL

    PART 2

    • Session Check
    • Email Verification Check
=========================================================
*/



/*=========================================================
    CURRENT USER
=========================================================*/

let currentUser = null;



/*=========================================================
    GET CURRENT SESSION
=========================================================*/

async function getCurrentUser(){

    try{

        const { data, error } = await supabaseClient.auth.getUser();

        if(error){

            throw error;

        }

        currentUser = data.user;

        return currentUser;

    }

    catch(error){

        console.error(error);

        return null;

    }

}



/*=========================================================
    CHECK EMAIL VERIFICATION
=========================================================*/

async function checkEmailVerification(){

    if(!isOnline()){

        showMessage(

            "You are currently offline.",

            "error"

        );

        return;

    }

    setButtonLoading(

        checkVerificationButton,

        true,

        "Checking..."

    );

    try{

        const user = await getCurrentUser();

        if(!user){

            showMessage(

                "No active session found. Please login again.",

                "error"

            );

            setTimeout(()=>{

                window.location.href = "login.html";

            },2500);

            return;

        }

        /*
        Refresh the authentication session
        */

        const {

            data,

            error

        } = await supabaseClient.auth.refreshSession();

        if(error){

            throw error;

        }

        const refreshedUser = data.user;

        if(refreshedUser?.email_confirmed_at){

            showMessage(

                "✅ Email verified successfully!",

                "success"

            );

            setTimeout(()=>{

                window.location.href = "set-profile.html";

            },2000);

        }else{

            showMessage(

                "Your email is not verified yet. Please check your inbox and click the verification link.",

                "info"

            );

        }

    }

    catch(error){

        console.error(error);

        showMessage(

            error.message,

            "error"

        );

    }

    finally{

        setButtonLoading(

            checkVerificationButton,

            false

        );

    }

}



/*=========================================================
    BUTTON EVENT
=========================================================*/

checkVerificationButton.addEventListener(

    "click",

    checkEmailVerification

);



console.log("✅ Confirm Email Part 2 Loaded");
/*
=========================================================
    SHOP CAMZON

    CONFIRM EMAIL

    PART 3

    • Resend Verification Email
    • Cooldown Timer
    • Button Protection
=========================================================
*/



/*=========================================================
    VARIABLES
=========================================================*/

let resendCooldown = 60;

let resendTimer = null;



/*=========================================================
    START RESEND TIMER
=========================================================*/

function startResendTimer(){

    resendEmailButton.disabled = true;

    resendEmailButton.classList.add("loading");



    resendTimer = setInterval(()=>{

        resendEmailButton.innerHTML = `

            <i class="fa-solid fa-clock"></i>

            Resend (${resendCooldown}s)

        `;

        resendCooldown--;



        if(resendCooldown < 0){

            clearInterval(resendTimer);

            resendCooldown = 60;

            resendEmailButton.disabled = false;

            resendEmailButton.classList.remove("loading");



            resendEmailButton.innerHTML = `

                <i class="fa-solid fa-paper-plane"></i>

                Resend Verification Email

            `;

        }

    },1000);

}



/*=========================================================
    RESEND EMAIL
=========================================================*/

async function resendVerificationEmail(){

    if(!isOnline()){

        showMessage(

            "Please connect to the internet.",

            "error"

        );

        return;

    }



    const user = await getCurrentUser();



    if(!user){

        showMessage(

            "Your session has expired. Please login again.",

            "error"

        );



        setTimeout(()=>{

            window.location.href = "login.html";

        },2500);



        return;

    }



    setButtonLoading(

        resendEmailButton,

        true,

        "Sending..."

    );



    try{

        /*
        NOTE:
        Supabase does not provide a direct method to resend
        the signup confirmation email for the currently
        authenticated user.

        The recommended approach is to call resend()
        with the user's email.
        */



        const { error } = await supabaseClient.auth.resend({

            type: "signup",

            email: user.email

        });



        if(error){

            throw error;

        }



        showMessage(

            "📧 Verification email sent successfully. Please check your inbox.",

            "success"

        );



        startResendTimer();

    }

    catch(error){

        console.error(error);



        showMessage(

            error.message,

            "error"

        );



        setButtonLoading(

            resendEmailButton,

            false

        );

    }

}



/*=========================================================
    BUTTON EVENT
=========================================================*/

resendEmailButton.addEventListener(

    "click",

    resendVerificationEmail

);



console.log("✅ Confirm Email Part 3 Loaded");
/*
=========================================================
    SHOP CAMZON

    CONFIRM EMAIL

    PART 4

    • Auto Verification Check
    • Page Visibility
    • Auto Redirect
=========================================================
*/



/*=========================================================
    AUTO CHECK SETTINGS
=========================================================*/

let verificationInterval = null;

const CHECK_INTERVAL = 5000; // 5 Seconds



/*=========================================================
    START AUTO CHECK
=========================================================*/

function startVerificationWatcher(){

    stopVerificationWatcher();

    verificationInterval = setInterval(async()=>{

        try{

            const {

                data,

                error

            } = await supabaseClient.auth.refreshSession();

            if(error){

                return;

            }

            const user = data.user;

            if(user?.email_confirmed_at){

                stopVerificationWatcher();

                showMessage(

                    "✅ Email verified successfully! Redirecting...",

                    "success"

                );

                setTimeout(()=>{

                    window.location.href = "login.html";

                },2000);

            }

        }

        catch(error){

            console.error(

                "Verification Watcher:",

                error

            );

        }

    },CHECK_INTERVAL);

}



/*=========================================================
    STOP AUTO CHECK
=========================================================*/

function stopVerificationWatcher(){

    if(verificationInterval){

        clearInterval(

            verificationInterval

        );

        verificationInterval = null;

    }

}



/*=========================================================
    PAGE VISIBILITY
=========================================================*/

document.addEventListener(

    "visibilitychange",

    ()=>{

        if(document.hidden){

            stopVerificationWatcher();

        }

        else{

            startVerificationWatcher();

        }

    }

);



/*=========================================================
    WINDOW EVENTS
=========================================================*/

window.addEventListener(

    "beforeunload",

    ()=>{

        stopVerificationWatcher();

    }

);



/*=========================================================
    START WATCHER
=========================================================*/

startVerificationWatcher();



console.log("✅ Confirm Email Part 4 Loaded");
/*
=========================================================
    SHOP CAMZON

    CONFIRM EMAIL

    PART 5

    • Countdown Redirect
    • Session Validation
    • Initialize Page
=========================================================
*/



/*=========================================================
    REDIRECT COUNTDOWN
=========================================================*/

let redirectTimer = null;

let redirectSeconds = 5;



function startRedirectCountdown(){

    clearInterval(redirectTimer);

    redirectSeconds = 5;



    redirectTimer = setInterval(()=>{

        showMessage(

            `✅ Email verified successfully! Redirecting to Login in ${redirectSeconds} second${redirectSeconds === 1 ? "" : "s"}...`,

            "success"

        );



        redirectSeconds--;



        if(redirectSeconds < 0){

            clearInterval(redirectTimer);

            window.location.href = "login.html";

        }

    },1000);

}



/*=========================================================
    VALIDATE CURRENT SESSION
=========================================================*/

async function validateSession(){

    try{

        const { data, error } = await supabaseClient.auth.getSession();

        if(error){

            throw error;

        }



        if(!data.session){

            showMessage(

                "Please login to continue.",

                "error"

            );



            setTimeout(()=>{

                window.location.href = "login.html";

            },2000);



            return false;

        }



        return true;

    }

    catch(error){

        console.error(

            "Session Validation Error:",

            error

        );



        showMessage(

            "Unable to validate your session.",

            "error"

        );



        return false;

    }

}



/*=========================================================
    PAGE INITIALIZATION
=========================================================*/

async function initializeConfirmEmail(){

    const validSession = await validateSession();



    if(!validSession){

        return;

    }



    showMessage(

        "Please verify your email. This page checks automatically every 5 seconds.",

        "info"

    );



    startVerificationWatcher();

}



/*=========================================================
    START APPLICATION
=========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    initializeConfirmEmail

);



console.log("✅ Confirm Email Part 5 Loaded");
/*
=========================================================
    SHOP CAMZON

    CONFIRM EMAIL

    PART 6

    • Refresh Session
    • Auto Redirect
    • Final Verification
=========================================================
*/



/*=========================================================
    REFRESH USER SESSION
=========================================================*/

async function refreshUserSession(){

    try{

        const {

            data,

            error

        } = await supabaseClient.auth.refreshSession();

        if(error){

            throw error;

        }

        return data.session;

    }

    catch(error){

        console.error(

            "Refresh Session:",

            error

        );

        return null;

    }

}



/*=========================================================
    VERIFY & CONTINUE
=========================================================*/

async function verifyAndContinue(){

    const session = await refreshUserSession();

    if(!session){

        return;

    }

    const user = session.user;

    if(user?.email_confirmed_at){

        stopVerificationWatcher();

        showMessage(

            "🎉 Your email has been verified successfully!",

            "success"

        );

        startRedirectCountdown();

    }

}



/*=========================================================
    AUTO CHECK WHEN WINDOW GAINS FOCUS
=========================================================*/

window.addEventListener(

    "focus",

    ()=>{

        verifyAndContinue();

    }

);



/*=========================================================
    CHECK AFTER PAGE LOAD
=========================================================*/

window.addEventListener(

    "load",

    ()=>{

        setTimeout(()=>{

            verifyAndContinue();

        },1500);

    }

);



/*=========================================================
    KEEP SESSION FRESH
=========================================================*/

setInterval(()=>{

    refreshUserSession();

},60000);



console.log("✅ Confirm Email Part 6 Loaded");
/*
=========================================================
    SHOP CAMZON

    CONFIRM EMAIL

    PART 7

    • Cleanup
    • Keyboard Shortcuts
    • Final Initialization
=========================================================
*/



/*=========================================================
    CLEANUP
=========================================================*/

function cleanup(){

    stopVerificationWatcher();

    clearInterval(redirectTimer);

    clearInterval(resendTimer);

}



/*=========================================================
    PAGE UNLOAD
=========================================================*/

window.addEventListener(

    "beforeunload",

    cleanup

);



/*=========================================================
    ENTER KEY SUPPORT
=========================================================*/

document.addEventListener(

    "keydown",

    (event)=>{

        if(event.key === "Enter"){

            event.preventDefault();

            checkEmailVerification();

        }

    }

);



/*=========================================================
    ESC KEY
=========================================================*/

document.addEventListener(

    "keydown",

    (event)=>{

        if(event.key === "Escape"){

            clearMessage();

        }

    }

);



/*=========================================================
    PAGE READY
=========================================================*/

window.addEventListener(

    "load",

    ()=>{

        console.log(

            "======================================"

        );

        console.log(

            " SHOP CAMZON "

        );

        console.log(

            " Confirm Email Ready "

        );

        console.log(

            "======================================"

        );

    }

);



/*=========================================================
    FINAL STARTUP
=========================================================*/

(async()=>{

    try{

        await initializeConfirmEmail();

    }

    catch(error){

        console.error(

            "Initialization Error:",

            error

        );

    }

})();