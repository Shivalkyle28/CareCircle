// =====================================================
// CARECIRCLE
// Main JavaScript File
// =====================================================


// =====================================================
// 1. CAREGIVER PROFILE SETUP
// Used on: index.html
// =====================================================

const caregiverForm = document.getElementById("caregiverForm");

if (caregiverForm) {

    caregiverForm.addEventListener("submit", function (event) {

        // Stop the form from refreshing the page
        event.preventDefault();

        // Collect information entered by the caregiver
        const caregiver = {

            firstName: document.getElementById("firstName").value.trim(),

            lastName: document.getElementById("lastName").value.trim(),

            email: document.getElementById("email").value.trim(),

            phone: document.getElementById("phone").value.trim(),

            relationship: document.getElementById("relationship").value
        };


        // Save the caregiver information in the browser
        localStorage.setItem(
            "caregiver",
            JSON.stringify(caregiver)
        );


        // Check that the information was saved
        console.log("Caregiver profile saved:", caregiver);


        // Move to Step 2
        window.location.href = "patient-setup.html";

    });

}


// =====================================================
// 2. QUICK ADD
// Used on: dashboard.html
// =====================================================

const quickAddBtn = document.getElementById("quickAddBtn");

if (quickAddBtn) {

    quickAddBtn.addEventListener("click", function () {

        const option = prompt(
            "Quick Add\n\n" +
            "1. Medication\n" +
            "2. Appointment\n" +
            "3. Health Reading\n" +
            "4. Care Task\n" +
            "5. Wellness Note\n\n" +
            "Enter a number:"
        );


        if (option === "1") {

            alert("Medication selected");

        }

        else if (option === "2") {

            alert("Appointment selected");

        }

        else if (option === "3") {

            alert("Health Reading selected");

        }

        else if (option === "4") {

            alert("Care Task selected");

        }

        else if (option === "5") {

            alert("Wellness Note selected");

        }

        else if (option !== null) {

            alert("Please choose a number from 1 to 5.");

        }

    });

}
// =====================================================
// 2. PERSON IN CARE SETUP
// Used on: patient-setup.html
// =====================================================

const patientForm = document.getElementById("patientForm");


// Get caregiver information saved during Step 1
const savedCaregiver = JSON.parse(
    localStorage.getItem("caregiver")
);


// Display caregiver's name on the setup page
const patientSetupGreeting =
    document.getElementById("patientSetupGreeting");


if (patientSetupGreeting && savedCaregiver) {

    patientSetupGreeting.textContent =
        `Great, ${savedCaregiver.firstName}. Who will you be caring for?`;

}


// Handle the Person in Care form
if (patientForm) {

    patientForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const patient = {

            firstName:
                document.getElementById("patientFirstName").value.trim(),

            lastName:
                document.getElementById("patientLastName").value.trim(),

            dateOfBirth:
                document.getElementById("patientDOB").value,

            sex:
                document.getElementById("patientSex").value,

            phone:
                document.getElementById("patientPhone").value.trim(),

            address:
                document.getElementById("patientAddress").value.trim(),

            doctor:
                document.getElementById("doctorName").value.trim(),

            medicalConditions:
                document.getElementById("medicalConditions").value.trim(),

            allergies:
                document.getElementById("allergies").value.trim(),

            emergencyContact: {

                name:
                    document.getElementById("emergencyName").value.trim(),

                phone:
                    document.getElementById("emergencyPhone").value.trim(),

                relationship:
                    document.getElementById("emergencyRelationship").value

            }

        };


        // Save Person in Care
        localStorage.setItem(
            "patient",
            JSON.stringify(patient)
        );


        console.log(
            "Person in care saved:",
            patient
        );


        // Move to Step 3
        window.location.href = "care-setup.html";

    });

}
// =====================================================
// 3. CARE INFORMATION SETUP
// Used on: care-setup.html
// =====================================================


// --------------------------
// Get person in care
// --------------------------

const savedPatient = JSON.parse(
    localStorage.getItem("patient")
);

const careSetupHeading =
    document.getElementById("careSetupHeading");


if (careSetupHeading && savedPatient) {

    careSetupHeading.textContent =
        `Let's set up ${savedPatient.firstName}'s care`;

}



// =====================================================
// MEDICATION SETUP
// =====================================================

let medications =
    JSON.parse(localStorage.getItem("medications")) || [];


const medicationSetupForm =
    document.getElementById("medicationSetupForm");

const showMedicationForm =
    document.getElementById("showMedicationForm");

const cancelMedicationSetup =
    document.getElementById("cancelMedicationSetup");

const saveMedicationSetup =
    document.getElementById("saveMedicationSetup");



if (showMedicationForm) {

    showMedicationForm.addEventListener("click", function () {

        medicationSetupForm.classList.remove("hidden");

        showMedicationForm.classList.add("hidden");

    });

}


if (cancelMedicationSetup) {

    cancelMedicationSetup.addEventListener("click", function () {

        medicationSetupForm.classList.add("hidden");

        showMedicationForm.classList.remove("hidden");

    });

}


if (saveMedicationSetup) {

    saveMedicationSetup.addEventListener("click", function () {

        const name =
            document
                .getElementById("setupMedicationName")
                .value
                .trim();

        const dose =
            document
                .getElementById("setupMedicationDose")
                .value
                .trim();

        const time =
            document
                .getElementById("setupMedicationTime")
                .value;


        if (!name || !dose || !time) {

            alert("Please complete all medication fields.");

            return;

        }


        const medication = {
            name,
            dose,
            time,
            status: "Pending"
        };


        medications.push(medication);


        localStorage.setItem(
            "medications",
            JSON.stringify(medications)
        );


        document.getElementById("setupMedicationName").value = "";
        document.getElementById("setupMedicationDose").value = "";
        document.getElementById("setupMedicationTime").value = "";


        medicationSetupForm.classList.add("hidden");

        showMedicationForm.classList.remove("hidden");


        displaySetupMedications();

    });

}



function displaySetupMedications() {

    const list =
        document.getElementById("medicationSetupList");


    if (!list) {
        return;
    }


    list.innerHTML = "";


    medications.forEach(function (medication, index) {

        const item =
            document.createElement("div");


        item.classList.add("setup-saved-item");


        item.innerHTML = `

            <div>

                <strong>
                    ${medication.name}
                </strong>

                <span>
                    ${medication.dose} • ${medication.time}
                </span>

            </div>

            <button
                type="button"
                onclick="deleteMedicationSetup(${index})"
            >
                <i class="fa-solid fa-trash"></i>
            </button>

        `;


        list.appendChild(item);

    });

}



function deleteMedicationSetup(index) {

    medications.splice(index, 1);


    localStorage.setItem(
        "medications",
        JSON.stringify(medications)
    );


    displaySetupMedications();

}



displaySetupMedications();



// =====================================================
// APPOINTMENT SETUP
// =====================================================

let appointments =
    JSON.parse(localStorage.getItem("appointments")) || [];


const appointmentSetupForm =
    document.getElementById("appointmentSetupForm");

const showAppointmentForm =
    document.getElementById("showAppointmentForm");

const cancelAppointmentSetup =
    document.getElementById("cancelAppointmentSetup");

const saveAppointmentSetup =
    document.getElementById("saveAppointmentSetup");



if (showAppointmentForm) {

    showAppointmentForm.addEventListener("click", function () {

        appointmentSetupForm.classList.remove("hidden");

        showAppointmentForm.classList.add("hidden");

    });

}



if (cancelAppointmentSetup) {

    cancelAppointmentSetup.addEventListener("click", function () {

        appointmentSetupForm.classList.add("hidden");

        showAppointmentForm.classList.remove("hidden");

    });

}



if (saveAppointmentSetup) {

    saveAppointmentSetup.addEventListener("click", function () {

        const title =
            document
                .getElementById("setupAppointmentTitle")
                .value
                .trim();

        const date =
            document
                .getElementById("setupAppointmentDate")
                .value;

        const time =
            document
                .getElementById("setupAppointmentTime")
                .value;

        const location =
            document
                .getElementById("setupAppointmentLocation")
                .value
                .trim();


        if (!title || !date || !time) {

            alert(
                "Please enter the appointment name, date and time."
            );

            return;

        }


        const appointment = {
            title,
            date,
            time,
            location
        };


        appointments.push(appointment);


        localStorage.setItem(
            "appointments",
            JSON.stringify(appointments)
        );


        document.getElementById("setupAppointmentTitle").value = "";
        document.getElementById("setupAppointmentDate").value = "";
        document.getElementById("setupAppointmentTime").value = "";
        document.getElementById("setupAppointmentLocation").value = "";


        appointmentSetupForm.classList.add("hidden");

        showAppointmentForm.classList.remove("hidden");


        displaySetupAppointments();

    });

}



function displaySetupAppointments() {

    const list =
        document.getElementById("appointmentSetupList");


    if (!list) {
        return;
    }


    list.innerHTML = "";


    appointments.forEach(function (appointment, index) {

        const item =
            document.createElement("div");


        item.classList.add("setup-saved-item");


        item.innerHTML = `

            <div>

                <strong>
                    ${appointment.title}
                </strong>

                <span>
                    ${appointment.date} • ${appointment.time}
                </span>

            </div>

            <button
                type="button"
                onclick="deleteAppointmentSetup(${index})"
            >
                <i class="fa-solid fa-trash"></i>
            </button>

        `;


        list.appendChild(item);

    });

}



function deleteAppointmentSetup(index) {

    appointments.splice(index, 1);


    localStorage.setItem(
        "appointments",
        JSON.stringify(appointments)
    );


    displaySetupAppointments();

}



displaySetupAppointments();



// =====================================================
// CARE TASK SETUP
// =====================================================

let careTasks =
    JSON.parse(localStorage.getItem("careTasks")) || [];


const taskSetupForm =
    document.getElementById("taskSetupForm");

const showTaskForm =
    document.getElementById("showTaskForm");

const cancelTaskSetup =
    document.getElementById("cancelTaskSetup");

const saveTaskSetup =
    document.getElementById("saveTaskSetup");



if (showTaskForm) {

    showTaskForm.addEventListener("click", function () {

        taskSetupForm.classList.remove("hidden");

        showTaskForm.classList.add("hidden");

    });

}



if (cancelTaskSetup) {

    cancelTaskSetup.addEventListener("click", function () {

        taskSetupForm.classList.add("hidden");

        showTaskForm.classList.remove("hidden");

    });

}



if (saveTaskSetup) {

    saveTaskSetup.addEventListener("click", function () {

        const taskName =
            document
                .getElementById("setupTaskName")
                .value
                .trim();

        const taskTime =
            document
                .getElementById("setupTaskTime")
                .value;

        const frequency =
            document
                .getElementById("setupTaskFrequency")
                .value;


        if (!taskName) {

            alert("Please enter a task.");

            return;

        }


        const task = {

            name: taskName,

            time: taskTime,

            frequency: frequency,

            status: "Pending"

        };


        careTasks.push(task);


        localStorage.setItem(
            "careTasks",
            JSON.stringify(careTasks)
        );


        document.getElementById("setupTaskName").value = "";
        document.getElementById("setupTaskTime").value = "";


        taskSetupForm.classList.add("hidden");

        showTaskForm.classList.remove("hidden");


        displaySetupTasks();

    });

}



function displaySetupTasks() {

    const list =
        document.getElementById("taskSetupList");


    if (!list) {
        return;
    }


    list.innerHTML = "";


    careTasks.forEach(function (task, index) {

        const item =
            document.createElement("div");


        item.classList.add("setup-saved-item");


        item.innerHTML = `

            <div>

                <strong>
                    ${task.name}
                </strong>

                <span>
                    ${task.frequency}
                    ${task.time ? " • " + task.time : ""}
                </span>

            </div>

            <button
                type="button"
                onclick="deleteTaskSetup(${index})"
            >
                <i class="fa-solid fa-trash"></i>
            </button>

        `;


        list.appendChild(item);

    });

}



function deleteTaskSetup(index) {

    careTasks.splice(index, 1);


    localStorage.setItem(
        "careTasks",
        JSON.stringify(careTasks)
    );


    displaySetupTasks();

}



displaySetupTasks();



// =====================================================
// FINISH CARE SETUP
// =====================================================

const finishCareSetup =
    document.getElementById("finishCareSetup");


if (finishCareSetup) {

    finishCareSetup.addEventListener("click", function () {


        // Get health monitoring selections

        const selectedHealthMetrics = [];


        document
            .querySelectorAll(".healthMetric:checked")
            .forEach(function (checkbox) {

                selectedHealthMetrics.push(
                    checkbox.value
                );

            });


        localStorage.setItem(
            "healthMetrics",
            JSON.stringify(selectedHealthMetrics)
        );


        localStorage.setItem(
            "careSetupComplete",
            "true"
        );


        console.log(
            "Care setup complete"
        );


        window.location.href =
            "dashboard.html";

    });

}
// =====================================================
// 4. DASHBOARD
// Used on: dashboard.html
// =====================================================

function initialiseDashboard() {

    const dashboardPatientName =
        document.getElementById("dashboardPatientName");


    // If this element does not exist,
    // we are not currently on dashboard.html
    if (!dashboardPatientName) {
        return;
    }


    // =================================================
    // LOAD SAVED INFORMATION
    // =================================================

    const caregiver =
        JSON.parse(localStorage.getItem("caregiver"));

    const patient =
        JSON.parse(localStorage.getItem("patient"));

    const medications =
        JSON.parse(localStorage.getItem("medications")) || [];

    const appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];

    const careTasks =
        JSON.parse(localStorage.getItem("careTasks")) || [];

    const healthMetrics =
        JSON.parse(localStorage.getItem("healthMetrics")) || [];



    // =================================================
    // CAREGIVER INFORMATION
    // =================================================

    if (caregiver) {

        const fullCaregiverName =
            `${caregiver.firstName} ${caregiver.lastName}`;


        document.getElementById(
            "headerCaregiverName"
        ).textContent = fullCaregiverName;


        document.getElementById(
            "headerRelationship"
        ).textContent =
            caregiver.relationship || "Caregiver";


        document.getElementById(
            "dashboardGreeting"
        ).textContent =
            `Good morning, ${caregiver.firstName}`;


        // Create initials

        const initials =
            `${caregiver.firstName.charAt(0)}${caregiver.lastName.charAt(0)}`;


        document.getElementById(
            "caregiverInitials"
        ).textContent =
            initials.toUpperCase();

    }



    // =================================================
    // PERSON IN CARE INFORMATION
    // =================================================

    if (patient) {

        const fullPatientName =
            `${patient.firstName} ${patient.lastName}`;


        document.getElementById(
            "dashboardPatientName"
        ).textContent =
            fullPatientName;


        document.getElementById(
            "patientInitial"
        ).textContent =
            patient.firstName.charAt(0).toUpperCase();


        document.getElementById(
            "dashboardMessage"
        ).textContent =
            `Here's an overview of ${patient.firstName}'s care today.`;


        document.getElementById(
            "patientAddress"
        ).textContent =
            patient.address || "Address not provided";


        // Calculate age

        if (patient.dateOfBirth) {

            const age =
                calculateAge(patient.dateOfBirth);


            document.getElementById(
                "patientAge"
            ).textContent =
                `Age ${age}`;

        }

    }



    // =================================================
    // MEDICATION SUMMARY
    // =================================================

    document.getElementById(
        "medicationCount"
    ).textContent =
        medications.length;


    const pendingMedications =
        medications.filter(function (medication) {

            return medication.status !== "Taken";

        });


    if (medications.length === 0) {

        document.getElementById(
            "medicationSummary"
        ).textContent =
            "No medications added yet.";

    }

    else {

        document.getElementById(
            "medicationSummary"
        ).textContent =
            `${pendingMedications.length} medication(s) pending.`;

    }



    // =================================================
    // APPOINTMENT SUMMARY
    // =================================================

    document.getElementById(
        "appointmentCount"
    ).textContent =
        appointments.length;


    if (appointments.length > 0) {

        const firstAppointment =
            appointments[0];


        document.getElementById(
            "appointmentSummary"
        ).textContent =
            `Next: ${firstAppointment.title}`;

    }

    else {

        document.getElementById(
            "appointmentSummary"
        ).textContent =
            "No appointments added yet.";

    }



    // =================================================
    // TASK SUMMARY
    // =================================================

    document.getElementById(
        "taskCount"
    ).textContent =
        careTasks.length;


    const pendingTasks =
        careTasks.filter(function (task) {

            return task.status !== "Completed";

        });


    if (careTasks.length > 0) {

        document.getElementById(
            "taskSummary"
        ).textContent =
            `${pendingTasks.length} task(s) pending.`;

    }

    else {

        document.getElementById(
            "taskSummary"
        ).textContent =
            "No care tasks added yet.";

    }



    // =================================================
    // HEALTH METRIC SUMMARY
    // =================================================

    document.getElementById(
        "healthMetricCount"
    ).textContent =
        healthMetrics.length;


    if (healthMetrics.length > 0) {

        document.getElementById(
            "healthMetricSummary"
        ).textContent =
            healthMetrics.join(", ");

    }

    else {

        document.getElementById(
            "healthMetricSummary"
        ).textContent =
            "No health monitoring selected.";

    }



    // =================================================
    // CREATE HEALTH MONITORING CARDS
    // =================================================

    displayHealthMonitoring(
        healthMetrics
    );



    // =================================================
    // DISPLAY APPOINTMENTS
    // =================================================

    displayDashboardAppointments(
        appointments
    );



    // =================================================
    // DISPLAY TASKS
    // =================================================

    displayDashboardTasks(
        careTasks
    );



    // =================================================
    // DISPLAY MEDICATIONS
    // =================================================

    displayDashboardMedications(
        medications
    );

}



// =====================================================
// AGE CALCULATION
// =====================================================

function calculateAge(dateOfBirth) {

    const birthDate =
        new Date(dateOfBirth);

    const today =
        new Date();


    let age =
        today.getFullYear()
        - birthDate.getFullYear();


    const monthDifference =
        today.getMonth()
        - birthDate.getMonth();


    if (
        monthDifference < 0 ||
        (
            monthDifference === 0 &&
            today.getDate() <
            birthDate.getDate()
        )
    ) {

        age--;

    }


    return age;

}



// =====================================================
// HEALTH MONITORING
// =====================================================

function displayHealthMonitoring(metrics) {

    const container =
        document.getElementById(
            "healthMonitoringCards"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (metrics.length === 0) {

        container.innerHTML = `

            <div class="dashboard-empty">

                <i class="fa-solid fa-heart-pulse"></i>

                <p>
                    No health monitoring has been selected yet.
                </p>

                <a href="care-setup.html">
                    Add health monitoring
                </a>

            </div>

        `;

        return;

    }



    metrics.forEach(function (metric) {

        let icon =
            "fa-solid fa-heart-pulse";


        if (metric === "Blood Glucose") {

            icon =
                "fa-solid fa-droplet";

        }

        else if (metric === "Temperature") {

            icon =
                "fa-solid fa-temperature-half";

        }

        else if (metric === "Weight") {

            icon =
                "fa-solid fa-weight-scale";

        }

        else if (metric === "Water Intake") {

            icon =
                "fa-solid fa-glass-water";

        }

        else if (metric === "Sleep") {

            icon =
                "fa-solid fa-moon";

        }


        const card =
            document.createElement("article");


        card.classList.add(
            "health-card"
        );


        card.innerHTML = `

            <div class="health-card-header">

                <div class="icon-box">
                    <i class="${icon}"></i>
                </div>

                <span class="status-badge success">
                    Tracking
                </span>

            </div>


            <p class="card-label">
                ${metric}
            </p>


            <h4 class="no-reading">
                --
            </h4>


            <p class="measurement">
                No reading yet
            </p>


            <p class="card-footer">
                Add the first reading from Reports.
            </p>

        `;


        container.appendChild(card);

    });

}



// =====================================================
// DASHBOARD APPOINTMENTS
// =====================================================

function displayDashboardAppointments(appointments) {

    const container =
        document.getElementById(
            "dashboardAppointments"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (appointments.length === 0) {

        container.innerHTML = `

            <div class="dashboard-empty">

                <i class="fa-regular fa-calendar"></i>

                <p>
                    No upcoming appointments.
                </p>

                <a href="events.html">
                    Add appointment
                </a>

            </div>

        `;

        return;

    }



    appointments
        .slice(0, 3)
        .forEach(function (appointment) {


            const date =
                new Date(
                    appointment.date + "T00:00:00"
                );


            const day =
                date
                    .getDate()
                    .toString()
                    .padStart(2, "0");


            const month =
                date
                    .toLocaleString(
                        "en",
                        { month: "short" }
                    )
                    .toUpperCase();


            const event =
                document.createElement("div");


            event.classList.add("event");


            event.innerHTML = `

                <div class="event-date">

                    <strong>
                        ${day}
                    </strong>

                    <span>
                        ${month}
                    </span>

                </div>


                <div class="event-information">

                    <h4>
                        ${appointment.title}
                    </h4>

                    <p>
                        <i class="fa-regular fa-clock"></i>

                        ${formatTime(
                            appointment.time
                        )}
                    </p>


                    <p>

                        <i class="fa-solid fa-location-dot"></i>

                        ${
                            appointment.location
                            || "Location not specified"
                        }

                    </p>

                </div>

            `;


            container.appendChild(event);

        });

}



// =====================================================
// DASHBOARD CARE TASKS
// =====================================================

function displayDashboardTasks(tasks) {

    const container =
        document.getElementById(
            "dashboardTasks"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const pending =
        tasks.filter(function (task) {

            return task.status !== "Completed";

        });


    if (pending.length === 0) {

        container.innerHTML = `

            <div class="dashboard-empty">

                <i class="fa-solid fa-list-check"></i>

                <p>
                    No pending care tasks.
                </p>

                <a href="todo.html">
                    Add task
                </a>

            </div>

        `;

        return;

    }



    pending
        .slice(0, 4)
        .forEach(function (task) {


            const activity =
                document.createElement("div");


            activity.classList.add("activity");


            activity.innerHTML = `

                <div class="activity-icon">

                    <i class="fa-solid fa-list-check"></i>

                </div>


                <div>

                    <h4>
                        ${task.name}
                    </h4>

                    <p>
                        ${task.frequency}
                    </p>

                    <span>
                        ${
                            task.time
                            ? formatTime(task.time)
                            : "No time specified"
                        }
                    </span>

                </div>

            `;


            container.appendChild(activity);

        });

}



// =====================================================
// DASHBOARD MEDICATIONS
// =====================================================

function displayDashboardMedications(
    medications
) {

    const container =
        document.getElementById(
            "dashboardMedicationList"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (medications.length === 0) {

        container.innerHTML = `

            <div class="dashboard-empty">

                <i class="fa-solid fa-pills"></i>

                <p>
                    No medications have been added.
                </p>

                <a href="medications.html">
                    Add medication
                </a>

            </div>

        `;

        return;

    }



    medications.forEach(
        function (medication) {


            const item =
                document.createElement("div");


            item.classList.add(
                "dashboard-medication"
            );


            item.innerHTML = `

                <div class="dashboard-medication-icon">

                    <i class="fa-solid fa-pills"></i>

                </div>


                <div class="dashboard-medication-info">

                    <strong>
                        ${medication.name}
                    </strong>

                    <span>
                        ${medication.dose}
                    </span>

                </div>


                <div class="dashboard-medication-time">

                    ${formatTime(
                        medication.time
                    )}

                </div>


                <span class="status-badge warning">

                    ${medication.status}

                </span>

            `;


            container.appendChild(item);

        });

}



// =====================================================
// FORMAT TIME
// Converts 13:30 to 1:30 PM
// =====================================================

function formatTime(time) {

    if (!time) {
        return "";
    }


    const parts =
        time.split(":");


    let hours =
        parseInt(parts[0]);

    const minutes =
        parts[1];


    const period =
        hours >= 12
            ? "PM"
            : "AM";


    hours =
        hours % 12 || 12;


    return `${hours}:${minutes} ${period}`;

}



// =====================================================
// START DASHBOARD
// =====================================================

initialiseDashboard();