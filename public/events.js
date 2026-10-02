/* =========================================================
   CARECIRCLE
   EVENTS / CALENDAR
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const calendarHeading =
        document.getElementById("calendarHeading");

    const calendarContainer =
        document.getElementById("calendarContainer");

    const calendarGrid =
        document.getElementById("calendarGrid");

    const eventsList =
        document.getElementById("eventsList");

    const eventListHeading =
        document.getElementById("eventListHeading");

    const previousPeriod =
        document.getElementById("previousPeriod");

    const nextPeriod =
        document.getElementById("nextPeriod");

    const todayButton =
        document.getElementById("todayButton");

    const viewButtons =
        document.querySelectorAll(".calendar-view-button");


    /* Event form */

    const eventModal =
        document.getElementById("eventModal");

    const eventForm =
        document.getElementById("eventForm");

    const eventModalTitle =
        document.getElementById("eventModalTitle");

    const addEventButton =
        document.getElementById("addEventButton");

    const eventsQuickAdd =
        document.getElementById("eventsQuickAdd");

    const closeEventModal =
        document.getElementById("closeEventModal");

    const cancelEventButton =
        document.getElementById("cancelEventButton");


    /* Event details */

    const eventDetailsModal =
        document.getElementById("eventDetailsModal");

    const eventDetailsTitle =
        document.getElementById("eventDetailsTitle");

    const eventDetailsContent =
        document.getElementById("eventDetailsContent");

    const closeEventDetails =
        document.getElementById("closeEventDetails");

    const editEventButton =
        document.getElementById("editEventButton");

    const deleteEventButton =
        document.getElementById("deleteEventButton");


    /* =====================================================
       CALENDAR STATE
       ===================================================== */

    let currentView = "month";

    let selectedDate = new Date();

    let displayDate = new Date();

    let selectedEventId = null;


    /* Remove time from selected date */

    selectedDate.setHours(0, 0, 0, 0);

    displayDate.setHours(0, 0, 0, 0);


    /* =====================================================
       LOCAL STORAGE
       ===================================================== */

    function getEvents() {

        const saved =
            localStorage.getItem("careCircleEvents");


        if (!saved) {
            return [];
        }


        try {

            const events =
                JSON.parse(saved);


            return Array.isArray(events)
                ? events
                : [];

        } catch (error) {

            console.error(
                "Unable to load CareCircle events:",
                error
            );

            return [];
        }

    }


    function saveEvents(events) {

        localStorage.setItem(
            "careCircleEvents",
            JSON.stringify(events)
        );

    }


    /* =====================================================
       DATE HELPERS
       ===================================================== */

    function dateToString(date) {

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


    function stringToDate(dateString) {

        if (!dateString) {
            return null;
        }


        const date =
            new Date(
                dateString +
                "T00:00:00"
            );


        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return null;
        }


        return date;

    }


    function isSameDate(first, second) {

        return (
            first.getFullYear() ===
                second.getFullYear() &&

            first.getMonth() ===
                second.getMonth() &&

            first.getDate() ===
                second.getDate()
        );

    }


    function isToday(date) {

        const today =
            new Date();


        return isSameDate(
            date,
            today
        );

    }


    function formatFullDate(date) {

        return date.toLocaleDateString(
            "en",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );

    }


    function formatShortDate(dateString) {

        const date =
            stringToDate(dateString);


        if (!date) {
            return "Date not provided";
        }


        return date.toLocaleDateString(
            "en",
            {
                month: "short",
                day: "numeric",
                year: "numeric"
            }
        );

    }


    function formatTime(time) {

        if (!time) {
            return "Time not specified";
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


        hours = hours % 12;


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
       HTML SAFETY
       ===================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;");

    }


    /* =====================================================
       SORT EVENTS
       ===================================================== */

    function sortEvents(events) {

        return [...events].sort(
            function (a, b) {

                const first =
                    `${a.date || "9999-12-31"} ` +
                    `${a.time || "23:59"}`;

                const second =
                    `${b.date || "9999-12-31"} ` +
                    `${b.time || "23:59"}`;


                return first.localeCompare(
                    second
                );

            }
        );

    }


    /* =====================================================
       GET EVENTS FOR ONE DATE
       ===================================================== */

    function getEventsForDate(date) {

        const target =
            dateToString(date);


        return sortEvents(
            getEvents().filter(
                function (event) {

                    return (
                        event.date === target
                    );

                }
            )
        );

    }


    /* =====================================================
       MONTH CALENDAR
       ===================================================== */

    function renderMonthView() {

        restoreMonthCalendarStructure();


        const year =
            displayDate.getFullYear();

        const month =
            displayDate.getMonth();


        calendarHeading.textContent =
            displayDate.toLocaleDateString(
                "en",
                {
                    month: "long",
                    year: "numeric"
                }
            );


        const firstDay =
            new Date(
                year,
                month,
                1
            );


        const startDate =
            new Date(firstDay);


        /*
         * Move backwards to Sunday so that
         * the calendar always begins on Sunday.
         */

        startDate.setDate(
            firstDay.getDate() -
            firstDay.getDay()
        );


        let html = "";


        /*
         * Six rows x seven days gives us
         * a stable 42-cell calendar.
         */

        for (
            let i = 0;
            i < 42;
            i++
        ) {

            const date =
                new Date(startDate);


            date.setDate(
                startDate.getDate() + i
            );


            const events =
                getEventsForDate(date);


            let classes =
                "calendar-day";


            if (
                date.getMonth() !== month
            ) {

                classes +=
                    " other-month";

            }


            if (isToday(date)) {

                classes +=
                    " today";

            }


            if (
                isSameDate(
                    date,
                    selectedDate
                )
            ) {

                classes +=
                    " selected";

            }


            const dots =
                events
                    .slice(0, 3)
                    .map(
                        function () {

                            return `
                                <span
                                    class="calendar-event-dot"
                                ></span>
                            `;

                        }
                    )
                    .join("");


            const more =
                events.length > 3
                    ? `
                        <span
                            class="calendar-more-events"
                        >
                            +${events.length - 3}
                        </span>
                      `
                    : "";


            html += `

                <button
                    type="button"
                    class="${classes}"
                    data-date="${dateToString(date)}"
                >

                    <span class="calendar-day-number">
                        ${date.getDate()}
                    </span>

                    <span class="calendar-event-dots">
                        ${dots}
                    </span>

                    ${more}

                </button>

            `;

        }


        calendarGrid.innerHTML =
            html;


        document
            .querySelectorAll(
                ".calendar-day"
            )
            .forEach(
                function (button) {

                    button.addEventListener(
                        "click",
                        function () {

                            const date =
                                stringToDate(
                                    button.dataset.date
                                );


                            if (!date) {
                                return;
                            }


                            selectedDate =
                                date;


                            /*
                             * If user selects a date
                             * from the previous/next
                             * month, move the displayed
                             * month too.
                             */

                            displayDate =
                                new Date(date);


                            renderCalendar();

                        }
                    );

                }
            );


        renderEventList(
            getEventsForDate(
                selectedDate
            ),
            "Events for " +
            formatFullDate(
                selectedDate
            )
        );

    }


    /* =====================================================
       RESTORE MONTH HTML STRUCTURE

       Day/Week/All replace the inside of the calendar,
       so Month recreates its weekday/grid structure.
       ===================================================== */

    function restoreMonthCalendarStructure() {

        calendarContainer.innerHTML = `

            <div class="calendar-weekdays">

                <span>Sun</span>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>

            </div>


            <div
                class="calendar-grid"
                id="calendarGrid"
            ></div>

        `;

    }


    /* =====================================================
       DAY VIEW
       ===================================================== */

    function renderDayView() {

        calendarHeading.textContent =
            displayDate.toLocaleDateString(
                "en",
                {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                }
            );


        selectedDate =
            new Date(displayDate);


        const events =
            getEventsForDate(
                displayDate
            );


        let content = `

            <div class="day-view">

                <div class="day-view-heading">

                    <h3>
                        ${escapeHTML(
                            formatFullDate(
                                displayDate
                            )
                        )}
                    </h3>

                    <p>
                        ${events.length}
                        ${
                            events.length === 1
                                ? "event"
                                : "events"
                        }
                    </p>

                </div>

        `;


        if (events.length === 0) {

            content += `

                <div class="calendar-empty-state">
                    No events scheduled for this day.
                </div>

            `;

        } else {

            events.forEach(
                function (event) {

                    content += `

                        <article
                            class="event-card"
                            data-event-id="${event.id}"
                        >

                            <div class="event-card-content">

                                <h3 class="event-card-title">
                                    ${escapeHTML(
                                        event.title
                                    )}
                                </h3>

                                <p class="event-card-type">
                                    ${escapeHTML(
                                        event.type
                                    )}
                                </p>

                                <div class="event-card-details">

                                    <span>
                                        ${escapeHTML(
                                            formatTime(
                                                event.time
                                            )
                                        )}
                                    </span>

                                    ${
                                        event.location
                                            ? `
                                                <span>
                                                    ${escapeHTML(
                                                        event.location
                                                    )}
                                                </span>
                                              `
                                            : ""
                                    }

                                </div>

                            </div>

                        </article>

                    `;

                }
            );

        }


        content +=
            "</div>";


        calendarContainer.innerHTML =
            content;


        attachEventCardListeners();


        renderEventList(
            events,
            "Events for " +
            formatFullDate(
                displayDate
            )
        );

    }


    /* =====================================================
       START OF WEEK
       ===================================================== */

    function getStartOfWeek(date) {

        const start =
            new Date(date);


        start.setDate(
            date.getDate() -
            date.getDay()
        );


        start.setHours(
            0,
            0,
            0,
            0
        );


        return start;

    }


    /* =====================================================
       WEEK VIEW
       ===================================================== */

    function renderWeekView() {

        const start =
            getStartOfWeek(
                displayDate
            );


        const end =
            new Date(start);


        end.setDate(
            start.getDate() + 6
        );


        calendarHeading.textContent =
            start.toLocaleDateString(
                "en",
                {
                    month: "short",
                    day: "numeric"
                }
            ) +
            " – " +
            end.toLocaleDateString(
                "en",
                {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                }
            );


        let html =
            '<div class="week-view">';


        let weekEvents = [];


        for (
            let i = 0;
            i < 7;
            i++
        ) {

            const date =
                new Date(start);


            date.setDate(
                start.getDate() + i
            );


            const events =
                getEventsForDate(date);


            weekEvents =
                weekEvents.concat(events);


            let classes =
                "week-day";


            if (isToday(date)) {

                classes +=
                    " today";

            }


            if (
                isSameDate(
                    date,
                    selectedDate
                )
            ) {

                classes +=
                    " selected";

            }


            html += `

                <div
                    class="${classes}"
                    data-date="${dateToString(date)}"
                >

                    <span class="week-day-name">
                        ${date.toLocaleDateString(
                            "en",
                            {
                                weekday: "short"
                            }
                        )}
                    </span>

                    <span class="week-day-number">
                        ${date.getDate()}
                    </span>

            `;


            events.forEach(
                function (event) {

                    html += `

                        <div
                            class="week-event"
                            data-event-id="${event.id}"
                            title="${escapeHTML(
                                event.title
                            )}"
                        >
                            ${escapeHTML(
                                event.title
                            )}
                        </div>

                    `;

                }
            );


            html +=
                "</div>";

        }


        html +=
            "</div>";


        calendarContainer.innerHTML =
            html;


        document
            .querySelectorAll(
                ".week-day"
            )
            .forEach(
                function (day) {

                    day.addEventListener(
                        "click",
                        function (event) {

                            /*
                             * Don't change the selected
                             * date if the user clicked
                             * directly on an event.
                             */

                            if (
                                event.target.closest(
                                    ".week-event"
                                )
                            ) {
                                return;
                            }


                            const date =
                                stringToDate(
                                    day.dataset.date
                                );


                            if (!date) {
                                return;
                            }


                            selectedDate =
                                date;

                            displayDate =
                                new Date(date);


                            renderCalendar();

                        }
                    );

                }
            );


        document
            .querySelectorAll(
                ".week-event"
            )
            .forEach(
                function (eventElement) {

                    eventElement.addEventListener(
                        "click",
                        function (event) {

                            event.stopPropagation();


                            openEventDetails(
                                Number(
                                    eventElement
                                        .dataset
                                        .eventId
                                )
                            );

                        }
                    );

                }
            );


        renderEventList(
            sortEvents(weekEvents),
            "Events This Week"
        );

    }


    /* =====================================================
       ALL EVENTS VIEW
       ===================================================== */

    function renderAllEventsView() {

        calendarHeading.textContent =
            "All Events";


        calendarContainer.innerHTML = `

            <div class="all-events-calendar-state">

                <span>
                    ◷
                </span>

                <h3>
                    Complete Care Schedule
                </h3>

                <p>
                    All appointments, visits and
                    care events are shown below.
                </p>

            </div>

        `;


        renderEventList(
            sortEvents(
                getEvents()
            ),
            "All Events"
        );

    }


    /* =====================================================
       RENDER CORRECT VIEW
       ===================================================== */

    function renderCalendar() {

        switch (currentView) {

            case "day":

                renderDayView();

                break;


            case "week":

                renderWeekView();

                break;


            case "all":

                renderAllEventsView();

                break;


            default:

                renderMonthView();

        }

    }


    /* =====================================================
       EVENT LIST
       ===================================================== */

    function renderEventList(
        events,
        heading
    ) {

        eventListHeading.textContent =
            heading;


        if (events.length === 0) {

            eventsList.innerHTML = `

                <div class="empty-dashboard-state">

                    <span class="empty-icon">
                        ◷
                    </span>

                    <p>
                        No events found.
                    </p>

                </div>

            `;

            return;

        }


        const now =
            new Date();


        eventsList.innerHTML =
            events
                .map(
                    function (event) {

                        const date =
                            stringToDate(
                                event.date
                            );


                        if (!date) {
                            return "";
                        }


                        const eventDateTime =
                            new Date(
                                event.date +
                                "T" +
                                (
                                    event.time ||
                                    "23:59"
                                )
                            );


                        const isPast =
                            eventDateTime < now;


                        const month =
                            date.toLocaleDateString(
                                "en",
                                {
                                    month: "short"
                                }
                            );


                        const typeClass =
                            String(
                                event.type ||
                                "Other"
                            )
                                .toLowerCase()
                                .replaceAll(
                                    " ",
                                    "-"
                                );


                        return `

                            <article
                                class="
                                    event-card
                                    ${typeClass}
                                    ${
                                        isPast
                                            ? "past-event"
                                            : ""
                                    }
                                "
                                data-event-id="${event.id}"
                                tabindex="0"
                            >

                                <div class="event-card-date">

                                    <span class="event-card-month">
                                        ${escapeHTML(month)}
                                    </span>

                                    <span class="event-card-day">
                                        ${date.getDate()}
                                    </span>

                                </div>


                                <div class="event-card-content">

                                    <div class="event-card-top">

                                        <h3 class="event-card-title">
                                            ${escapeHTML(
                                                event.title
                                            )}
                                        </h3>

                                        <span class="event-type-badge">
                                            ${escapeHTML(
                                                event.type
                                            )}
                                        </span>

                                    </div>


                                    <div class="event-card-details">

                                        <span>
                                            ◷
                                            ${escapeHTML(
                                                formatTime(
                                                    event.time
                                                )
                                            )}
                                        </span>


                                        ${
                                            event.location
                                                ? `
                                                    <span>
                                                        ⌖
                                                        ${escapeHTML(
                                                            event.location
                                                        )}
                                                    </span>
                                                  `
                                                : ""
                                        }


                                        ${
                                            event.eventFor
                                                ? `
                                                    <span>
                                                        👤
                                                        ${escapeHTML(
                                                            event.eventFor
                                                        )}
                                                    </span>
                                                  `
                                                : ""
                                        }

                                    </div>

                                </div>

                            </article>

                        `;

                    }
                )
                .join("");


        attachEventCardListeners();

    }


    /* =====================================================
       EVENT CARD LISTENERS
       ===================================================== */

    function attachEventCardListeners() {

        document
            .querySelectorAll(
                ".event-card"
            )
            .forEach(
                function (card) {

                    card.addEventListener(
                        "click",
                        function () {

                            openEventDetails(
                                Number(
                                    card.dataset.eventId
                                )
                            );

                        }
                    );


                    card.addEventListener(
                        "keydown",
                        function (event) {

                            if (
                                event.key === "Enter" ||
                                event.key === " "
                            ) {

                                event.preventDefault();


                                openEventDetails(
                                    Number(
                                        card.dataset.eventId
                                    )
                                );

                            }

                        }
                    );

                }
            );

    }


    /* =====================================================
       VIEW BUTTONS
       ===================================================== */

    viewButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    viewButtons.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    currentView =
                        button.dataset.view;


                    renderCalendar();

                }
            );

        }
    );


    /* =====================================================
       PREVIOUS PERIOD
       ===================================================== */

    previousPeriod.addEventListener(
        "click",
        function () {

            switch (currentView) {

                case "day":

                    displayDate.setDate(
                        displayDate.getDate() - 1
                    );

                    selectedDate =
                        new Date(displayDate);

                    break;


                case "week":

                    displayDate.setDate(
                        displayDate.getDate() - 7
                    );

                    selectedDate =
                        new Date(displayDate);

                    break;


                case "month":

                    displayDate.setMonth(
                        displayDate.getMonth() - 1
                    );

                    selectedDate =
                        new Date(
                            displayDate.getFullYear(),
                            displayDate.getMonth(),
                            1
                        );

                    break;


                case "all":

                    return;

            }


            renderCalendar();

        }
    );


    /* =====================================================
       NEXT PERIOD
       ===================================================== */

    nextPeriod.addEventListener(
        "click",
        function () {

            switch (currentView) {

                case "day":

                    displayDate.setDate(
                        displayDate.getDate() + 1
                    );

                    selectedDate =
                        new Date(displayDate);

                    break;


                case "week":

                    displayDate.setDate(
                        displayDate.getDate() + 7
                    );

                    selectedDate =
                        new Date(displayDate);

                    break;


                case "month":

                    displayDate.setMonth(
                        displayDate.getMonth() + 1
                    );

                    selectedDate =
                        new Date(
                            displayDate.getFullYear(),
                            displayDate.getMonth(),
                            1
                        );

                    break;


                case "all":

                    return;

            }


            renderCalendar();

        }
    );


    /* =====================================================
       TODAY
       ===================================================== */

    todayButton.addEventListener(
        "click",
        function () {

            displayDate =
                new Date();

            selectedDate =
                new Date();


            displayDate.setHours(
                0,
                0,
                0,
                0
            );

            selectedDate.setHours(
                0,
                0,
                0,
                0
            );


            renderCalendar();

        }
    );


    /* =====================================================
       OPEN ADD EVENT
       ===================================================== */

    function openAddEventModal() {

        eventForm.reset();


        document
            .getElementById(
                "eventId"
            )
            .value = "";


        document
            .getElementById(
                "eventDate"
            )
            .value =
                dateToString(
                    selectedDate
                );


        document
            .getElementById(
                "eventReminder"
            )
            .value =
                "None";


        document
            .getElementById(
                "eventRepeat"
            )
            .value =
                "Never";


        /*
         * Use registered care recipient
         * as the default Event For value.
         */

        const registration =
            getRegistration();


        if (
            registration &&
            registration.recipient &&
            registration.recipient.fullName
        ) {

            document
                .getElementById(
                    "eventFor"
                )
                .value =
                    registration
                        .recipient
                        .fullName;

        }


        eventModalTitle.textContent =
            "Add Event";


        eventModal.classList.remove(
            "hidden"
        );


        document.body.style.overflow =
            "hidden";

    }


    /* =====================================================
       CLOSE EVENT FORM
       ===================================================== */

    function closeEventForm() {

        eventModal.classList.add(
            "hidden"
        );


        document.body.style.overflow =
            "";

    }


    addEventButton.addEventListener(
        "click",
        openAddEventModal
    );


    eventsQuickAdd.addEventListener(
        "click",
        openAddEventModal
    );


    closeEventModal.addEventListener(
        "click",
        closeEventForm
    );


    cancelEventButton.addEventListener(
        "click",
        closeEventForm
    );


    eventModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                eventModal
            ) {

                closeEventForm();

            }

        }
    );


    /* =====================================================
       SAVE EVENT
       ===================================================== */

    eventForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const existingId =
                document
                    .getElementById(
                        "eventId"
                    )
                    .value;


            const eventData = {

                id:
                    existingId
                        ? Number(existingId)
                        : Date.now(),

                title:
                    document
                        .getElementById(
                            "eventTitle"
                        )
                        .value
                        .trim(),

                type:
                    document
                        .getElementById(
                            "eventType"
                        )
                        .value,

                date:
                    document
                        .getElementById(
                            "eventDate"
                        )
                        .value,

                time:
                    document
                        .getElementById(
                            "eventTime"
                        )
                        .value,

                endTime:
                    document
                        .getElementById(
                            "eventEndTime"
                        )
                        .value,

                location:
                    document
                        .getElementById(
                            "eventLocation"
                        )
                        .value
                        .trim(),

                eventFor:
                    document
                        .getElementById(
                            "eventFor"
                        )
                        .value
                        .trim(),

                reminder:
                    document
                        .getElementById(
                            "eventReminder"
                        )
                        .value,

                repeat:
                    document
                        .getElementById(
                            "eventRepeat"
                        )
                        .value,

                notes:
                    document
                        .getElementById(
                            "eventNotes"
                        )
                        .value
                        .trim(),

                updatedAt:
                    new Date()
                        .toISOString()

            };


            /*
             * We deliberately do not save the actual
             * attachment in localStorage.
             */

            const fileInput =
                document.getElementById(
                    "eventAttachment"
                );


            if (
                fileInput.files &&
                fileInput.files.length > 0
            ) {

                eventData.attachmentName =
                    fileInput.files[0].name;

            }


            let events =
                getEvents();


            if (existingId) {

                events =
                    events.map(
                        function (existing) {

                            if (
                                Number(existing.id) ===
                                Number(existingId)
                            ) {

                                /*
                                 * Preserve an earlier
                                 * attachment name if no
                                 * replacement was selected.
                                 */

                                if (
                                    !eventData.attachmentName &&
                                    existing.attachmentName
                                ) {

                                    eventData.attachmentName =
                                        existing.attachmentName;

                                }


                                return {
                                    ...existing,
                                    ...eventData
                                };

                            }


                            return existing;

                        }
                    );


                addActivity(
                    "Event updated",
                    eventData.title,
                    "◷"
                );

            } else {

                eventData.createdAt =
                    new Date()
                        .toISOString();


                events.push(
                    eventData
                );


                addActivity(
                    "Event added",
                    eventData.title,
                    "◷"
                );

            }


            saveEvents(events);


            selectedDate =
                stringToDate(
                    eventData.date
                );


            displayDate =
                new Date(
                    selectedDate
                );


            closeEventForm();

            renderCalendar();

        }
    );


    /* =====================================================
       EVENT DETAILS
       ===================================================== */

    function openEventDetails(eventId) {

        const event =
            getEvents().find(
                function (item) {

                    return (
                        Number(item.id) ===
                        Number(eventId)
                    );

                }
            );


        if (!event) {
            return;
        }


        selectedEventId =
            event.id;


        eventDetailsTitle.textContent =
            event.title;


        eventDetailsContent.innerHTML = `

            <div class="task-detail-row">

                <div class="task-detail-label">
                    Type
                </div>

                <div class="task-detail-value">
                    ${escapeHTML(
                        event.type
                    )}
                </div>

            </div>


            <div class="task-detail-row">

                <div class="task-detail-label">
                    Date
                </div>

                <div class="task-detail-value">
                    ${escapeHTML(
                        formatShortDate(
                            event.date
                        )
                    )}
                </div>

            </div>


            <div class="task-detail-row">

                <div class="task-detail-label">
                    Time
                </div>

                <div class="task-detail-value">

                    ${escapeHTML(
                        formatTime(
                            event.time
                        )
                    )}

                    ${
                        event.endTime
                            ? " – " +
                              escapeHTML(
                                  formatTime(
                                      event.endTime
                                  )
                              )
                            : ""
                    }

                </div>

            </div>


            <div class="task-detail-row">

                <div class="task-detail-label">
                    Location
                </div>

                <div class="task-detail-value">
                    ${escapeHTML(
                        event.location ||
                        "Not provided"
                    )}
                </div>

            </div>


            <div class="task-detail-row">

                <div class="task-detail-label">
                    Event For
                </div>

                <div class="task-detail-value">
                    ${escapeHTML(
                        event.eventFor ||
                        "Not provided"
                    )}
                </div>

            </div>


            <div class="task-detail-row">

                <div class="task-detail-label">
                    Reminder
                </div>

                <div class="task-detail-value">
                    ${escapeHTML(
                        event.reminder ||
                        "None"
                    )}
                </div>

            </div>


            <div class="task-detail-row">

                <div class="task-detail-label">
                    Repeat
                </div>

                <div class="task-detail-value">
                    ${escapeHTML(
                        event.repeat ||
                        "Never"
                    )}
                </div>

            </div>


            <div class="task-detail-row">

                <div class="task-detail-label">
                    Notes
                </div>

                <div class="task-detail-value">
                    ${escapeHTML(
                        event.notes ||
                        "No notes"
                    )}
                </div>

            </div>


            ${
                event.attachmentName
                    ? `
                        <div class="task-detail-row">

                            <div class="task-detail-label">
                                Attachment
                            </div>

                            <div class="task-detail-value">
                                ${escapeHTML(
                                    event.attachmentName
                                )}
                            </div>

                        </div>
                      `
                    : ""
            }

        `;


        eventDetailsModal.classList.remove(
            "hidden"
        );


        document.body.style.overflow =
            "hidden";

    }


    /* =====================================================
       CLOSE DETAILS
       ===================================================== */

    function closeDetails() {

        eventDetailsModal.classList.add(
            "hidden"
        );


        document.body.style.overflow =
            "";


        selectedEventId = null;

    }


    closeEventDetails.addEventListener(
        "click",
        closeDetails
    );


    eventDetailsModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                eventDetailsModal
            ) {

                closeDetails();

            }

        }
    );


    /* =====================================================
       EDIT EVENT
       ===================================================== */

    editEventButton.addEventListener(
        "click",
        function () {

            if (
                selectedEventId === null
            ) {
                return;
            }


            const event =
                getEvents().find(
                    function (item) {

                        return (
                            Number(item.id) ===
                            Number(selectedEventId)
                        );

                    }
                );


            if (!event) {
                return;
            }


            const editingId =
                event.id;


            closeDetails();


            document
                .getElementById(
                    "eventId"
                )
                .value =
                    editingId;


            document
                .getElementById(
                    "eventTitle"
                )
                .value =
                    event.title || "";


            document
                .getElementById(
                    "eventType"
                )
                .value =
                    event.type || "";


            document
                .getElementById(
                    "eventDate"
                )
                .value =
                    event.date || "";


            document
                .getElementById(
                    "eventTime"
                )
                .value =
                    event.time || "";


            document
                .getElementById(
                    "eventEndTime"
                )
                .value =
                    event.endTime || "";


            document
                .getElementById(
                    "eventLocation"
                )
                .value =
                    event.location || "";


            document
                .getElementById(
                    "eventFor"
                )
                .value =
                    event.eventFor || "";


            document
                .getElementById(
                    "eventReminder"
                )
                .value =
                    event.reminder ||
                    "None";


            document
                .getElementById(
                    "eventRepeat"
                )
                .value =
                    event.repeat ||
                    "Never";


            document
                .getElementById(
                    "eventNotes"
                )
                .value =
                    event.notes || "";


            /*
             * Browsers do not allow us to
             * programmatically restore a file
             * input for security reasons.
             */

            document
                .getElementById(
                    "eventAttachment"
                )
                .value = "";


            eventModalTitle.textContent =
                "Edit Event";


            eventModal.classList.remove(
                "hidden"
            );


            document.body.style.overflow =
                "hidden";

        }
    );


    /* =====================================================
       DELETE EVENT
       ===================================================== */

    deleteEventButton.addEventListener(
        "click",
        function () {

            if (
                selectedEventId === null
            ) {
                return;
            }


            const events =
                getEvents();


            const event =
                events.find(
                    function (item) {

                        return (
                            Number(item.id) ===
                            Number(selectedEventId)
                        );

                    }
                );


            if (!event) {
                return;
            }


            const confirmed =
                window.confirm(
                    "Delete \"" +
                    event.title +
                    "\"?"
                );


            if (!confirmed) {
                return;
            }


            const updated =
                events.filter(
                    function (item) {

                        return (
                            Number(item.id) !==
                            Number(selectedEventId)
                        );

                    }
                );


            saveEvents(updated);


            addActivity(
                "Event deleted",
                event.title,
                "◷"
            );


            closeDetails();

            renderCalendar();

        }
    );


    /* =====================================================
       REGISTRATION DATA
       ===================================================== */

    function getRegistration() {

        const saved =
            localStorage.getItem(
                "careCircleRegistration"
            );


        if (!saved) {
            return null;
        }


        try {

            return JSON.parse(saved);

        } catch (error) {

            return null;

        }

    }


    /* =====================================================
       ACTIVITY HISTORY
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

            const activities =
                JSON.parse(saved);


            return Array.isArray(activities)
                ? activities
                : [];

        } catch (error) {

            return [];

        }

    }


    function addActivity(
        title,
        description,
        icon
    ) {

        const activities =
            getActivities();


        activities.unshift({

            id:
                Date.now(),

            title:
                title,

            description:
                description,

            icon:
                icon,

            createdAt:
                new Date()
                    .toISOString()

        });


        if (
            activities.length > 50
        ) {

            activities.length = 50;

        }


        localStorage.setItem(
            "careCircleActivities",
            JSON.stringify(
                activities
            )
        );

    }


    /* =====================================================
       PROFILE
       ===================================================== */

    const profileButton =
        document.getElementById(
            "eventsProfileButton"
        );


    profileButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "patient-setup.html";

        }
    );


    /* =====================================================
       ESCAPE KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape"
            ) {

                closeEventForm();

                closeDetails();

            }

        }
    );


    /* =====================================================
       DASHBOARD QUICK ADD

       dashboard.js sends:
       events.html?action=new
       ===================================================== */

    const parameters =
        new URLSearchParams(
            window.location.search
        );


    /* =====================================================
       INITIALIZE
       ===================================================== */

    renderCalendar();


    if (
        parameters.get("action") ===
        "new"
    ) {

        openAddEventModal();

    }

});