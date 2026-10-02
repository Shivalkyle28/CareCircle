/* =========================================================
   CARECIRCLE CARE RECIPIENT DASHBOARD
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {
        /* =========================================================
   RECIPIENT ACCESS CHECK
   ========================================================= */

const currentUser = JSON.parse(
    localStorage.getItem("careCircleCurrentUser") ||
    "{}"
);

if (
    currentUser.role &&
    currentUser.role !== "recipient"
) {

    window.location.href =
        "dashboard.html";

    return;
}
        /* =================================================
           ELEMENTS
           ================================================= */

        const greetingName =
            document.getElementById(
                "recipientGreetingName"
            );

        const currentDate =
            document.getElementById(
                "recipientCurrentDate"
            );


        const medicationCard =
            document.getElementById(
                "recipientMedicationCard"
            );

        const calendarCard =
            document.getElementById(
                "recipientCalendarCard"
            );

        const mealsCard =
            document.getElementById(
                "recipientMealsCard"
            );

        const activityCard =
            document.getElementById(
                "recipientActivityCard"
            );

        const waterCard =
            document.getElementById(
                "recipientWaterCard"
            );

        const moodCard =
            document.getElementById(
                "recipientMoodCard"
            );


        const medicationSummary =
            document.getElementById(
                "recipientMedicationSummary"
            );

        const calendarSummary =
            document.getElementById(
                "recipientCalendarSummary"
            );

        const mealsSummary =
            document.getElementById(
                "recipientMealsSummary"
            );

        const activitySummary =
            document.getElementById(
                "recipientActivitySummary"
            );

        const waterSummary =
            document.getElementById(
                "recipientWaterSummary"
            );

        const moodSummary =
            document.getElementById(
                "recipientMoodSummary"
            );

        const moodIcon =
            document.getElementById(
                "recipientMoodIcon"
            );


        /* =================================================
           MODALS
           ================================================= */

        const mealModal =
            document.getElementById(
                "recipientMealModal"
            );

        const waterModal =
            document.getElementById(
                "recipientWaterModal"
            );

        const moodModal =
            document.getElementById(
                "recipientMoodModal"
            );

        const activityModal =
            document.getElementById(
                "recipientActivityModal"
            );

        const emergencyModal =
            document.getElementById(
                "recipientEmergencyModal"
            );


        /* =================================================
           DATE HELPERS
           ================================================= */

        function todayString() {

            const date =
                new Date();

            const year =
                date.getFullYear();

            const month =
                String(
                    date.getMonth() + 1
                ).padStart(2, "0");

            const day =
                String(
                    date.getDate()
                ).padStart(2, "0");

            return `${year}-${month}-${day}`;
        }


        function currentTimeString() {

            const date =
                new Date();

            return (
                String(
                    date.getHours()
                ).padStart(2, "0") +
                ":" +
                String(
                    date.getMinutes()
                ).padStart(2, "0")
            );
        }


        function formatTime(time) {

            if (!time) {
                return "";
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


            return (
                `${hours}:${minutes} ${period}`
            );
        }


        /* =================================================
           SAFE STORAGE
           ================================================= */

        function readStorage(
            key,
            fallback
        ) {

            try {

                const saved =
                    localStorage.getItem(
                        key
                    );


                if (!saved) {
                    return fallback;
                }


                return JSON.parse(
                    saved
                );

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
                readStorage(
                    key,
                    []
                );


            return Array.isArray(value)
                ? value
                : [];
        }


        function saveArray(
            key,
            array
        ) {

            localStorage.setItem(
                key,
                JSON.stringify(array)
            );
        }


        /* =================================================
           RECIPIENT ACCOUNT
           ================================================= */

        function getRecipientAccount() {

            return readStorage(
                "careCircleRecipientAccount",
                {}
            );
        }


        function getRecipientName() {

            const account =
                getRecipientAccount();


            if (
                account.profile &&
                account.profile.fullName
            ) {

                return account
                    .profile
                    .fullName;
            }


            /*
             * Fallback to caregiver registration
             * data if we're testing both sides
             * in the same browser.
             */

            const registration =
                readStorage(
                    "careCircleRegistration",
                    {}
                );


            return (
                registration.recipient
                    ?.fullName ||
                registration.recipient
                    ?.name ||
                "Care Recipient"
            );
        }


        /* =================================================
           GREETING
           ================================================= */

        function renderGreeting() {

            const name =
                getRecipientName();


            const firstName =
                String(name)
                    .trim()
                    .split(/\s+/)[0];


            greetingName.textContent =
                firstName ||
                "Care Recipient";


            const now =
                new Date();


            const hour =
                now.getHours();


            let greeting;


            if (hour < 12) {

                greeting =
                    "Good Morning";

            } else if (
                hour < 18
            ) {

                greeting =
                    "Good Afternoon";

            } else {

                greeting =
                    "Good Evening";
            }


            const heading =
                greetingName
                    .closest(
                        ".recipient-greeting"
                    )
                    .querySelector("h1");


            heading.innerHTML =
                `${greeting}, <span id="recipientGreetingName"></span>`;


            /*
             * Because innerHTML replaced the
             * original span, set its value again.
             */

            document
                .getElementById(
                    "recipientGreetingName"
                )
                .textContent =
                firstName ||
                "Care Recipient";


            currentDate.textContent =
                now.toLocaleDateString(
                    "en",
                    {
                        weekday:
                            "long",

                        day:
                            "numeric",

                        month:
                            "long",

                        year:
                            "numeric"
                    }
                );
        }


        /* =================================================
           HEALTH HISTORY
           ================================================= */

        function getHealthHistory() {

            return readArray(
                "careCircleHealthHistory"
            );
        }


        function saveHealthEntry(
            entry
        ) {

            const history =
                getHealthHistory();


            history.push({
                id:
                    "health-" +
                    Date.now(),

                ...entry,

                createdAt:
                    new Date()
                        .toISOString()
            });


            saveArray(
                "careCircleHealthHistory",
                history
            );
        }


        /* =================================================
           ACTIVITY LOG
           ================================================= */

        function addActivity(
            title,
            description,
            icon
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

                icon:
                    icon || "•",

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


        /* =================================================
           OPEN / CLOSE MODAL
           ================================================= */

        function openModal(modal) {

            modal.classList.remove(
                "hidden"
            );
        }


        function closeModal(modal) {

            modal.classList.add(
                "hidden"
            );
        }


        /* =================================================
           MEALS
           ================================================= */

        mealsCard.addEventListener(
            "click",
            function () {

                openModal(
                    mealModal
                );
            }
        );


        document
            .getElementById(
                "closeRecipientMealModal"
            )
            .addEventListener(
                "click",
                function () {

                    closeModal(
                        mealModal
                    );
                }
            );


        document
            .getElementById(
                "cancelRecipientMeal"
            )
            .addEventListener(
                "click",
                function () {

                    closeModal(
                        mealModal
                    );
                }
            );


        document
            .getElementById(
                "recipientMealForm"
            )
            .addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    const selected =
                        document.querySelector(
                            'input[name="mealType"]:checked'
                        );


                    if (!selected) {
                        return;
                    }


                    const notes =
                        document
                            .getElementById(
                                "recipientMealNotes"
                            )
                            .value
                            .trim();


                    saveHealthEntry({

                        type:
                            "meal",

                        value:
                            selected.value,

                        description:
                            notes
                                ? `${selected.value} • ${notes}`
                                : selected.value,

                        date:
                            todayString(),

                        time:
                            currentTimeString()

                    });


                    addActivity(
                        "Meal Recorded",
                        selected.value,
                        "🍴"
                    );


                    event.target.reset();


                    closeModal(
                        mealModal
                    );


                    renderDashboard();
                }
            );


        /* =================================================
           WATER
           ================================================= */

        let waterCount = 0;


        waterCard.addEventListener(
            "click",
            function () {

                waterCount = 0;

                updateWaterModal();

                openModal(
                    waterModal
                );
            }
        );


        function updateWaterModal() {

            document
                .getElementById(
                    "recipientWaterCount"
                )
                .textContent =
                waterCount;


            document
                .getElementById(
                    "recipientWaterMillilitres"
                )
                .textContent =
                `${waterCount * 250} ml`;
        }


        document
            .getElementById(
                "increaseRecipientWater"
            )
            .addEventListener(
                "click",
                function () {

                    waterCount++;

                    updateWaterModal();
                }
            );


        document
            .getElementById(
                "decreaseRecipientWater"
            )
            .addEventListener(
                "click",
                function () {

                    waterCount =
                        Math.max(
                            0,
                            waterCount - 1
                        );

                    updateWaterModal();
                }
            );


        document
            .getElementById(
                "saveRecipientWater"
            )
            .addEventListener(
                "click",
                function () {

                    if (
                        waterCount < 1
                    ) {
                        return;
                    }


                    saveHealthEntry({

                        type:
                            "water",

                        value:
                            waterCount,

                        millilitres:
                            waterCount *
                            250,

                        date:
                            todayString(),

                        time:
                            currentTimeString()

                    });


                    addActivity(
                        "Water Recorded",
                        `${waterCount} ${
                            waterCount === 1
                                ? "glass"
                                : "glasses"
                        }`,
                        "▯"
                    );


                    closeModal(
                        waterModal
                    );


                    renderDashboard();
                }
            );


        document
            .getElementById(
                "closeRecipientWaterModal"
            )
            .addEventListener(
                "click",
                function () {

                    closeModal(
                        waterModal
                    );
                }
            );


        /* =================================================
           MOOD
           ================================================= */

        moodCard.addEventListener(
            "click",
            function () {

                openModal(
                    moodModal
                );
            }
        );


        document
            .querySelectorAll(
                ".recipient-mood-option"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const mood =
                                button.dataset
                                    .mood;


                            const icon =
                                button.dataset
                                    .icon;


                            const moods =
                                readArray(
                                    "careCircleMoods"
                                );


                            moods.push({

                                id:
                                    "mood-" +
                                    Date.now(),

                                mood:
                                    mood,

                                icon:
                                    icon,

                                date:
                                    todayString(),

                                time:
                                    currentTimeString()

                            });


                            saveArray(
                                "careCircleMoods",
                                moods
                            );


                            addActivity(
                                "Mood Check-In",
                                `Feeling ${mood}`,
                                icon
                            );


                            closeModal(
                                moodModal
                            );


                            renderDashboard();
                        }
                    );
                }
            );


        document
            .getElementById(
                "closeRecipientMoodModal"
            )
            .addEventListener(
                "click",
                function () {

                    closeModal(
                        moodModal
                    );
                }
            );


        /* =================================================
           ACTIVITY
           ================================================= */

        activityCard.addEventListener(
            "click",
            function () {

                openModal(
                    activityModal
                );
            }
        );


        document
            .getElementById(
                "recipientActivityForm"
            )
            .addEventListener(
                "submit",
                function (event) {

                    event.preventDefault();


                    const description =
                        document
                            .getElementById(
                                "recipientActivityDescription"
                            )
                            .value
                            .trim();


                    const minutes =
                        Number(
                            document
                                .getElementById(
                                    "recipientActivityMinutes"
                                )
                                .value
                        );


                    if (
                        !description ||
                        minutes < 1
                    ) {
                        return;
                    }


                    saveHealthEntry({

                        type:
                            "activity",

                        value:
                            minutes,

                        description:
                            description,

                        date:
                            todayString(),

                        time:
                            currentTimeString()

                    });


                    addActivity(
                        "Activity Recorded",
                        `${description} • ${minutes} min`,
                        "◇"
                    );


                    event.target.reset();


                    closeModal(
                        activityModal
                    );


                    renderDashboard();
                }
            );


        document
            .getElementById(
                "closeRecipientActivityModal"
            )
            .addEventListener(
                "click",
                function () {

                    closeModal(
                        activityModal
                    );
                }
            );


        document
            .getElementById(
                "cancelRecipientActivity"
            )
            .addEventListener(
                "click",
                function () {

                    closeModal(
                        activityModal
                    );
                }
            );


        /* =================================================
           MEDICATION
           ================================================= */

        medicationCard.addEventListener(
            "click",
            function () {

                window.location.href =
                    "medications.html";
            }
        );


        /* =================================================
           CALENDAR
           ================================================= */

        calendarCard.addEventListener(
            "click",
            function () {

                window.location.href =
                    "events.html";
            }
        );


        /* =================================================
           EMERGENCY CONTACT
           ================================================= */

        const emergencyButton =
            document.getElementById(
                "recipientEmergencyButton"
            );


        emergencyButton.addEventListener(
            "click",
            function () {

                renderEmergencyContact();

                openModal(
                    emergencyModal
                );
            }
        );


        document
            .getElementById(
                "closeRecipientEmergencyModal"
            )
            .addEventListener(
                "click",
                function () {

                    closeModal(
                        emergencyModal
                    );
                }
            );


        function getCaregiver() {

            const registration =
                readStorage(
                    "careCircleRegistration",
                    {}
                );


            return (
                registration.caregiver ||
                {}
            );
        }


        function renderEmergencyContact() {

            const caregiver =
                getCaregiver();


            const name =
                caregiver.fullName ||
                caregiver.name ||
                "Caregiver";


            const phone =
                caregiver.phone ||
                "No phone number saved";


            document
                .getElementById(
                    "recipientEmergencyContact"
                )
                .innerHTML = `

                    <strong>
                        ${escapeHTML(name)}
                    </strong>

                    <span>
                        ${escapeHTML(phone)}
                    </span>

                `;
        }


        document
            .getElementById(
                "recipientCallEmergencyContact"
            )
            .addEventListener(
                "click",
                function () {

                    const caregiver =
                        getCaregiver();


                    if (!caregiver.phone) {

                        alert(
                            "No caregiver phone number has been saved yet."
                        );

                        return;
                    }


                    /*
                     * Opens the device's phone handler
                     * where supported.
                     */

                    window.location.href =
                        `tel:${encodeURIComponent(
                            caregiver.phone
                        )}`;
                }
            );


        /* =================================================
           PROFILE
           ================================================= */

/* =========================================================
   ACCOUNT MENU
   ========================================================= */

const recipientProfileButton =
    document.getElementById(
        "recipientProfileButton"
    );

const recipientAccountMenu =
    document.getElementById(
        "recipientAccountMenu"
    );

const recipientSignOutButton =
    document.getElementById(
        "recipientSignOutButton"
    );


recipientProfileButton.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();

        recipientAccountMenu.classList.toggle(
            "hidden"
        );
    }
);


recipientSignOutButton.addEventListener(
    "click",
    function () {

        signOutCareCircle();
    }
);


document.addEventListener(
    "click",
    function (event) {

        if (
            !recipientAccountMenu.contains(
                event.target
            ) &&
            !recipientProfileButton.contains(
                event.target
            )
        ) {

            recipientAccountMenu.classList.add(
                "hidden"
            );
        }
    }
);
        /* =================================================
           FAMILY MESSAGE
           ================================================= */

        document
            .getElementById(
                "recipientMessageButton"
            )
            .addEventListener(
                "click",
                function () {

                    window.location.href =
                        "mycare.html#family";
                }
            );


        /* =================================================
           NOTIFICATIONS
           ================================================= */

        document
            .getElementById(
                "recipientNotificationButton"
            )
            .addEventListener(
                "click",
                function () {

                    const tasks =
                        readArray(
                            "careCircleTasks"
                        );


                    const pending =
                        tasks.filter(
                            function (task) {

                                return (
                                    String(
                                        task.status ||
                                        ""
                                    ).toLowerCase() ===
                                    "pending"
                                );
                            }
                        );


                    if (
                        pending.length === 0
                    ) {

                        alert(
                            "You have no pending care reminders."
                        );

                    } else {

                        alert(
                            `You have ${pending.length} pending care reminder${
                                pending.length === 1
                                    ? ""
                                    : "s"
                            }.`
                        );
                    }
                }
            );


        /* =================================================
           RENDER DASHBOARD
           ================================================= */

        function renderDashboard() {

            const today =
                todayString();


            const health =
                getHealthHistory();


            /* ---------------------------------------------
               MEALS
               --------------------------------------------- */

            const meals =
                health.filter(
                    entry =>
                        entry.type ===
                            "meal" &&
                        entry.date ===
                            today
                );


            mealsSummary.textContent =
                meals.length === 0
                    ? "Add a meal"
                    : `${meals.length} ${
                        meals.length === 1
                            ? "meal"
                            : "meals"
                    } today`;


            /* ---------------------------------------------
               WATER
               --------------------------------------------- */

            const water =
                health
                    .filter(
                        entry =>
                            entry.type ===
                                "water" &&
                            entry.date ===
                                today
                    )
                    .reduce(
                        function (
                            total,
                            entry
                        ) {

                            return (
                                total +
                                Number(
                                    entry.value ||
                                    0
                                )
                            );
                        },
                        0
                    );


            waterSummary.textContent =
                `${water} ${
                    water === 1
                        ? "glass"
                        : "glasses"
                }`;


            /* ---------------------------------------------
               ACTIVITY
               --------------------------------------------- */

            const activityMinutes =
                health
                    .filter(
                        entry =>
                            entry.type ===
                                "activity" &&
                            entry.date ===
                                today
                    )
                    .reduce(
                        function (
                            total,
                            entry
                        ) {

                            return (
                                total +
                                Number(
                                    entry.value ||
                                    0
                                )
                            );
                        },
                        0
                    );


            activitySummary.textContent =
                activityMinutes > 0
                    ? `${activityMinutes} min today`
                    : "No activity yet";


            /* ---------------------------------------------
               MOOD
               --------------------------------------------- */

            const moods =
                readArray(
                    "careCircleMoods"
                )
                    .filter(
                        mood =>
                            mood.date ===
                            today
                    );


            const latestMood =
                moods[
                    moods.length - 1
                ];


            if (latestMood) {

                moodSummary.textContent =
                    latestMood.mood;


                moodIcon.textContent =
                    latestMood.icon;

            } else {

                moodSummary.textContent =
                    "Check in today";


                moodIcon.textContent =
                    "☺";
            }


            renderCalendarSummary();

            renderMedicationSummary();
        }


        /* =================================================
           CALENDAR SUMMARY
           ================================================= */

        function renderCalendarSummary() {

            const events =
                readArray(
                    "careCircleEvents"
                );


            const now =
                new Date();


            const upcoming =
                events
                    .filter(
                        function (event) {

                            if (!event.date) {
                                return false;
                            }


                            const eventDate =
                                new Date(
                                    `${event.date}T${
                                        event.time ||
                                        "23:59"
                                    }`
                                );


                            return (
                                eventDate >=
                                now
                            );
                        }
                    )
                    .sort(
                        function (a, b) {

                            return (
                                `${a.date} ${
                                    a.time || ""
                                }`
                            ).localeCompare(
                                `${b.date} ${
                                    b.time || ""
                                }`
                            );
                        }
                    );


            if (
                upcoming.length === 0
            ) {

                calendarSummary.textContent =
                    "No upcoming events";

                return;
            }


            const next =
                upcoming[0];


            calendarSummary.textContent =
                next.time
                    ? `${next.title} • ${formatTime(
                        next.time
                    )}`
                    : next.title;
        }


        /* =================================================
           MEDICATION SUMMARY
           ================================================= */

        function renderMedicationSummary() {

            /*
             * The existing medication page may still use
             * prototype-era storage, so support a few
             * common structures without breaking the page.
             */

            const medications =
                readArray(
                    "careCircleMedications"
                );


            if (
                medications.length === 0
            ) {

                medicationSummary.textContent =
                    "View medications";

                return;
            }


            const pending =
                medications.find(
                    function (medication) {

                        return (
                            String(
                                medication.status ||
                                "pending"
                            ).toLowerCase() ===
                            "pending"
                        );
                    }
                );


            const medication =
                pending ||
                medications[0];


            medicationSummary.textContent =
                medication.name ||
                medication.medicationName ||
                "Medication scheduled";
        }


        /* =================================================
           ESCAPE HTML
           ================================================= */

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


        /* =================================================
           INITIALIZE
           ================================================= */

        renderGreeting();

        renderDashboard();

    }
);