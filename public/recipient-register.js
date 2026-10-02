/* =========================================================
   CARECIRCLE CARE RECIPIENT REGISTRATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =================================================
           ELEMENTS
           ================================================= */

        const detailsStep =
            document.getElementById(
                "recipientDetailsStep"
            );

        const joinStep =
            document.getElementById(
                "recipientJoinStep"
            );

        const successStep =
            document.getElementById(
                "recipientSuccessStep"
            );

        const registrationForm =
            document.getElementById(
                "recipientRegistrationForm"
            );

        const backButton =
            document.getElementById(
                "backToRecipientDetails"
            );

        const joinButton =
            document.getElementById(
                "joinDemoFamilyButton"
            );

        const finishButton =
            document.getElementById(
                "finishRecipientRegistration"
            );

        const dashboardButton =
            document.getElementById(
                "goToRecipientDashboard"
            );

        const successMessage =
            document.getElementById(
                "recipientSuccessMessage"
            );


        let familyJoined = false;


        /* =================================================
           FIELD HELPERS
           ================================================= */

        function getValue(id) {

            return document
                .getElementById(id)
                .value
                .trim();
        }


        function showError(
            fieldId,
            errorId,
            message
        ) {

            const field =
                document.getElementById(
                    fieldId
                );

            const error =
                document.getElementById(
                    errorId
                );


            field.classList.add(
                "input-error"
            );

            error.textContent =
                message;
        }


        function clearError(
            fieldId,
            errorId
        ) {

            document
                .getElementById(
                    fieldId
                )
                .classList.remove(
                    "input-error"
                );


            document
                .getElementById(
                    errorId
                )
                .textContent = "";
        }


        function clearAllErrors() {

            const fields = [
                [
                    "recipientFullName",
                    "recipientFullNameError"
                ],
                [
                    "recipientEmail",
                    "recipientEmailError"
                ],
                [
                    "recipientPhone",
                    "recipientPhoneError"
                ],
                [
                    "recipientAddress",
                    "recipientAddressError"
                ],
                [
                    "recipientPassword",
                    "recipientPasswordError"
                ],
                [
                    "recipientConfirmPassword",
                    "recipientConfirmPasswordError"
                ]
            ];


            fields.forEach(
                function (field) {

                    clearError(
                        field[0],
                        field[1]
                    );
                }
            );
        }


        /* =================================================
           VALIDATION
           ================================================= */

        function validateDetails() {

            clearAllErrors();


            let valid = true;


            const fullName =
                getValue(
                    "recipientFullName"
                );


            const email =
                getValue(
                    "recipientEmail"
                );


            const phone =
                getValue(
                    "recipientPhone"
                );


            const address =
                getValue(
                    "recipientAddress"
                );


            const password =
                document
                    .getElementById(
                        "recipientPassword"
                    )
                    .value;


            const confirmPassword =
                document
                    .getElementById(
                        "recipientConfirmPassword"
                    )
                    .value;


            if (!fullName) {

                showError(
                    "recipientFullName",
                    "recipientFullNameError",
                    "Please enter your full name."
                );

                valid = false;
            }


            if (!email) {

                showError(
                    "recipientEmail",
                    "recipientEmailError",
                    "Please enter your email address."
                );

                valid = false;

            } else {

                const emailPattern =
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


                if (
                    !emailPattern.test(
                        email
                    )
                ) {

                    showError(
                        "recipientEmail",
                        "recipientEmailError",
                        "Please enter a valid email address."
                    );

                    valid = false;
                }
            }


            if (!phone) {

                showError(
                    "recipientPhone",
                    "recipientPhoneError",
                    "Please enter your phone number."
                );

                valid = false;
            }


            if (!address) {

                showError(
                    "recipientAddress",
                    "recipientAddressError",
                    "Please enter your address."
                );

                valid = false;
            }


            if (
                password.length < 6
            ) {

                showError(
                    "recipientPassword",
                    "recipientPasswordError",
                    "Password must contain at least 6 characters."
                );

                valid = false;
            }


            if (
                confirmPassword !==
                password
            ) {

                showError(
                    "recipientConfirmPassword",
                    "recipientConfirmPasswordError",
                    "Passwords do not match."
                );

                valid = false;
            }


            return valid;
        }


        /* =================================================
           TEMPORARILY STORE FORM DATA

           Password is deliberately excluded.
           ================================================= */

        function getRecipientDetails() {

            return {

                fullName:
                    getValue(
                        "recipientFullName"
                    ),

                email:
                    getValue(
                        "recipientEmail"
                    ),

                phone:
                    getValue(
                        "recipientPhone"
                    ),

                address:
                    getValue(
                        "recipientAddress"
                    )

            };
        }


        /* =================================================
           DETAILS → QR SCREEN
           ================================================= */

        registrationForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                if (
                    !validateDetails()
                ) {
                    return;
                }


                detailsStep.classList.add(
                    "hidden"
                );


                joinStep.classList.remove(
                    "hidden"
                );


                window.scrollTo(
                    0,
                    0
                );
            }
        );


        /* =================================================
           QR → DETAILS
           ================================================= */

        backButton.addEventListener(
            "click",
            function () {

                joinStep.classList.add(
                    "hidden"
                );


                detailsStep.classList.remove(
                    "hidden"
                );


                window.scrollTo(
                    0,
                    0
                );
            }
        );


        /* =================================================
           SIMULATE QR FAMILY CONNECTION
           ================================================= */

        joinButton.addEventListener(
            "click",
            function () {

                familyJoined = true;


                const scanner =
                    document.querySelector(
                        ".qr-scanner-frame"
                    );


                const scannerCenter =
                    document.querySelector(
                        ".qr-scanner-center"
                    );


                scanner.classList.add(
                    "connected"
                );


                scannerCenter.innerHTML = `

                    <div class="qr-icon">
                        ✓
                    </div>

                    <strong>
                        CareCircle Connected
                    </strong>

                    <p>
                        Family connection successful.
                    </p>

                `;


                joinButton.textContent =
                    "Connected";


                joinButton.disabled =
                    true;


                finishButton.disabled =
                    false;
            }
        );


        /* =================================================
           SAVE RECIPIENT ACCOUNT
           ================================================= */

        function saveRecipientAccount() {

            const details =
                getRecipientDetails();


            /*
             * Recipient-side account data.
             *
             * Password is NOT stored in localStorage.
             */

            const account = {

                role:
                    "recipient",

                profile:
                    details,

                familyConnected:
                    true,

                joinedAt:
                    new Date()
                        .toISOString()

            };


            localStorage.setItem(
                "careCircleRecipientAccount",
                JSON.stringify(account)
            );


            /*
             * Store a common active user record too.
             * This will be useful when Sign In is built.
             */

            localStorage.setItem(
                "careCircleCurrentUser",
                JSON.stringify({
                    role:
                        "recipient",

                    fullName:
                        details.fullName,

                    email:
                        details.email
                })
            );


            return account;
        }


        /* =================================================
           COMPLETE REGISTRATION
           ================================================= */

        finishButton.addEventListener(
            "click",
            function () {

                if (!familyJoined) {
                    return;
                }


                const account =
                    saveRecipientAccount();


                joinStep.classList.add(
                    "hidden"
                );


                successStep.classList.remove(
                    "hidden"
                );


                const firstName =
                    account.profile.fullName
                        .split(/\s+/)[0];


                successMessage.textContent =
                    `${firstName}, your account is ready and your family CareCircle is connected.`;


                window.scrollTo(
                    0,
                    0
                );
            }
        );


        /* =================================================
           DASHBOARD
           ================================================= */

        dashboardButton.addEventListener(
            "click",
            function () {

                window.location.href =
                    "recipient-dashboard.html";
            }
        );

    }
);