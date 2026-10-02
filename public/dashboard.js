/* =========================================================
   CARECIRCLE
   CAREGIVER DASHBOARD
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =========================================================
   CAREGIVER ACCESS CHECK
   ========================================================= */

const currentUser = JSON.parse(
    localStorage.getItem("careCircleCurrentUser") ||
    "{}"
);

if (
    currentUser.role &&
    currentUser.role !== "caregiver"
) {

    window.location.href =
        "recipient-dashboard.html";

    return;
}
    /* =====================================================
       ELEMENTS
       ===================================================== */

    const menuButton =
        document.getElementById("menuButton");

    const closeMenuButton =
        document.getElementById("closeMenuButton");

    const sideMenu =
        document.getElementById("sideMenu");

    const menuOverlay =
        document.getElementById("menuOverlay");


    const quickAddButton =
        document.getElementById("quickAddButton");

    const bottomQuickAdd =
        document.getElementById("bottomQuickAdd");

    const quickAddModal =
        document.getElementById("quickAddModal");

    const closeQuickAdd =
        document.getElementById("closeQuickAdd");


    const recipientFirstName =
        document.getElementById("recipientFirstName");


    /* =====================================================
       LOAD REGISTRATION INFORMATION
       ===================================================== */

    function loadRegistration() {

        const savedRegistration =
            localStorage.getItem(
                "careCircleRegistration"
            );


        if (!savedRegistration) {
            return;
        }


        try {

            const registration =
                JSON.parse(savedRegistration);


            if (
                registration.recipient &&
                registration.recipient.fullName
            ) {

                const fullName =
                    registration.recipient.fullName.trim();

                /*
                 * Dashboard design uses the person's
                 * first name, e.g. "Janice".
                 */

                const firstName =
                    fullName.split(" ")[0];


                recipientFirstName.textContent =
                    firstName;

            }

        } catch (error) {

            console.error(
                "Unable to load CareCircle registration:",
                error
            );

        }

    }


    /* =====================================================
       SIDE MENU
       ===================================================== */

    function openMenu() {

        sideMenu.classList.add("open");

        menuOverlay.classList.add("visible");

        sideMenu.setAttribute(
            "aria-hidden",
            "false"
        );

    }


    function closeMenu() {

        sideMenu.classList.remove("open");

        menuOverlay.classList.remove("visible");

        sideMenu.setAttribute(
            "aria-hidden",
            "true"
        );

    }

    
    menuButton.addEventListener(
        "click",
        openMenu
    );


    closeMenuButton.addEventListener(
        "click",
        closeMenu
    );


    menuOverlay.addEventListener(
        "click",
        closeMenu
    );

    /* =========================================================
   SIGN OUT
   ========================================================= */

const caregiverSignOutButton =
    document.getElementById(
        "caregiverSignOutButton"
    );


if (caregiverSignOutButton) {

    caregiverSignOutButton.addEventListener(
        "click",
        function () {

            signOutCareCircle();
        }
    );
}
    /* =====================================================
       QUICK ADD MODAL
       ===================================================== */

    function openQuickAdd() {

        quickAddModal.classList.remove("hidden");

        document.body.style.overflow =
            "hidden";

    }


    function closeQuickAddModal() {

        quickAddModal.classList.add("hidden");

        document.body.style.overflow =
            "";

    }


    quickAddButton.addEventListener(
        "click",
        openQuickAdd
    );


    bottomQuickAdd.addEventListener(
        "click",
        openQuickAdd
    );


    closeQuickAdd.addEventListener(
        "click",
        closeQuickAddModal
    );


    /*
     * Close modal if user clicks
     * outside the modal itself.
     */

    quickAddModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                quickAddModal
            ) {

                closeQuickAddModal();

            }

        }
    );


    /* =====================================================
       ESCAPE KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Escape") {

                closeMenu();

                closeQuickAddModal();

            }

        }
    );


    /* =====================================================
       QUICK ADD ACTIONS
       ===================================================== */

    const quickActions =
        document.querySelectorAll(
            ".quick-action-card"
        );


    quickActions.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const action =
                        button.dataset.action;


                    switch (action) {

                        case "medication":

                            window.location.href =
                                "medications.html";

                            break;


                        case "task":

                            window.location.href =
                                "todo.html?action=new";

                            break;


                        case "event":

                            window.location.href =
                                "events.html?action=new";

                            break;


                        case "vitals":

                            /*
                             * We haven't built the
                             * health-entry modal yet.
                             *
                             * For now this opens Reports.
                             */

                            window.location.href =
                                "reports.html?action=vitals";

                            break;


                        case "meal":

                            addMeal();

                            break;


                        case "note":

                            addQuickNote();

                            break;

                    }

                }
            );

        }
    );


    /* =====================================================
       HEALTH DATA
       ===================================================== */

    function getHealthData() {

        const saved =
            localStorage.getItem(
                "careCircleHealth"
            );


        if (!saved) {

            return {
                bloodPressure: null,
                bloodSugar: null,
                meals: 0,
                water: 0,
                activity: 0,
                sleep: null
            };

        }


        try {

            return JSON.parse(saved);

        } catch (error) {

            console.error(
                "Unable to load health data:",
                error
            );


            return {
                bloodPressure: null,
                bloodSugar: null,
                meals: 0,
                water: 0,
                activity: 0,
                sleep: null
            };

        }

    }


    function saveHealthData(data) {

        localStorage.setItem(
            "careCircleHealth",
            JSON.stringify(data)
        );

    }


    /* =====================================================
       DISPLAY HEALTH DATA
       ===================================================== */

    function renderHealthData() {

        const health =
            getHealthData();


        const bloodPressureValue =
            document.getElementById(
                "bloodPressureValue"
            );

        const bloodSugarValue =
            document.getElementById(
                "bloodSugarValue"
            );

        const mealValue =
            document.getElementById(
                "mealValue"
            );

        const waterValue =
            document.getElementById(
                "waterValue"
            );

        const activityValue =
            document.getElementById(
                "activityValue"
            );

        const sleepValue =
            document.getElementById(
                "sleepValue"
            );


        bloodPressureValue.textContent =
            health.bloodPressure || "--";


        bloodSugarValue.textContent =
            health.bloodSugar || "--";


        mealValue.textContent =
            health.meals || 0;


        waterValue.textContent =
            health.water || 0;


        activityValue.textContent =
            health.activity || 0;


        sleepValue.textContent =
            health.sleep || "--";


        updateHealthBadges(health);

    }


    /* =====================================================
       HEALTH BADGES

       For now we only indicate whether a reading
       has been recorded.

       We are deliberately NOT diagnosing readings.
       ===================================================== */

    function updateHealthBadges(health) {

        const bpStatus =
            document.getElementById(
                "bpStatus"
            );

        const glucoseStatus =
            document.getElementById(
                "glucoseStatus"
            );


        if (health.bloodPressure) {

            bpStatus.textContent =
                "Recorded";

            bpStatus.className =
                "health-badge normal";

        } else {

            bpStatus.textContent =
                "No data";

            bpStatus.className =
                "health-badge neutral";

        }


        if (health.bloodSugar) {

            glucoseStatus.textContent =
                "Recorded";

            glucoseStatus.className =
                "health-badge normal";

        } else {

            glucoseStatus.textContent =
                "No data";

            glucoseStatus.className =
                "health-badge neutral";

        }

    }


    /* =====================================================
       ADD MEAL
       ===================================================== */

    function addMeal() {

        const health =
            getHealthData();


        health.meals =
            Number(health.meals || 0) + 1;


        saveHealthData(health);


        addActivity(
            "Meal recorded",
            "A meal was added to today's health record.",
            "◉"
        );


        renderHealthData();

        renderActivities();

        closeQuickAddModal();

    }


    /* =====================================================
       ACTIVITIES
       ===================================================== */

    function getActivities() {

        const saved =
            localStorage.getItem(
                "careCircleActivities"
            );


        if (!saved) {
            return [];
        }


        try {

            return JSON.parse(saved);

        } catch (error) {

            console.error(
                "Unable to load activities:",
                error
            );

            return [];

        }

    }


    function saveActivities(activities) {

        localStorage.setItem(
            "careCircleActivities",
            JSON.stringify(activities)
        );

    }


    function addActivity(
        title,
        description,
        icon
    ) {

        const activities =
            getActivities();


        const activity = {

            id: Date.now(),

            title: title,

            description: description,

            icon: icon,

            createdAt:
                new Date().toISOString()

        };


        activities.unshift(activity);


        /*
         * Keep the local prototype reasonably small.
         */

        if (activities.length > 50) {
            activities.length = 50;
        }


        saveActivities(activities);

    }


    /* =====================================================
       QUICK NOTE
       ===================================================== */

    function addQuickNote() {

        const note =
            window.prompt(
                "Enter your CareCircle note:"
            );


        if (
            note === null ||
            note.trim() === ""
        ) {
            return;
        }


        addActivity(
            "Quick note added",
            note.trim(),
            "✎"
        );


        renderActivities();

        closeQuickAddModal();

    }


    /* =====================================================
       RENDER RECENT ACTIVITIES
       ===================================================== */

    function renderActivities() {

        const container =
            document.getElementById(
                "recentActivities"
            );


        const activities =
            getActivities();


        if (activities.length === 0) {

            container.innerHTML = `

                <div class="empty-dashboard-state">

                    <span class="empty-icon">
                        ≡
                    </span>

                    <p>
                        No recent activities yet.
                    </p>

                </div>

            `;

            return;

        }


        const recent =
            activities.slice(0, 5);


        container.innerHTML =
            recent
                .map(
                    function (activity) {

                        return `

                            <article class="activity-item">

                                <div class="activity-icon">
                                    ${escapeHTML(
                                        activity.icon || "✓"
                                    )}
                                </div>

                                <div class="activity-content">

                                    <h3>
                                        ${escapeHTML(
                                            activity.title
                                        )}
                                    </h3>

                                    <p>
                                        ${escapeHTML(
                                            activity.description
                                        )}
                                    </p>

                                    <p>
                                        ${formatActivityTime(
                                            activity.createdAt
                                        )}
                                    </p>

                                </div>

                            </article>

                        `;

                    }
                )
                .join("");

    }


    /* =====================================================
       EVENTS
       ===================================================== */

    function getEvents() {

        const saved =
            localStorage.getItem(
                "careCircleEvents"
            );


        if (!saved) {
            return [];
        }


        try {

            return JSON.parse(saved);

        } catch (error) {

            console.error(
                "Unable to load events:",
                error
            );

            return [];

        }

    }


    /* =====================================================
       UPCOMING EVENTS
       ===================================================== */

    function renderUpcomingEvents() {

        const container =
            document.getElementById(
                "upcomingEvents"
            );


        const events =
            getEvents();


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
                                event.date +
                                "T" +
                                (
                                    event.time ||
                                    "23:59"
                                )
                            );


                        return eventDate >= now;

                    }
                )
                .sort(
                    function (a, b) {

                        const first =
                            new Date(
                                a.date +
                                "T" +
                                (
                                    a.time ||
                                    "00:00"
                                )
                            );


                        const second =
                            new Date(
                                b.date +
                                "T" +
                                (
                                    b.time ||
                                    "00:00"
                                )
                            );


                        return first - second;

                    }
                )
                .slice(0, 3);


        if (upcoming.length === 0) {

            container.innerHTML = `

                <div class="empty-dashboard-state">

                    <span class="empty-icon">
                        ◷
                    </span>

                    <p>
                        No upcoming events.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML =
            upcoming
                .map(
                    function (event) {

                        const date =
                            new Date(
                                event.date +
                                "T00:00:00"
                            );


                        const month =
                            date.toLocaleString(
                                "en",
                                {
                                    month: "short"
                                }
                            );


                        const day =
                            date.getDate();


                        return `

                            <article class="dashboard-event">

                                <div class="event-date-box">

                                    <span class="event-date-month">
                                        ${escapeHTML(month)}
                                    </span>

                                    <span class="event-date-day">
                                        ${day}
                                    </span>

                                </div>


                                <div class="event-info">

                                    <h3>
                                        ${escapeHTML(
                                            event.title ||
                                            "Event"
                                        )}
                                    </h3>

                                    <p>
                                        ${escapeHTML(
                                            formatTime(
                                                event.time
                                            )
                                        )}
                                    </p>

                                    ${
                                        event.location
                                            ? `
                                                <p>
                                                    ${escapeHTML(
                                                        event.location
                                                    )}
                                                </p>
                                              `
                                            : ""
                                    }

                                </div>

                            </article>

                        `;

                    }
                )
                .join("");

    }


    /* =====================================================
       ATTENTION ITEMS
       ===================================================== */

    function getAttentionItems() {

        const saved =
            localStorage.getItem(
                "careCircleAttention"
            );


        if (!saved) {
            return [];
        }


        try {

            return JSON.parse(saved);

        } catch (error) {

            console.error(
                "Unable to load attention items:",
                error
            );

            return [];

        }

    }


    function renderAttention() {

        const container =
            document.getElementById(
                "attentionList"
            );


        const count =
            document.getElementById(
                "attentionCount"
            );


        const items =
            getAttentionItems();


        count.textContent =
            items.length;


        if (items.length === 0) {

            container.innerHTML = `

                <div class="empty-dashboard-state">

                    <span class="empty-icon">
                        ✓
                    </span>

                    <p>
                        Nothing requires attention right now.
                    </p>

                </div>

            `;

            return;

        }


        container.innerHTML =
            items
                .slice(0, 4)
                .map(
                    function (item) {

                        return `

                            <article
                                class="attention-item
                                ${
                                    item.urgent
                                        ? "urgent"
                                        : ""
                                }"
                            >

                                <div class="attention-icon">
                                    !
                                </div>

                                <div class="attention-content">

                                    <div class="attention-title">
                                        ${escapeHTML(
                                            item.title ||
                                            "Attention Required"
                                        )}
                                    </div>

                                    <div class="attention-description">
                                        ${escapeHTML(
                                            item.description ||
                                            ""
                                        )}
                                    </div>

                                </div>

                            </article>

                        `;

                    }
                )
                .join("");

    }


    /* =====================================================
       VIEW PROFILE
       ===================================================== */

    const viewRecipientProfile =
        document.getElementById(
            "viewRecipientProfile"
        );


    viewRecipientProfile.addEventListener(
        "click",
        function () {

            /*
             * We will build this page later.
             */

            window.location.href =
                "patient-setup.html";

        }
    );


    /* =====================================================
       RECORD VITALS
       ===================================================== */

    const recordVitalsButton =
        document.getElementById(
            "recordVitalsButton"
        );


/* =========================================================
   HEALTH MONITORING
   ========================================================= */

const healthModal =
    document.getElementById("healthModal");

const healthForm =
    document.getElementById("healthForm");

const closeHealthModal =
    document.getElementById("closeHealthModal");

const cancelHealthButton =
    document.getElementById("cancelHealthButton");

const healthTabs =
    document.querySelectorAll(".health-entry-tab");


/* =========================================================
   OPEN HEALTH MODAL
   ========================================================= */

function openHealthModal(
    startingType = "bloodPressure"
) {

    healthForm.reset();

    setHealthType(startingType);

    setCurrentHealthDateTime();

    healthModal.classList.remove(
        "hidden"
    );

    document.body.style.overflow =
        "hidden";

}


/* =========================================================
   CLOSE HEALTH MODAL
   ========================================================= */

function closeHealthEntryModal() {

    healthModal.classList.add(
        "hidden"
    );

    document.body.style.overflow =
        "";

}


/* =========================================================
   HEALTH TYPE
   ========================================================= */

function setHealthType(type) {

    document
        .getElementById("healthType")
        .value = type;


    const sections = {

        bloodPressure:
            "bloodPressureFields",

        bloodSugar:
            "bloodSugarFields",

        water:
            "waterFields",

        activity:
            "activityFields",

        sleep:
            "sleepFields"

    };


    document
        .querySelectorAll(
            ".health-form-section"
        )
        .forEach(
            function (section) {

                section.classList.add(
                    "hidden"
                );

            }
        );


    if (sections[type]) {

        document
            .getElementById(
                sections[type]
            )
            .classList.remove(
                "hidden"
            );

    }


    healthTabs.forEach(
        function (tab) {

            tab.classList.toggle(
                "active",
                tab.dataset.healthType ===
                    type
            );

        }
    );

}


/* =========================================================
   TAB BUTTONS
   ========================================================= */

healthTabs.forEach(
    function (tab) {

        tab.addEventListener(
            "click",
            function () {

                setHealthType(
                    tab.dataset.healthType
                );

            }
        );

    }
);


/* =========================================================
   CURRENT DATE / TIME
   ========================================================= */

function setCurrentHealthDateTime() {

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

    const hours =
        String(
            now.getHours()
        ).padStart(2, "0");

    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");


    document
        .getElementById(
            "healthDate"
        )
        .value =
            `${year}-${month}-${day}`;


    document
        .getElementById(
            "healthTime"
        )
        .value =
            `${hours}:${minutes}`;

}


/* =========================================================
   HEALTH HISTORY

   Unlike the dashboard summary, this stores every reading.
   Reports will use this later.
   ========================================================= */

function getHealthHistory() {

    const saved =
        localStorage.getItem(
            "careCircleHealthHistory"
        );


    if (!saved) {
        return [];
    }


    try {

        const history =
            JSON.parse(saved);


        return Array.isArray(history)
            ? history
            : [];

    } catch (error) {

        return [];

    }

}


function saveHealthHistory(history) {

    localStorage.setItem(
        "careCircleHealthHistory",
        JSON.stringify(history)
    );

}


/* =========================================================
   SAVE HEALTH ENTRY
   ========================================================= */

healthForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        const type =
            document
                .getElementById(
                    "healthType"
                )
                .value;


        const date =
            document
                .getElementById(
                    "healthDate"
                )
                .value;


        const time =
            document
                .getElementById(
                    "healthTime"
                )
                .value;


        const notes =
            document
                .getElementById(
                    "healthNotes"
                )
                .value
                .trim();


        let health =
            getHealthData();


        const history =
            getHealthHistory();


        let entry = {

            id:
                Date.now(),

            type:
                type,

            date:
                date,

            time:
                time,

            notes:
                notes,

            createdAt:
                new Date()
                    .toISOString()

        };


        /* =============================================
           BLOOD PRESSURE
           ============================================= */

        if (
            type ===
            "bloodPressure"
        ) {

            const systolic =
                Number(
                    document
                        .getElementById(
                            "systolicValue"
                        )
                        .value
                );


            const diastolic =
                Number(
                    document
                        .getElementById(
                            "diastolicValue"
                        )
                        .value
                );


            if (
                !systolic ||
                !diastolic
            ) {

                alert(
                    "Please enter both systolic and diastolic values."
                );

                return;

            }


            entry.systolic =
                systolic;

            entry.diastolic =
                diastolic;


            health.bloodPressure =
                `${systolic}/${diastolic}`;


            addActivity(
                "Blood pressure recorded",
                `${systolic}/${diastolic} mmHg`,
                "♥"
            );

        }


        /* =============================================
           BLOOD SUGAR
           ============================================= */

        if (
            type ===
            "bloodSugar"
        ) {

            const reading =
                Number(
                    document
                        .getElementById(
                            "bloodSugarReading"
                        )
                        .value
                );


            if (!reading) {

                alert(
                    "Please enter a blood sugar reading."
                );

                return;

            }


            const context =
                document
                    .getElementById(
                        "glucoseContext"
                    )
                    .value;


            entry.value =
                reading;

            entry.context =
                context;


            health.bloodSugar =
                reading;


            addActivity(
                "Blood sugar recorded",
                `${reading} mg/dL • ${context}`,
                "+"
            );

        }


        /* =============================================
           WATER
           ============================================= */

        if (
            type ===
            "water"
        ) {

            const glasses =
                Number(
                    document
                        .getElementById(
                            "waterGlasses"
                        )
                        .value
                );


            if (
                !glasses ||
                glasses < 1
            ) {

                alert(
                    "Please enter the number of glasses."
                );

                return;

            }


            entry.value =
                glasses;


            const currentWater =
                Number(
                    health.water || 0
                );


            health.water =
                currentWater +
                glasses;


            addActivity(
                "Water recorded",
                `${glasses} ${
                    glasses === 1
                        ? "glass"
                        : "glasses"
                } added`,
                "◉"
            );

        }


        /* =============================================
           ACTIVITY
           ============================================= */

        if (
            type ===
            "activity"
        ) {

            const minutes =
                Number(
                    document
                        .getElementById(
                            "activityMinutes"
                        )
                        .value
                );


            const description =
                document
                    .getElementById(
                        "activityDescription"
                    )
                    .value
                    .trim();


            if (
                !minutes ||
                minutes < 1
            ) {

                alert(
                    "Please enter the activity duration."
                );

                return;

            }


            entry.value =
                minutes;

            entry.description =
                description;


            const currentActivity =
                Number(
                    health.activity || 0
                );


            health.activity =
                currentActivity +
                minutes;


            addActivity(
                "Activity recorded",
                `${minutes} minutes${
                    description
                        ? " • " +
                          description
                        : ""
                }`,
                "↗"
            );

        }


        /* =============================================
           SLEEP
           ============================================= */

        if (
            type ===
            "sleep"
        ) {

            const hours =
                Number(
                    document
                        .getElementById(
                            "sleepHours"
                        )
                        .value
                );


            if (
                Number.isNaN(hours) ||
                hours < 0 ||
                hours > 24
            ) {

                alert(
                    "Please enter valid sleep hours."
                );

                return;

            }


            entry.value =
                hours;


            health.sleep =
                hours;


            addActivity(
                "Sleep recorded",
                `${hours} hours`,
                "☾"
            );

        }


        /* =============================================
           SAVE BOTH SUMMARY + HISTORY
           ============================================= */

        history.push(
            entry
        );


        saveHealthHistory(
            history
        );


        saveHealthData(
            health
        );


        renderHealthData();

        renderActivities();

        closeHealthEntryModal();

    }
);


/* =========================================================
   CLOSE BUTTONS
   ========================================================= */

closeHealthModal.addEventListener(
    "click",
    closeHealthEntryModal
);


cancelHealthButton.addEventListener(
    "click",
    closeHealthEntryModal
);


healthModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            healthModal
        ) {

            closeHealthEntryModal();

        }

    }
);


/* =========================================================
   RECORD VITALS BUTTON

   Replace the previous reports.html redirect.
   ========================================================= */

if (recordVitalsButton) {

    recordVitalsButton.addEventListener(
        "click",
        function () {

            openHealthModal(
                "bloodPressure"
            );

        }
    );

}


    /* =====================================================
       ADD USER
       ===================================================== */

    const addUserButton =
        document.getElementById(
            "addUserButton"
        );


    addUserButton.addEventListener(
        "click",
        function () {

            /*
             * For now this returns to registration.
             * Later we'll build a dedicated Add Member flow.
             */

            window.location.href =
                "caregiver-register.html";

        }
    );


    /* =====================================================
       VIEW ALL ACTIVITIES
       ===================================================== */

    const viewAllActivities =
        document.getElementById(
            "viewAllActivities"
        );


    viewAllActivities.addEventListener(
        "click",
        function () {

            alert(
                "The full CareCircle activity history " +
                "will be added in a later step."
            );

        }
    );


    /* =====================================================
       FORMAT TIME
       ===================================================== */

    function formatTime(time) {

        if (!time) {
            return "Time not specified";
        }


        const parts =
            time.split(":");


        if (parts.length < 2) {
            return time;
        }


        let hours =
            Number(parts[0]);

        const minutes =
            parts[1];


        const period =
            hours >= 12
                ? "PM"
                : "AM";


        hours =
            hours % 12;


        if (hours === 0) {
            hours = 12;
        }


        return (
            hours +
            ":" +
            minutes +
            " " +
            period
        );

    }


    /* =====================================================
       ACTIVITY TIME
       ===================================================== */

    function formatActivityTime(dateString) {

        if (!dateString) {
            return "";
        }


        const date =
            new Date(dateString);


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "";
        }


        return date.toLocaleString(
            "en",
            {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit"
            }
        );

    }


    /* =====================================================
       HTML ESCAPING
       ===================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }

    /* =========================================================
   URL ACTIONS
   ========================================================= */

const dashboardParameters =
    new URLSearchParams(
        window.location.search
    );


if (
    dashboardParameters.get("action") ===
    "vitals"
) {

    openHealthModal(
        "bloodPressure"
    );

}

    /* =====================================================
       INITIALIZE DASHBOARD
       ===================================================== */

    loadRegistration();

    renderHealthData();

    renderAttention();

    renderUpcomingEvents();

    renderActivities();

});