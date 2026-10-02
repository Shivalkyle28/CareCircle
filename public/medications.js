/* =========================================================
   CARECIRCLE - MEDICATIONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const app =
        document.querySelector(".medication-app");

    const medicationList =
        document.getElementById("medicationList");

    const formModal =
        document.getElementById("medicationFormModal");

    const detailsModal =
        document.getElementById("medicationDetailsModal");

    const deleteModal =
        document.getElementById("deleteMedicationModal");

    const medicationForm =
        document.getElementById("medicationForm");

    const addButton =
        document.getElementById("addMedicationButton");

    const caregiverNavigation =
        document.getElementById("medicationCaregiverNavigation");

    const recipientNavigation =
        document.getElementById("medicationRecipientNavigation");


    let currentFilter = "all";

    let selectedMedicationId = null;

    let currentMode = "caregiver";


    /* =====================================================
       STORAGE
       ===================================================== */

    function readStorage(key, fallback) {

        try {

            const value =
                localStorage.getItem(key);

            return value
                ? JSON.parse(value)
                : fallback;

        } catch (error) {

            console.error(
                `Unable to read ${key}`,
                error
            );

            return fallback;
        }
    }


    function readArray(key) {

        const value =
            readStorage(key, []);

        return Array.isArray(value)
            ? value
            : [];
    }


    function saveArray(key, value) {

        localStorage.setItem(
            key,
            JSON.stringify(value)
        );
    }


    function getMedications() {

        return readArray(
            "careCircleMedications"
        );
    }


    function saveMedications(medications) {

        saveArray(
            "careCircleMedications",
            medications
        );
    }


    /* =====================================================
       DATE / TIME
       ===================================================== */

    function todayString() {

        const now =
            new Date();

        const year =
            now.getFullYear();

        const month =
            String(
                now.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                now.getDate()
            ).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }


    function currentTimeString() {

        const now =
            new Date();

        return (
            String(
                now.getHours()
            ).padStart(2, "0")
            +
            ":"
            +
            String(
                now.getMinutes()
            ).padStart(2, "0")
        );
    }


    function formatTime(time) {

        if (!time) {
            return "Not scheduled";
        }

        const parts =
            time.split(":");

        let hours =
            Number(parts[0]);

        const minutes =
            parts[1] || "00";

        const period =
            hours >= 12
                ? "PM"
                : "AM";

        hours =
            hours % 12 || 12;

        return `${hours}:${minutes} ${period}`;
    }


    /* =====================================================
       MODE
       ===================================================== */

    function determineMode() {

        const currentUser =
            readStorage(
                "careCircleCurrentUser",
                {}
            );


        /*
         * Recipient registration explicitly sets
         * careCircleCurrentUser.role = "recipient".
         */

        if (
            currentUser.role ===
            "recipient"
        ) {

            currentMode =
                "recipient";

        } else {

            currentMode =
                "caregiver";
        }


        renderMode();
    }


    function renderMode() {

        const roleLabel =
            document.getElementById(
                "medicationPageRole"
            );

        const description =
            document.getElementById(
                "medicationPageDescription"
            );


        if (
            currentMode ===
            "recipient"
        ) {

            app.classList.add(
                "recipient-mode"
            );

            roleLabel.textContent =
                "My Care";

            description.textContent =
                "View your medications and record today's status.";

            caregiverNavigation.classList.add(
                "hidden"
            );

            recipientNavigation.classList.remove(
                "hidden"
            );

        } else {

            app.classList.remove(
                "recipient-mode"
            );

            roleLabel.textContent =
                "Caregiver";

            description.textContent =
                "Manage medications and daily status.";

            caregiverNavigation.classList.remove(
                "hidden"
            );

            recipientNavigation.classList.add(
                "hidden"
            );
        }
    }


    /* =====================================================
       BACK BUTTON
       ===================================================== */

    document
        .getElementById(
            "medicationBackButton"
        )
        .addEventListener(
            "click",
            function () {

                if (
                    currentMode ===
                    "recipient"
                ) {

                    window.location.href =
                        "recipient-dashboard.html";

                } else {

                    window.location.href =
                        "dashboard.html";
                }
            }
        );


    /* =====================================================
       PROFILE
       ===================================================== */

    document
        .getElementById(
            "medicationProfileButton"
        )
        .addEventListener(
            "click",
            function () {

                if (
                    currentMode ===
                    "recipient"
                ) {

                    window.location.href =
                        "mycare.html";

                } else {

                    window.location.href =
                        "patient-setup.html";
                }
            }
        );


    /* =====================================================
       SUMMARY
       ===================================================== */

    function renderSummary() {

        const medications =
            getMedications();


        const pending =
            medications.filter(
                medication =>
                    getStatus(
                        medication
                    ) === "pending"
            ).length;


        const taken =
            medications.filter(
                medication =>
                    getStatus(
                        medication
                    ) === "taken"
            ).length;


        const missed =
            medications.filter(
                medication =>
                    getStatus(
                        medication
                    ) === "missed"
            ).length;


        document
            .getElementById(
                "medicationTotalCount"
            )
            .textContent =
            medications.length;


        document
            .getElementById(
                "medicationPendingCount"
            )
            .textContent =
            pending;


        document
            .getElementById(
                "medicationTakenCount"
            )
            .textContent =
            taken;


        document
            .getElementById(
                "medicationMissedCount"
            )
            .textContent =
            missed;
    }


    /* =====================================================
       DAILY STATUS
       ===================================================== */

    function getStatus(medication) {

        /*
         * If the status was recorded on another
         * day, treat today's dose as Pending.
         */

        if (
            medication.statusDate &&
            medication.statusDate !==
            todayString()
        ) {

            return "pending";
        }


        return String(
            medication.status ||
            "Pending"
        ).toLowerCase();
    }


    function statusLabel(medication) {

        const status =
            getStatus(medication);

        return (
            status.charAt(0).toUpperCase()
            +
            status.slice(1)
        );
    }


    /* =====================================================
       RENDER LIST
       ===================================================== */

    function renderMedications() {

        let medications =
            getMedications();


        if (
            currentFilter !==
            "all"
        ) {

            medications =
                medications.filter(
                    medication =>
                        getStatus(
                            medication
                        ) ===
                        currentFilter
                );
        }


        medications.sort(
            function (a, b) {

                if (
                    !a.nextDose &&
                    !b.nextDose
                ) {
                    return 0;
                }

                if (!a.nextDose) {
                    return 1;
                }

                if (!b.nextDose) {
                    return -1;
                }

                return a.nextDose.localeCompare(
                    b.nextDose
                );
            }
        );


        if (
            medications.length === 0
        ) {

            medicationList.innerHTML = `

                <div class="medication-empty-state">

                    <div class="medication-empty-icon">
                        ◉
                    </div>

                    <h2>
                        ${
                            currentFilter === "all"
                                ? "No medications yet"
                                : `No ${escapeHTML(currentFilter)} medications`
                        }
                    </h2>

                    <p>
                        ${
                            currentMode === "caregiver" &&
                            currentFilter === "all"
                                ? "Add a medication to begin tracking the care schedule."
                                : "There are no medications in this category."
                        }
                    </p>

                </div>

            `;

            renderSummary();

            return;
        }


        medicationList.innerHTML =
            medications
                .map(
                    function (medication) {

                        const status =
                            getStatus(
                                medication
                            );

                        return `

                            <article
                                class="medication-card"
                                data-medication-id="${escapeHTML(
                                    medication.id
                                )}"
                            >

                                <div class="medication-card-top">

                                    <div class="medication-card-icon">
                                        ◉
                                    </div>


                                    <div class="medication-card-main">

                                        <h3>
                                            ${escapeHTML(
                                                medication.name
                                            )}
                                        </h3>

                                        <span class="medication-dose">
                                            ${escapeHTML(
                                                medication.dose
                                            )}
                                        </span>

                                    </div>


                                    <span
                                        class="
                                            medication-card-status
                                            ${status}
                                        "
                                    >
                                        ${escapeHTML(
                                            statusLabel(
                                                medication
                                            )
                                        )}
                                    </span>

                                </div>


                                <div class="medication-card-info">

                                    <div class="medication-info-item">

                                        <span>
                                            Frequency
                                        </span>

                                        <strong>
                                            ${escapeHTML(
                                                medication.frequency
                                            )}
                                        </strong>

                                    </div>


                                    <div class="medication-info-item">

                                        <span>
                                            Next Dose
                                        </span>

                                        <strong>
                                            ${escapeHTML(
                                                formatTime(
                                                    medication.nextDose
                                                )
                                            )}
                                        </strong>

                                    </div>

                                </div>

                            </article>

                        `;
                    }
                )
                .join("");


        document
            .querySelectorAll(
                ".medication-card"
            )
            .forEach(
                function (card) {

                    card.addEventListener(
                        "click",
                        function () {

                            openMedicationDetails(
                                card.dataset
                                    .medicationId
                            );
                        }
                    );
                }
            );


        renderSummary();
    }


    /* =====================================================
       FILTERS
       ===================================================== */

    document
        .querySelectorAll(
            ".medication-filter"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        currentFilter =
                            button.dataset
                                .filter;


                        document
                            .querySelectorAll(
                                ".medication-filter"
                            )
                            .forEach(
                                item =>
                                    item.classList.remove(
                                        "active"
                                    )
                            );


                        button.classList.add(
                            "active"
                        );


                        renderMedications();
                    }
                );
            }
        );


    /* =====================================================
       OPEN ADD FORM
       ===================================================== */

    addButton.addEventListener(
        "click",
        function () {

            if (
                currentMode !==
                "caregiver"
            ) {
                return;
            }


            medicationForm.reset();


            document
                .getElementById(
                    "medicationId"
                )
                .value = "";


            document
                .getElementById(
                    "medicationStatus"
                )
                .value =
                "Pending";


            document
                .getElementById(
                    "medicationModalTitle"
                )
                .textContent =
                "Add Medication";


            formModal.classList.remove(
                "hidden"
            );
        }
    );


    /* =====================================================
       CLOSE FORM
       ===================================================== */

    function closeMedicationForm() {

        formModal.classList.add(
            "hidden"
        );

        medicationForm.reset();
    }


    document
        .getElementById(
            "closeMedicationModal"
        )
        .addEventListener(
            "click",
            closeMedicationForm
        );


    document
        .getElementById(
            "cancelMedicationButton"
        )
        .addEventListener(
            "click",
            closeMedicationForm
        );


    /* =====================================================
       SAVE MEDICATION
       ===================================================== */

    medicationForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            if (
                currentMode !==
                "caregiver"
            ) {
                return;
            }


            const medications =
                getMedications();


            const id =
                document
                    .getElementById(
                        "medicationId"
                    )
                    .value;


            const medication = {

                id:
                    id ||
                    "med-" +
                    Date.now(),

                name:
                    document
                        .getElementById(
                            "medicationName"
                        )
                        .value
                        .trim(),

                dose:
                    document
                        .getElementById(
                            "medicationDose"
                        )
                        .value
                        .trim(),

                frequency:
                    document
                        .getElementById(
                            "medicationFrequency"
                        )
                        .value,

                nextDose:
                    document
                        .getElementById(
                            "medicationNextDose"
                        )
                        .value,

                withFood:
                    document
                        .getElementById(
                            "medicationWithFood"
                        )
                        .value,

                notes:
                    document
                        .getElementById(
                            "medicationNotes"
                        )
                        .value
                        .trim(),

                status:
                    document
                        .getElementById(
                            "medicationStatus"
                        )
                        .value,

                statusDate:
                    todayString(),

                updatedAt:
                    new Date()
                        .toISOString()

            };


            if (id) {

                const index =
                    medications.findIndex(
                        item =>
                            item.id === id
                    );


                if (
                    index !== -1
                ) {

                    medication.createdAt =
                        medications[index]
                            .createdAt ||
                        medication.updatedAt;


                    medications[index] =
                        medication;
                }


                addActivity(
                    "Medication Updated",
                    `${medication.name} ${medication.dose}`
                );

            } else {

                medication.createdAt =
                    medication.updatedAt;


                medications.push(
                    medication
                );


                addActivity(
                    "Medication Added",
                    `${medication.name} ${medication.dose}`
                );
            }


            saveMedications(
                medications
            );


            closeMedicationForm();

            renderMedications();
        }
    );


    /* =====================================================
       DETAILS
       ===================================================== */

    function findMedication(id) {

        return getMedications()
            .find(
                medication =>
                    medication.id === id
            );
    }


    function openMedicationDetails(id) {

        const medication =
            findMedication(id);


        if (!medication) {
            return;
        }


        selectedMedicationId =
            id;


        document
            .getElementById(
                "medicationDetailsTitle"
            )
            .textContent =
            medication.name;


        document
            .getElementById(
                "medicationDetailsContent"
            )
            .innerHTML = `

                <div class="medication-details-hero">

                    <div class="medication-details-hero-icon">
                        ◉
                    </div>

                    <div>

                        <strong>
                            ${escapeHTML(
                                medication.name
                            )}
                        </strong>

                        <span>
                            ${escapeHTML(
                                medication.dose
                            )}
                        </span>

                    </div>

                </div>


                <div class="medication-details-grid">

                    <div class="medication-detail-box">

                        <span>
                            Frequency
                        </span>

                        <strong>
                            ${escapeHTML(
                                medication.frequency
                            )}
                        </strong>

                    </div>


                    <div class="medication-detail-box">

                        <span>
                            Next Dose
                        </span>

                        <strong>
                            ${escapeHTML(
                                formatTime(
                                    medication.nextDose
                                )
                            )}
                        </strong>

                    </div>


                    <div class="medication-detail-box">

                        <span>
                            With Food
                        </span>

                        <strong>
                            ${escapeHTML(
                                medication.withFood ||
                                "Not specified"
                            )}
                        </strong>

                    </div>


                    <div class="medication-detail-box">

                        <span>
                            Status
                        </span>

                        <strong>
                            ${escapeHTML(
                                statusLabel(
                                    medication
                                )
                            )}
                        </strong>

                    </div>

                </div>


                ${
                    medication.notes
                        ? `

                            <div class="medication-notes-box">

                                <span>
                                    Notes
                                </span>

                                <p>
                                    ${escapeHTML(
                                        medication.notes
                                    )}
                                </p>

                            </div>

                        `
                        : ""
                }

            `;


        updateStatusButtons(
            medication
        );


        detailsModal.classList.remove(
            "hidden"
        );
    }


    function closeDetails() {

        detailsModal.classList.add(
            "hidden"
        );

        selectedMedicationId =
            null;
    }


    document
        .getElementById(
            "closeMedicationDetails"
        )
        .addEventListener(
            "click",
            closeDetails
        );


    /* =====================================================
       STATUS BUTTONS
       ===================================================== */

    function updateStatusButtons(
        medication
    ) {

        const current =
            getStatus(
                medication
            );


        document
            .querySelectorAll(
                ".medication-status-button"
            )
            .forEach(
                function (button) {

                    button.classList.toggle(
                        "active",
                        button.dataset
                            .status
                            .toLowerCase() ===
                            current
                    );
                }
            );
    }


    document
        .querySelectorAll(
            ".medication-status-button"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        if (
                            !selectedMedicationId
                        ) {
                            return;
                        }


                        updateMedicationStatus(
                            selectedMedicationId,
                            button.dataset
                                .status
                        );
                    }
                );
            }
        );


    function updateMedicationStatus(
        id,
        status
    ) {

        const medications =
            getMedications();


        const index =
            medications.findIndex(
                medication =>
                    medication.id === id
            );


        if (
            index === -1
        ) {
            return;
        }


        medications[index].status =
            status;


        medications[index].statusDate =
            todayString();


        medications[index].statusTime =
            currentTimeString();


        medications[index].updatedAt =
            new Date()
                .toISOString();


        saveMedications(
            medications
        );


        addActivity(
            `Medication ${status}`,
            `${medications[index].name} ${medications[index].dose}`
        );


        /*
         * Synchronize missed medication with
         * the caregiver Attention area.
         */

        syncMedicationAttention(
            medications[index]
        );


        renderMedications();


        openMedicationDetails(
            id
        );
    }


    /* =====================================================
       CAREGIVER ATTENTION
       ===================================================== */

    function syncMedicationAttention(
        medication
    ) {

        let attention =
            readArray(
                "careCircleAttention"
            );


        const attentionId =
            `medication-${medication.id}`;


        attention =
            attention.filter(
                item =>
                    item.id !==
                    attentionId
            );


        if (
            medication.status ===
            "Missed"
        ) {

            attention.unshift({

                id:
                    attentionId,

                type:
                    "medication",

                title:
                    "Missed Medication",

                description:
                    `${medication.name} ${medication.dose}`,

                date:
                    todayString(),

                time:
                    currentTimeString(),

                createdAt:
                    new Date()
                        .toISOString()

            });
        }


        saveArray(
            "careCircleAttention",
            attention
        );
    }


    /* =====================================================
       EDIT
       ===================================================== */

    document
        .getElementById(
            "editMedicationButton"
        )
        .addEventListener(
            "click",
            function () {

                if (
                    currentMode !==
                    "caregiver" ||
                    !selectedMedicationId
                ) {
                    return;
                }


                const medication =
                    findMedication(
                        selectedMedicationId
                    );


                if (!medication) {
                    return;
                }


                document
                    .getElementById(
                        "medicationId"
                    )
                    .value =
                    medication.id;


                document
                    .getElementById(
                        "medicationName"
                    )
                    .value =
                    medication.name;


                document
                    .getElementById(
                        "medicationDose"
                    )
                    .value =
                    medication.dose;


                document
                    .getElementById(
                        "medicationFrequency"
                    )
                    .value =
                    medication.frequency;


                document
                    .getElementById(
                        "medicationNextDose"
                    )
                    .value =
                    medication.nextDose ||
                    "";


                document
                    .getElementById(
                        "medicationWithFood"
                    )
                    .value =
                    medication.withFood ||
                    "Not specified";


                document
                    .getElementById(
                        "medicationNotes"
                    )
                    .value =
                    medication.notes ||
                    "";


                document
                    .getElementById(
                        "medicationStatus"
                    )
                    .value =
                    statusLabel(
                        medication
                    );


                document
                    .getElementById(
                        "medicationModalTitle"
                    )
                    .textContent =
                    "Edit Medication";


                detailsModal.classList.add(
                    "hidden"
                );


                formModal.classList.remove(
                    "hidden"
                );
            }
        );


    /* =====================================================
       DELETE
       ===================================================== */

    document
        .getElementById(
            "deleteMedicationButton"
        )
        .addEventListener(
            "click",
            function () {

                if (
                    currentMode !==
                    "caregiver" ||
                    !selectedMedicationId
                ) {
                    return;
                }


                deleteModal.classList.remove(
                    "hidden"
                );
            }
        );


    document
        .getElementById(
            "cancelDeleteMedication"
        )
        .addEventListener(
            "click",
            function () {

                deleteModal.classList.add(
                    "hidden"
                );
            }
        );


    document
        .getElementById(
            "confirmDeleteMedication"
        )
        .addEventListener(
            "click",
            function () {

                if (
                    currentMode !==
                    "caregiver" ||
                    !selectedMedicationId
                ) {
                    return;
                }


                const medication =
                    findMedication(
                        selectedMedicationId
                    );


                let medications =
                    getMedications();


                medications =
                    medications.filter(
                        item =>
                            item.id !==
                            selectedMedicationId
                    );


                saveMedications(
                    medications
                );


                /*
                 * Remove any associated
                 * Attention warning.
                 */

                let attention =
                    readArray(
                        "careCircleAttention"
                    );


                attention =
                    attention.filter(
                        item =>
                            item.id !==
                            `medication-${selectedMedicationId}`
                    );


                saveArray(
                    "careCircleAttention",
                    attention
                );


                if (medication) {

                    addActivity(
                        "Medication Deleted",
                        `${medication.name} ${medication.dose}`
                    );
                }


                deleteModal.classList.add(
                    "hidden"
                );


                detailsModal.classList.add(
                    "hidden"
                );


                selectedMedicationId =
                    null;


                renderMedications();
            }
        );


    /* =====================================================
       ACTIVITY LOG
       ===================================================== */

    function addActivity(
        title,
        description
    ) {

        const activities =
            readArray(
                "careCircleActivities"
            );


        activities.unshift({

            id:
                "activity-" +
                Date.now(),

            title:
                title,

            description:
                description,

            date:
                todayString(),

            time:
                currentTimeString(),

            createdAt:
                new Date()
                    .toISOString()

        });


        saveArray(
            "careCircleActivities",
            activities
        );
    }


    /* =====================================================
       ESCAPE HTML
       ===================================================== */

    function escapeHTML(value) {

        return String(
            value ?? ""
        )
            .replaceAll(
                "&",
                "&amp;"
            )
            .replaceAll(
                "<",
                "&lt;"
            )
            .replaceAll(
                ">",
                "&gt;"
            )
            .replaceAll(
                '"',
                "&quot;"
            )
            .replaceAll(
                "'",
                "&#039;"
            );
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    determineMode();

    renderMedications();

});