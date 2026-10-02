/* =========================================================
   CARECIRCLE - MYCARE
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

        const bloodPressureValue =
            document.getElementById(
                "myCareBloodPressure"
            );

        const bloodPressureTime =
            document.getElementById(
                "myCareBloodPressureTime"
            );

        const bloodSugarValue =
            document.getElementById(
                "myCareBloodSugar"
            );

        const bloodSugarTime =
            document.getElementById(
                "myCareBloodSugarTime"
            );

        const sleepValue =
            document.getElementById(
                "myCareSleep"
            );

        const sleepTime =
            document.getElementById(
                "myCareSleepTime"
            );


        const healthModal =
            document.getElementById(
                "myCareHealthModal"
            );

        const healthForm =
            document.getElementById(
                "myCareHealthForm"
            );

        const healthType =
            document.getElementById(
                "myCareHealthType"
            );


        const messageModal =
            document.getElementById(
                "familyMessageModal"
            );

        const messageForm =
            document.getElementById(
                "familyMessageForm"
            );


        /* =================================================
           STORAGE HELPERS
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


                if (!value) {
                    return fallback;
                }


                return JSON.parse(value);

            } catch (error) {

                console.error(
                    `Could not read ${key}`,
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
            value
        ) {

            localStorage.setItem(
                key,
                JSON.stringify(value)
            );
        }


        /* =================================================
           DATE HELPERS
           ================================================= */

        function todayString() {

            const now =
                new Date();


            const year =
                now.getFullYear();


            const month =
                String(
                    now.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                );


            const day =
                String(
                    now.getDate()
                ).padStart(
                    2,
                    "0"
                );


            return (
                `${year}-${month}-${day}`
            );
        }


        function timeString() {

            const now =
                new Date();


            return (
                String(
                    now.getHours()
                ).padStart(
                    2,
                    "0"
                ) +
                ":" +
                String(
                    now.getMinutes()
                ).padStart(
                    2,
                    "0"
                )
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
           HEALTH HISTORY
           ================================================= */

        function getHealthHistory() {

            return readArray(
                "careCircleHealthHistory"
            );
        }


        function saveHealthHistory(
            history
        ) {

            saveArray(
                "careCircleHealthHistory",
                history
            );
        }


        function addHealthEntry(
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


            saveHealthHistory(
                history
            );
        }


        /* =================================================
           ACTIVITY LOG
           ================================================= */

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
                    timeString(),

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
           GET LATEST HEALTH READING
           ================================================= */

        function latestReading(type) {

            const history =
                getHealthHistory()
                    .filter(
                        entry =>
                            entry.type ===
                            type
                    );


            if (
                history.length === 0
            ) {
                return null;
            }


            history.sort(
                function (a, b) {

                    const aDate =
                        new Date(
                            a.createdAt ||
                            `${a.date}T${
                                a.time ||
                                "00:00"
                            }`
                        );


                    const bDate =
                        new Date(
                            b.createdAt ||
                            `${b.date}T${
                                b.time ||
                                "00:00"
                            }`
                        );


                    return bDate - aDate;
                }
            );


            return history[0];
        }


        /* =================================================
           RENDER HEALTH
           ================================================= */

        function renderHealth() {

            const bloodPressure =
                latestReading(
                    "bloodPressure"
                );


            if (bloodPressure) {

                bloodPressureValue.textContent =
                    `${bloodPressure.systolic}/${bloodPressure.diastolic}`;


                bloodPressureTime.textContent =
                    bloodPressure.time
                        ? `Recorded ${formatTime(
                            bloodPressure.time
                        )}`
                        : "Latest reading";

            } else {

                bloodPressureValue.textContent =
                    "--/--";


                bloodPressureTime.textContent =
                    "No reading yet";
            }


            const bloodSugar =
                latestReading(
                    "bloodSugar"
                );


            if (bloodSugar) {

                bloodSugarValue.textContent =
                    `${bloodSugar.value} mg/dL`;


                bloodSugarTime.textContent =
                    bloodSugar.context &&
                    bloodSugar.context !==
                        "Not specified"
                        ? bloodSugar.context
                        : (
                            bloodSugar.time
                                ? `Recorded ${formatTime(
                                    bloodSugar.time
                                )}`
                                : "Latest reading"
                        );

            } else {

                bloodSugarValue.textContent =
                    "--";


                bloodSugarTime.textContent =
                    "No reading yet";
            }


            const sleep =
                latestReading(
                    "sleep"
                );


            if (sleep) {

                sleepValue.textContent =
                    `${sleep.value} hrs`;


                sleepTime.textContent =
                    sleep.date ===
                    todayString()
                        ? "Today"
                        : "Latest record";

            } else {

                sleepValue.textContent =
                    "--";


                sleepTime.textContent =
                    "No reading yet";
            }
        }


        /* =================================================
           HEALTH MODAL
           ================================================= */

        function openHealthModal(
            type = "bloodPressure"
        ) {

            setHealthType(type);


            healthModal.classList.remove(
                "hidden"
            );
        }


        function closeHealthModal() {

            healthModal.classList.add(
                "hidden"
            );


            healthForm.reset();


            setHealthType(
                "bloodPressure"
            );
        }


        function setHealthType(type) {

            healthType.value =
                type;


            const sections = {

                bloodPressure:
                    "myCareBloodPressureFields",

                bloodSugar:
                    "myCareBloodSugarFields",

                sleep:
                    "myCareSleepFields"

            };


            document
                .querySelectorAll(
                    ".mycare-health-form-section"
                )
                .forEach(
                    function (section) {

                        section.classList.add(
                            "hidden"
                        );
                    }
                );


            document
                .getElementById(
                    sections[type]
                )
                .classList.remove(
                    "hidden"
                );


            document
                .querySelectorAll(
                    ".mycare-health-tab"
                )
                .forEach(
                    function (tab) {

                        tab.classList.toggle(
                            "active",
                            tab.dataset
                                .healthType ===
                                type
                        );
                    }
                );


            const titles = {

                bloodPressure:
                    "Record Blood Pressure",

                bloodSugar:
                    "Record Blood Sugar",

                sleep:
                    "Record Sleep"

            };


            document
                .getElementById(
                    "myCareHealthModalTitle"
                )
                .textContent =
                titles[type];
        }


        document
            .getElementById(
                "myCareRecordButton"
            )
            .addEventListener(
                "click",
                function () {

                    openHealthModal(
                        "bloodPressure"
                    );
                }
            );


        document
            .querySelectorAll(
                ".mycare-health-tab"
            )
            .forEach(
                function (tab) {

                    tab.addEventListener(
                        "click",
                        function () {

                            setHealthType(
                                tab.dataset
                                    .healthType
                            );
                        }
                    );
                }
            );


        document
            .getElementById(
                "closeMyCareHealthModal"
            )
            .addEventListener(
                "click",
                closeHealthModal
            );


        document
            .getElementById(
                "cancelMyCareHealth"
            )
            .addEventListener(
                "click",
                closeHealthModal
            );


        /* =================================================
           SAVE HEALTH READING
           ================================================= */

        healthForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const type =
                    healthType.value;


                const entry = {

                    type:
                        type,

                    date:
                        todayString(),

                    time:
                        timeString(),

                    notes:
                        document
                            .getElementById(
                                "myCareHealthNotes"
                            )
                            .value
                            .trim()

                };


                /* -----------------------------------------
                   BLOOD PRESSURE
                   ----------------------------------------- */

                if (
                    type ===
                    "bloodPressure"
                ) {

                    const systolic =
                        Number(
                            document
                                .getElementById(
                                    "myCareSystolic"
                                )
                                .value
                        );


                    const diastolic =
                        Number(
                            document
                                .getElementById(
                                    "myCareDiastolic"
                                )
                                .value
                        );


                    if (
                        systolic <= 0 ||
                        diastolic <= 0
                    ) {

                        alert(
                            "Please enter both blood pressure values."
                        );

                        return;
                    }


                    entry.systolic =
                        systolic;


                    entry.diastolic =
                        diastolic;


                    addHealthEntry(
                        entry
                    );


                    addActivity(
                        "Blood Pressure Recorded",
                        `${systolic}/${diastolic} mmHg`
                    );
                }


                /* -----------------------------------------
                   BLOOD SUGAR
                   ----------------------------------------- */

                if (
                    type ===
                    "bloodSugar"
                ) {

                    const value =
                        Number(
                            document
                                .getElementById(
                                    "myCareBloodSugarReading"
                                )
                                .value
                        );


                    if (value <= 0) {

                        alert(
                            "Please enter a blood sugar reading."
                        );

                        return;
                    }


                    entry.value =
                        value;


                    entry.context =
                        document
                            .getElementById(
                                "myCareGlucoseContext"
                            )
                            .value;


                    addHealthEntry(
                        entry
                    );


                    addActivity(
                        "Blood Sugar Recorded",
                        `${value} mg/dL`
                    );
                }


                /* -----------------------------------------
                   SLEEP
                   ----------------------------------------- */

                if (
                    type ===
                    "sleep"
                ) {

                    const hours =
                        Number(
                            document
                                .getElementById(
                                    "myCareSleepHours"
                                )
                                .value
                        );


                    if (
                        hours < 0 ||
                        hours > 24 ||
                        document
                            .getElementById(
                                "myCareSleepHours"
                            )
                            .value === ""
                    ) {

                        alert(
                            "Please enter valid sleep hours."
                        );

                        return;
                    }


                    entry.value =
                        hours;


                    addHealthEntry(
                        entry
                    );


                    addActivity(
                        "Sleep Recorded",
                        `${hours} hours`
                    );
                }


                closeHealthModal();

                renderHealth();
            }
        );


        /* =================================================
           FAMILY MEMBER
           ================================================= */

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


        function renderFamilyMember() {

            const caregiver =
                getCaregiver();


            const name =
                caregiver.fullName ||
                caregiver.name ||
                "My Caregiver";


            const relationship =
                caregiver.relationship ||
                "Family CareCircle";


            document
                .getElementById(
                    "myCareFamilyName"
                )
                .textContent =
                name;


            document
                .getElementById(
                    "myCareFamilyRelationship"
                )
                .textContent =
                relationship;
        }


        /* =================================================
           MESSAGES
           ================================================= */

        function getMessages() {

            return readArray(
                "careCircleMessages"
            );
        }


        function saveMessages(
            messages
        ) {

            saveArray(
                "careCircleMessages",
                messages
            );
        }


        function openMessageModal() {

            const caregiver =
                getCaregiver();


            const name =
                caregiver.fullName ||
                caregiver.name ||
                "Family";


            document
                .getElementById(
                    "familyMessageModalTitle"
                )
                .textContent =
                `Message ${name}`;


            messageModal.classList.remove(
                "hidden"
            );


            setTimeout(
                function () {

                    document
                        .getElementById(
                            "familyMessageText"
                        )
                        .focus();

                },
                100
            );
        }


        function closeMessageModal() {

            messageModal.classList.add(
                "hidden"
            );


            messageForm.reset();
        }


        document
            .getElementById(
                "openFamilyMessage"
            )
            .addEventListener(
                "click",
                openMessageModal
            );


        document
            .getElementById(
                "closeFamilyMessageModal"
            )
            .addEventListener(
                "click",
                closeMessageModal
            );


        document
            .getElementById(
                "cancelFamilyMessage"
            )
            .addEventListener(
                "click",
                closeMessageModal
            );


        messageForm.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const text =
                    document
                        .getElementById(
                            "familyMessageText"
                        )
                        .value
                        .trim();


                if (!text) {
                    return;
                }


                const messages =
                    getMessages();


                messages.push({

                    id:
                        "message-" +
                        Date.now(),

                    sender:
                        "recipient",

                    receiver:
                        "caregiver",

                    text:
                        text,

                    date:
                        todayString(),

                    time:
                        timeString(),

                    createdAt:
                        new Date()
                            .toISOString()

                });


                saveMessages(
                    messages
                );


                addActivity(
                    "Family Message Sent",
                    "Message sent to caregiver"
                );


                closeMessageModal();

                renderMessages();
            }
        );


        /* =================================================
           RENDER MESSAGES
           ================================================= */

        function renderMessages() {

            const container =
                document.getElementById(
                    "myCareMessageHistory"
                );


            const messages =
                getMessages()
                    .sort(
                        function (a, b) {

                            return (
                                new Date(
                                    a.createdAt ||
                                    `${a.date}T${
                                        a.time ||
                                        "00:00"
                                    }`
                                ) -
                                new Date(
                                    b.createdAt ||
                                    `${b.date}T${
                                        b.time ||
                                        "00:00"
                                    }`
                                )
                            );
                        }
                    );


            if (
                messages.length === 0
            ) {

                container.innerHTML = `

                    <div class="mycare-empty-messages">

                        <span>
                            ●●●
                        </span>

                        <p>
                            No family messages yet.
                        </p>

                    </div>

                `;

                return;
            }


            container.innerHTML =
                messages
                    .map(
                        function (message) {

                            const sent =
                                message.sender ===
                                "recipient";


                            return `

                                <div class="
                                    mycare-message-row
                                    ${
                                        sent
                                            ? "sent"
                                            : "received"
                                    }
                                ">

                                    <div class="
                                        mycare-message-bubble
                                    ">

                                        <p>
                                            ${escapeHTML(
                                                message.text
                                            )}
                                        </p>

                                        <small>
                                            ${escapeHTML(
                                                formatTime(
                                                    message.time
                                                )
                                            )}
                                        </small>

                                    </div>

                                </div>

                            `;
                        }
                    )
                    .join("");


            container.scrollTop =
                container.scrollHeight;
        }


        /* =================================================
           FAMILY NAVIGATION
           ================================================= */

        document
            .getElementById(
                "myCareFamilyNav"
            )
            .addEventListener(
                "click",
                function () {

                    document
                        .getElementById(
                            "family"
                        )
                        .scrollIntoView({
                            behavior:
                                "smooth"
                        });
                }
            );


        /* =================================================
           PROFILE
           ================================================= */

        document
            .getElementById(
                "myCareProfileButton"
            )
            .addEventListener(
                "click",
                function () {

                    /*
                     * Until we build the recipient profile
                     * editor, return to their dashboard.
                     */

                    window.location.href =
                        "recipient-dashboard.html";
                }
            );


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

        renderHealth();

        renderFamilyMember();

        renderMessages();


        /*
         * If we arrived using:
         *
         * mycare.html#family
         *
         * scroll to the family section.
         */

        if (
            window.location.hash ===
            "#family"
        ) {

            setTimeout(
                function () {

                    document
                        .getElementById(
                            "family"
                        )
                        .scrollIntoView();

                },
                100
            );
        }

    }
);