/* =========================================================
   CARECIRCLE
   CAREGIVER REGISTRATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    let currentStep = 1;

    const totalSteps = 4;

    const form =
        document.getElementById("caregiverRegistrationForm");

    const steps =
        document.querySelectorAll(".registration-step");

    const progressSteps =
        document.querySelectorAll(".progress-step");


    /* =====================================================
       DISPLAY A REGISTRATION STEP
       ===================================================== */

    function showStep(stepNumber) {

        currentStep = stepNumber;

        steps.forEach(function (step, index) {

            if (index + 1 === stepNumber) {
                step.classList.remove("hidden");
            } else {
                step.classList.add("hidden");
            }

        });


        progressSteps.forEach(function (step, index) {

            step.classList.remove("active");
            step.classList.remove("completed");

            if (index + 1 === stepNumber) {
                step.classList.add("active");
            }

            if (index + 1 < stepNumber) {
                step.classList.add("completed");
            }

        });


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }


    /* =====================================================
       REMOVE OLD VALIDATION ERRORS
       ===================================================== */

    function clearErrors(section) {

        const errorInputs =
            section.querySelectorAll(".input-error");

        errorInputs.forEach(function (input) {
            input.classList.remove("input-error");
        });


        const messages =
            section.querySelectorAll(".error-message");

        messages.forEach(function (message) {
            message.remove();
        });

    }


    /* =====================================================
       DISPLAY AN ERROR
       ===================================================== */

    function showError(input, message) {

        input.classList.add("input-error");

        const error =
            document.createElement("span");

        error.className = "error-message";

        error.textContent = message;

        input.insertAdjacentElement(
            "afterend",
            error
        );

    }


    /* =====================================================
       VALIDATE STEP 1
       CAREGIVER INFORMATION
       ===================================================== */

    function validateStep1() {

        const section =
            document.getElementById("step1");

        clearErrors(section);

        let valid = true;


        const fullName =
            document.getElementById("fullName");

        const email =
            document.getElementById("email");

        const phone =
            document.getElementById("phone");

        const address =
            document.getElementById("address");

        const password =
            document.getElementById("password");

        const confirmPassword =
            document.getElementById("confirmPassword");


        if (fullName.value.trim() === "") {

            showError(
                fullName,
                "Please enter your full name."
            );

            valid = false;
        }


        if (email.value.trim() === "") {

            showError(
                email,
                "Please enter your email address."
            );

            valid = false;

        } else if (!email.checkValidity()) {

            showError(
                email,
                "Please enter a valid email address."
            );

            valid = false;
        }


        if (phone.value.trim() === "") {

            showError(
                phone,
                "Please enter your phone number."
            );

            valid = false;
        }


        if (address.value.trim() === "") {

            showError(
                address,
                "Please enter your address."
            );

            valid = false;
        }


        if (password.value === "") {

            showError(
                password,
                "Please create a password."
            );

            valid = false;

        } else if (password.value.length < 6) {

            showError(
                password,
                "Password must contain at least 6 characters."
            );

            valid = false;
        }


        if (confirmPassword.value === "") {

            showError(
                confirmPassword,
                "Please confirm your password."
            );

            valid = false;

        } else if (
            password.value !==
            confirmPassword.value
        ) {

            showError(
                confirmPassword,
                "Passwords do not match."
            );

            valid = false;
        }


        return valid;
    }


    /* =====================================================
       VALIDATE STEP 2
       CARE RECIPIENT INFORMATION
       ===================================================== */

    function validateStep2() {

        const section =
            document.getElementById("step2");

        clearErrors(section);

        let valid = true;


        const recipientName =
            document.getElementById("recipientName");

        const recipientDOB =
            document.getElementById("recipientDOB");

        const recipientGender =
            document.getElementById("recipientGender");

        const relationship =
            document.getElementById("relationship");

        const recipientAddress =
            document.getElementById("recipientAddress");


        if (recipientName.value.trim() === "") {

            showError(
                recipientName,
                "Please enter the care recipient's full name."
            );

            valid = false;
        }


        if (recipientDOB.value === "") {

            showError(
                recipientDOB,
                "Please enter the care recipient's date of birth."
            );

            valid = false;
        }


        if (recipientGender.value === "") {

            showError(
                recipientGender,
                "Please select a gender."
            );

            valid = false;
        }


        if (relationship.value.trim() === "") {

            showError(
                relationship,
                "Please enter your relationship to the care recipient."
            );

            valid = false;
        }


        if (recipientAddress.value.trim() === "") {

            showError(
                recipientAddress,
                "Please enter the care recipient's home address."
            );

            valid = false;
        }


        return valid;
    }


    /* =====================================================
       GET CHECKED VALUES
       ===================================================== */

    function getCheckedValues(name) {

        const selected =
            document.querySelectorAll(
                'input[name="' +
                name +
                '"]:checked'
            );

        return Array.from(selected)
            .map(function (item) {
                return item.value;
            });

    }


    /* =====================================================
       FORMAT LIST FOR REVIEW SCREEN
       ===================================================== */

    function formatList(items) {

        if (items.length === 0) {
            return "None provided";
        }

        return items.join(", ");
    }


    /* =====================================================
       FORMAT DATE
       ===================================================== */

    function formatDate(dateValue) {

        if (!dateValue) {
            return "Not provided";
        }

        const parts =
            dateValue.split("-");

        if (parts.length !== 3) {
            return dateValue;
        }

        return (
            parts[2] +
            "/" +
            parts[1] +
            "/" +
            parts[0]
        );

    }


    /* =====================================================
       BUILD REVIEW SCREEN
       ===================================================== */

    function buildReview() {

        const medicalConditions =
            getCheckedValues(
                "medicalConditions"
            );

        const medications =
            getCheckedValues(
                "medications"
            );

        const accessibility =
            getCheckedValues(
                "accessibility"
            );


        /* ---------------------------------------------
           CAREGIVER
           --------------------------------------------- */

        const caregiverReview =
            document.getElementById(
                "caregiverReview"
            );

        caregiverReview.innerHTML = `
            <div class="review-item">
                <strong>Name:</strong>
                ${escapeHTML(
                    document.getElementById("fullName").value
                )}
            </div>

            <div class="review-item">
                <strong>Email:</strong>
                ${escapeHTML(
                    document.getElementById("email").value
                )}
            </div>

            <div class="review-item">
                <strong>Phone:</strong>
                ${escapeHTML(
                    document.getElementById("phone").value
                )}
            </div>

            <div class="review-item">
                <strong>Address:</strong>
                ${escapeHTML(
                    document.getElementById("address").value
                )}
            </div>
        `;


        /* ---------------------------------------------
           CARE RECIPIENT
           --------------------------------------------- */

        const recipientReview =
            document.getElementById(
                "recipientReview"
            );

        recipientReview.innerHTML = `
            <div class="review-item">
                <strong>Name:</strong>
                ${escapeHTML(
                    document.getElementById("recipientName").value
                )}
            </div>

            <div class="review-item">
                <strong>Date of Birth:</strong>
                ${formatDate(
                    document.getElementById("recipientDOB").value
                )}
            </div>

            <div class="review-item">
                <strong>Gender:</strong>
                ${escapeHTML(
                    document.getElementById("recipientGender").value
                )}
            </div>

            <div class="review-item">
                <strong>Relationship:</strong>
                ${escapeHTML(
                    document.getElementById("relationship").value
                )}
            </div>

            <div class="review-item">
                <strong>Home Address:</strong>
                ${escapeHTML(
                    document.getElementById("recipientAddress").value
                )}
            </div>
        `;


        /* ---------------------------------------------
           HEALTH INFORMATION
           --------------------------------------------- */

        const healthReview =
            document.getElementById(
                "healthReview"
            );

        healthReview.innerHTML = `
            <div class="review-item">
                <strong>Medical Conditions:</strong>
                ${escapeHTML(
                    formatList(medicalConditions)
                )}
            </div>

            <div class="review-item">
                <strong>Medications:</strong>
                ${escapeHTML(
                    formatList(medications)
                )}
            </div>

            <div class="review-item">
                <strong>Accessibility Issues:</strong>
                ${escapeHTML(
                    formatList(accessibility)
                )}
            </div>

            <div class="review-item">
                <strong>Medical History:</strong>
                ${escapeHTML(
                    document.getElementById("medicalHistory").value ||
                    "None provided"
                )}
            </div>

            <div class="review-item">
                <strong>Primary Health Care Provider:</strong>
                ${escapeHTML(
                    document.getElementById("healthProvider").value ||
                    "None provided"
                )}
            </div>
        `;

    }


    /* =====================================================
       BASIC HTML ESCAPING
       Prevent user-entered HTML from being inserted.
       ===================================================== */

    function escapeHTML(value) {

        return String(value)
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    /* =====================================================
       STEP 1 BUTTONS
       ===================================================== */

    document
        .getElementById("backToHome")
        .addEventListener(
            "click",
            function () {

                window.location.href =
                    "index.html";

            }
        );


    document
        .getElementById("nextToRecipient")
        .addEventListener(
            "click",
            function () {

                if (validateStep1()) {
                    showStep(2);
                }

            }
        );


    /* =====================================================
       STEP 2 BUTTONS
       ===================================================== */

    document
        .getElementById("backToDetails")
        .addEventListener(
            "click",
            function () {

                showStep(1);

            }
        );


    document
        .getElementById("nextToHealth")
        .addEventListener(
            "click",
            function () {

                if (validateStep2()) {
                    showStep(3);
                }

            }
        );


    /* =====================================================
       STEP 3 BUTTONS
       ===================================================== */

    document
        .getElementById("backToRecipient")
        .addEventListener(
            "click",
            function () {

                showStep(2);

            }
        );


    document
        .getElementById("nextToReview")
        .addEventListener(
            "click",
            function () {

                buildReview();

                showStep(4);

            }
        );


    /* =====================================================
       STEP 4 BUTTONS
       ===================================================== */

    document
        .getElementById("backToHealth")
        .addEventListener(
            "click",
            function () {

                showStep(3);

            }
        );


    /* =====================================================
       EDIT BUTTONS ON REVIEW SCREEN
       ===================================================== */

    const editButtons =
        document.querySelectorAll(
            "[data-edit-step]"
        );


    editButtons.forEach(function (button) {

        button.addEventListener(
            "click",
            function () {

                const step =
                    Number(
                        button.dataset.editStep
                    );

                showStep(step);

            }
        );

    });


    /* =====================================================
       SAVE REGISTRATION
       ===================================================== */

    form.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (!validateStep1()) {

                showStep(1);

                return;
            }


            if (!validateStep2()) {

                showStep(2);

                return;
            }


            const registrationData = {

                caregiver: {

                    fullName:
                        document
                            .getElementById("fullName")
                            .value
                            .trim(),

                    email:
                        document
                            .getElementById("email")
                            .value
                            .trim(),

                    phone:
                        document
                            .getElementById("phone")
                            .value
                            .trim(),

                    address:
                        document
                            .getElementById("address")
                            .value
                            .trim()

                },


                recipient: {

                    fullName:
                        document
                            .getElementById("recipientName")
                            .value
                            .trim(),

                    dateOfBirth:
                        document
                            .getElementById("recipientDOB")
                            .value,

                    gender:
                        document
                            .getElementById("recipientGender")
                            .value,

                    relationship:
                        document
                            .getElementById("relationship")
                            .value
                            .trim(),

                    address:
                        document
                            .getElementById("recipientAddress")
                            .value
                            .trim()

                },


                health: {

                    medicalConditions:
                        getCheckedValues(
                            "medicalConditions"
                        ),

                    medications:
                        getCheckedValues(
                            "medications"
                        ),

                    accessibility:
                        getCheckedValues(
                            "accessibility"
                        ),

                    medicalHistory:
                        document
                            .getElementById("medicalHistory")
                            .value
                            .trim(),

                    healthProvider:
                        document
                            .getElementById("healthProvider")
                            .value
                            .trim()

                }

            };


            /* -----------------------------------------
               TEMPORARY STORAGE

               This is only for our prototype.

               IMPORTANT:
               We intentionally DO NOT save the password
               to localStorage.

               Later Firebase Authentication will handle
               the actual account password securely.
               ----------------------------------------- */

            localStorage.setItem(
                "careCircleRegistration",
                JSON.stringify(
                    registrationData
                )
            );

            /* =========================================================
   SET CURRENT USER AS CAREGIVER
   ========================================================= */

localStorage.setItem(
    "careCircleCurrentUser",
    JSON.stringify({
        role: "caregiver",

        fullName:
            registrationData.caregiver?.fullName ||
            registrationData.caregiver?.name ||
            "Caregiver",

        email:
            registrationData.caregiver?.email ||
            ""
    })
);

            /* -----------------------------------------
               SUCCESS SCREEN
               ----------------------------------------- */

            form.innerHTML = `

                <div class="registration-success">

                    <div class="success-icon">
                        ✓
                    </div>

                    <h1>
                        Account Created
                    </h1>

                    <p>
                        Your CareCircle profile and
                        care recipient information
                        have been saved successfully.
                    </p>

                    <button
                        type="button"
                        class="primary-button"
                        id="continueToDashboard"
                    >
                        Continue to Dashboard
                    </button>

                </div>

            `;


            document
                .getElementById(
                    "continueToDashboard"
                )
                .addEventListener(
                    "click",
                    function () {

                        window.location.href =
                            "dashboard.html";

                    }
                );

        }
    );


    /* =====================================================
       INITIAL SCREEN
       ===================================================== */

    showStep(1);

});