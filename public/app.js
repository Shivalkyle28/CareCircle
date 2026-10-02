/* =========================================================
   CARECIRCLE
   MAIN APPLICATION JAVASCRIPT
   ========================================================= */


/* =========================================================
   CAREGIVER REGISTRATION
   ========================================================= */

const caregiverButton =
    document.getElementById("caregiverButton");


if (caregiverButton) {

    caregiverButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "caregiver-register.html";

        }
    );

}


/* =========================================================
   CARE RECIPIENT REGISTRATION
   ========================================================= */

const recipientButton =
    document.getElementById("recipientButton");


if (recipientButton) {

    recipientButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "recipient-register.html";

        }
    );

}


/* =========================================================
   SIGN IN
   ========================================================= */

const signinButton =
    document.getElementById("signinButton");


if (signinButton) {

    signinButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "signin.html";

        }
    );
/* =========================================================
   DEVELOPMENT ACCOUNT SWITCHING
   Remove when real authentication is added.
   ========================================================= */

function switchToCaregiver() {

    const registration =
        JSON.parse(
            localStorage.getItem(
                "careCircleRegistration"
            ) || "{}"
        );


    const caregiver =
        registration.caregiver || {};


    localStorage.setItem(
        "careCircleCurrentUser",
        JSON.stringify({
            role: "caregiver",
            fullName:
                caregiver.fullName ||
                caregiver.name ||
                "Caregiver",
            email:
                caregiver.email ||
                ""
        })
    );


    window.location.href =
        "dashboard.html";
}


function switchToRecipient() {

    const account =
        JSON.parse(
            localStorage.getItem(
                "careCircleRecipientAccount"
            ) || "{}"
        );


    const profile =
        account.profile || {};


    localStorage.setItem(
        "careCircleCurrentUser",
        JSON.stringify({
            role: "recipient",
            fullName:
                profile.fullName ||
                "Care Recipient",
            email:
                profile.email ||
                ""
        })
    );


    window.location.href =
        "recipient-dashboard.html";
}
}