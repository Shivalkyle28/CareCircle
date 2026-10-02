/* =========================================================
   CARECIRCLE - SIGN IN
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =================================================
           ELEMENTS
           ================================================= */

        const signinForm =
            document.getElementById(
                "signinForm"
            );

        const emailInput =
            document.getElementById(
                "signinEmail"
            );

        const passwordInput =
            document.getElementById(
                "signinPassword"
            );

        const emailError =
            document.getElementById(
                "signinEmailError"
            );

        const passwordError =
            document.getElementById(
                "signinPasswordError"
            );

        const signinMessage =
            document.getElementById(
                "signinMessage"
            );


        /* =================================================
           STORAGE HELPER
           ================================================= */

        function readStorage(
            key,
            fallback
        ) {

            try {

                const value =
                    localStorage.getItem(
                        key
                    );


                return value
                    ? JSON.parse(value)
                    : fallback;

            } catch (error) {

                console.error(
                    `Could not read ${key}`,
                    error
                );


                return fallback;
            }
        }


        /* =================================================
           BACK
           ================================================= */

        document
            .getElementById(
                "signinBackButton"
            )
            .addEventListener(
                "click",
                function () {

                    window.location.href =
                        "index.html";
                }
            );


        /* =================================================
           CREATE ACCOUNT
           ================================================= */

        document
            .getElementById(
                "signinCreateAccount"
            )
            .addEventListener(
                "click",
                function () {

                    window.location.href =
                        "index.html";
                }
            );


        /* =================================================
           SHOW / HIDE PASSWORD
           ================================================= */

        document
            .getElementById(
                "signinPasswordToggle"
            )
            .addEventListener(
                "click",
                function () {

                    const button =
                        this;


                    if (
                        passwordInput.type ===
                        "password"
                    ) {

                        passwordInput.type =
                            "text";


                        button.textContent =
                            "Hide";


                        button.setAttribute(
                            "aria-label",
                            "Hide password"
                        );

                    } else {

                        passwordInput.type =
                            "password";


                        button.textContent =
                            "Show";


                        button.setAttribute(
                            "aria-label",
                            "Show password"
                        );
                    }
                }
            );


        /* =================================================
           CLEAR ERRORS
           ================================================= */

        function clearErrors() {

            emailError.textContent =
                "";


            passwordError.textContent =
                "";


            emailInput.classList.remove(
                "input-invalid"
            );


            passwordInput.classList.remove(
                "input-invalid"
            );


            signinMessage.className =
                "signin-message hidden";


            signinMessage.textContent =
                "";
        }


        /* =================================================
           GENERAL MESSAGE
           ================================================= */

        function showMessage(
            message,
            type = "error"
        ) {

            signinMessage.textContent =
                message;


            signinMessage.className =
                `signin-message ${type}`;
        }


        /* =================================================
           EMAIL VALIDATION
           ================================================= */

        function validEmail(email) {

            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(email);
        }


        /* =================================================
           GET SELECTED ROLE
           ================================================= */

        function getSelectedRole() {

            const selected =
                document.querySelector(
                    'input[name="signinRole"]:checked'
                );


            return selected
                ? selected.value
                : "caregiver";
        }


        /* =================================================
           FIND CAREGIVER ACCOUNT
           ================================================= */

        function getCaregiverAccount() {

            const registration =
                readStorage(
                    "careCircleRegistration",
                    {}
                );


            return (
                registration.caregiver ||
                null
            );
        }


        /* =================================================
           FIND RECIPIENT ACCOUNT
           ================================================= */

        function getRecipientAccount() {

            const account =
                readStorage(
                    "careCircleRecipientAccount",
                    {}
                );


            if (
                account.profile
            ) {

                return account.profile;
            }


            /*
             * Fallback:
             *
             * If the care recipient was created
             * through caregiver registration but
             * has not completed their own account
             * registration yet.
             */

            const registration =
                readStorage(
                    "careCircleRegistration",
                    {}
                );


            return (
                registration.recipient ||
                null
            );
        }


        /* =================================================
           COMPARE EMAILS
           ================================================= */

        function emailsMatch(
            first,
            second
        ) {

            return String(
                first || ""
            )
                .trim()
                .toLowerCase()
                ===
                String(
                    second || ""
                )
                    .trim()
                    .toLowerCase();
        }


        /* =================================================
           SIGN IN
           ================================================= */

        signinForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                clearErrors();


                const email =
                    emailInput
                        .value
                        .trim();


                const password =
                    passwordInput
                        .value;


                const role =
                    getSelectedRole();


                let valid =
                    true;


                /* -----------------------------------------
                   EMAIL
                   ----------------------------------------- */

                if (!email) {

                    emailError.textContent =
                        "Please enter your email.";


                    emailInput.classList.add(
                        "input-invalid"
                    );


                    valid =
                        false;

                } else if (
                    !validEmail(email)
                ) {

                    emailError.textContent =
                        "Please enter a valid email address.";


                    emailInput.classList.add(
                        "input-invalid"
                    );


                    valid =
                        false;
                }


                /* -----------------------------------------
                   PASSWORD
                   ----------------------------------------- */

                if (!password) {

                    passwordError.textContent =
                        "Please enter your password.";


                    passwordInput.classList.add(
                        "input-invalid"
                    );


                    valid =
                        false;
                }


                if (!valid) {
                    return;
                }


                /* =================================================
                   CAREGIVER
                   ================================================= */

                if (
                    role ===
                    "caregiver"
                ) {

                    const caregiver =
                        getCaregiverAccount();


                    if (!caregiver) {

                        showMessage(
                            "No caregiver account has been created on this device yet."
                        );

                        return;
                    }


                    if (
                        !emailsMatch(
                            caregiver.email,
                            email
                        )
                    ) {

                        showMessage(
                            "The email does not match the saved caregiver account."
                        );

                        return;
                    }


                    const currentUser = {

                        role:
                            "caregiver",

                        fullName:
                            caregiver.fullName ||
                            caregiver.name ||
                            "Caregiver",

                        email:
                            caregiver.email ||
                            email

                    };


                    localStorage.setItem(
                        "careCircleCurrentUser",
                        JSON.stringify(
                            currentUser
                        )
                    );


                    showMessage(
                        "Sign in successful.",
                        "success"
                    );


                    setTimeout(
                        function () {

                            window.location.href =
                                "dashboard.html";

                        },
                        350
                    );


                    return;
                }


                /* =================================================
                   CARE RECIPIENT
                   ================================================= */

                if (
                    role ===
                    "recipient"
                ) {

                    const recipient =
                        getRecipientAccount();


                    if (!recipient) {

                        showMessage(
                            "No care recipient account has been created on this device yet."
                        );

                        return;
                    }


                    if (
                        !recipient.email
                    ) {

                        showMessage(
                            "This care recipient does not have a sign-in email yet. Complete the Care Recipient account setup first."
                        );

                        return;
                    }


                    if (
                        !emailsMatch(
                            recipient.email,
                            email
                        )
                    ) {

                        showMessage(
                            "The email does not match the saved care recipient account."
                        );

                        return;
                    }


                    const currentUser = {

                        role:
                            "recipient",

                        fullName:
                            recipient.fullName ||
                            recipient.name ||
                            "Care Recipient",

                        email:
                            recipient.email ||
                            email

                    };


                    localStorage.setItem(
                        "careCircleCurrentUser",
                        JSON.stringify(
                            currentUser
                        )
                    );


                    showMessage(
                        "Sign in successful.",
                        "success"
                    );


                    setTimeout(
                        function () {

                            window.location.href =
                                "recipient-dashboard.html";

                        },
                        350
                    );
                }
            }
        );


        /* =================================================
           REMOVE ERROR WHILE TYPING
           ================================================= */

        emailInput.addEventListener(
            "input",
            function () {

                emailError.textContent =
                    "";


                emailInput.classList.remove(
                    "input-invalid"
                );
            }
        );


        passwordInput.addEventListener(
            "input",
            function () {

                passwordError.textContent =
                    "";


                passwordInput.classList.remove(
                    "input-invalid"
                );
            }
        );

    }
);