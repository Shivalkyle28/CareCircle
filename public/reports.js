/* =========================================================
   CARECIRCLE REPORTS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       STATE
       ===================================================== */

    let currentReportView = "daily";
    let selectedVitalType = "bloodPressure";
    let reportDate = new Date();

    reportDate.setHours(0, 0, 0, 0);


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const reportTabs =
        document.querySelectorAll(".report-tab");

    const reportViews = {
        daily: document.getElementById("dailyReportView"),
        vitals: document.getElementById("vitalsReportView"),
        overview: document.getElementById("overviewReportView")
    };

    const previousReportDate =
        document.getElementById("previousReportDate");

    const nextReportDate =
        document.getElementById("nextReportDate");

    const reportTodayButton =
        document.getElementById("reportTodayButton");

    const reportDateHeading =
        document.getElementById("reportDateHeading");

    const vitalFilters =
        document.querySelectorAll(".vital-filter");

    const reportsRecordVitals =
        document.getElementById("reportsRecordVitals");

    const reportsQuickAdd =
        document.getElementById("reportsQuickAdd");

    const reportsProfileButton =
        document.getElementById("reportsProfileButton");


    /* =====================================================
       STORAGE HELPER
       ===================================================== */

    function readArray(key) {

        const saved =
            localStorage.getItem(key);

        if (!saved) {
            return [];
        }

        try {

            const data =
                JSON.parse(saved);

            return Array.isArray(data)
                ? data
                : [];

        } catch (error) {

            console.error(
                `Unable to read ${key}:`,
                error
            );

            return [];
        }
    }


    function getHealthHistory() {
        return readArray(
            "careCircleHealthHistory"
        );
    }


    function getTasks() {
        return readArray(
            "careCircleTasks"
        );
    }


    function getEvents() {
        return readArray(
            "careCircleEvents"
        );
    }


    function getActivities() {
        return readArray(
            "careCircleActivities"
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
                dateString + "T00:00:00"
            );

        return Number.isNaN(
            date.getTime()
        )
            ? null
            : date;
    }


    function isToday(date) {

        const today =
            new Date();

        return (
            date.getFullYear() ===
                today.getFullYear() &&
            date.getMonth() ===
                today.getMonth() &&
            date.getDate() ===
                today.getDate()
        );
    }


    function formatDate(dateString) {

        const date =
            stringToDate(dateString);

        if (!date) {
            return "";
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


    function formatShortDate(dateString) {

        const date =
            stringToDate(dateString);

        if (!date) {
            return "";
        }

        return date.toLocaleDateString(
            "en",
            {
                month: "short",
                day: "numeric"
            }
        );
    }


    function formatTime(time) {

        if (!time) {
            return "";
        }

        const [hourPart, minutePart] =
            time.split(":");

        let hours =
            Number(hourPart);

        const minutes =
            minutePart || "00";

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
       DATE HEADING
       ===================================================== */

    function updateDateHeading() {

        if (isToday(reportDate)) {

            reportDateHeading.textContent =
                "Today";

            return;
        }

        reportDateHeading.textContent =
            reportDate.toLocaleDateString(
                "en",
                {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                }
            );
    }


    /* =====================================================
       REPORT TABS
       ===================================================== */

    reportTabs.forEach(
        function (tab) {

            tab.addEventListener(
                "click",
                function () {

                    currentReportView =
                        tab.dataset.reportView;

                    reportTabs.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );
                        }
                    );

                    tab.classList.add(
                        "active"
                    );

                    Object.values(
                        reportViews
                    ).forEach(
                        function (view) {

                            view.classList.add(
                                "hidden"
                            );
                        }
                    );

                    reportViews[
                        currentReportView
                    ].classList.remove(
                        "hidden"
                    );

                    renderReports();
                }
            );
        }
    );


    /* =====================================================
       DATE NAVIGATION
       ===================================================== */

    previousReportDate.addEventListener(
        "click",
        function () {

            reportDate.setDate(
                reportDate.getDate() - 1
            );

            renderReports();
        }
    );


    nextReportDate.addEventListener(
        "click",
        function () {

            reportDate.setDate(
                reportDate.getDate() + 1
            );

            renderReports();
        }
    );


    reportTodayButton.addEventListener(
        "click",
        function () {

            reportDate =
                new Date();

            reportDate.setHours(
                0,
                0,
                0,
                0
            );

            renderReports();
        }
    );


    /* =====================================================
       DAILY REPORT
       ===================================================== */

    function renderDailyReport() {

        const targetDate =
            dateToString(reportDate);

        const history =
            getHealthHistory()
                .filter(
                    function (entry) {

                        return (
                            entry.date ===
                            targetDate
                        );
                    }
                )
                .sort(
                    function (a, b) {

                        return (
                            (a.time || "")
                                .localeCompare(
                                    b.time || ""
                                )
                        );
                    }
                );


        /* Latest BP */

        const bloodPressureEntries =
            history.filter(
                function (entry) {

                    return (
                        entry.type ===
                        "bloodPressure"
                    );
                }
            );


        const latestBP =
            bloodPressureEntries[
                bloodPressureEntries.length - 1
            ];


        document.getElementById(
            "dailyBloodPressure"
        ).textContent =
            latestBP
                ? `${latestBP.systolic}/${latestBP.diastolic}`
                : "--";


        /* Latest glucose */

        const bloodSugarEntries =
            history.filter(
                function (entry) {

                    return (
                        entry.type ===
                        "bloodSugar"
                    );
                }
            );


        const latestGlucose =
            bloodSugarEntries[
                bloodSugarEntries.length - 1
            ];


        document.getElementById(
            "dailyBloodSugar"
        ).textContent =
            latestGlucose
                ? latestGlucose.value
                : "--";


        /* Water */

        const waterTotal =
            history
                .filter(
                    entry =>
                        entry.type ===
                        "water"
                )
                .reduce(
                    (total, entry) =>
                        total +
                        Number(
                            entry.value || 0
                        ),
                    0
                );


        document.getElementById(
            "dailyWater"
        ).textContent =
            waterTotal;


        /* Activity */

        const activityTotal =
            history
                .filter(
                    entry =>
                        entry.type ===
                        "activity"
                )
                .reduce(
                    (total, entry) =>
                        total +
                        Number(
                            entry.value || 0
                        ),
                    0
                );


        document.getElementById(
            "dailyActivity"
        ).textContent =
            activityTotal;


        /* Sleep - latest entry */

        const sleepEntries =
            history.filter(
                entry =>
                    entry.type ===
                    "sleep"
            );


        const latestSleep =
            sleepEntries[
                sleepEntries.length - 1
            ];


        document.getElementById(
            "dailySleep"
        ).textContent =
            latestSleep
                ? latestSleep.value
                : "--";


        /* Meals */

        /*
         * Earlier versions of the dashboard may
         * store meals separately from health history.
         * We count meal history entries if present.
         */

        const mealEntries =
            history.filter(
                entry =>
                    entry.type ===
                    "meal"
            );


        document.getElementById(
            "dailyMeals"
        ).textContent =
            mealEntries.length;


        renderDailyTimeline(
            history
        );
    }


    /* =====================================================
       DAILY TIMELINE
       ===================================================== */

    function renderDailyTimeline(history) {

        const container =
            document.getElementById(
                "dailyTimeline"
            );


        if (
            history.length === 0
        ) {

            container.innerHTML = `

                <div class="empty-dashboard-state">

                    <span class="empty-icon">
                        ▥
                    </span>

                    <p>
                        No health records for this day.
                    </p>

                </div>

            `;

            return;
        }


        container.innerHTML =
            history
                .map(
                    function (entry) {

                        const display =
                            getEntryDisplay(
                                entry
                            );

                        return `

                            <article class="report-timeline-item">

                                <div class="report-timeline-icon">
                                    ${display.icon}
                                </div>

                                <div>

                                    <div class="report-timeline-title">
                                        ${escapeHTML(
                                            display.title
                                        )}
                                    </div>

                                    <div class="report-timeline-description">
                                        ${escapeHTML(
                                            display.description
                                        )}
                                    </div>

                                    <div class="report-timeline-time">
                                        ${escapeHTML(
                                            formatTime(
                                                entry.time
                                            )
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
       DISPLAY HEALTH ENTRY
       ===================================================== */

    function getEntryDisplay(entry) {

        switch (entry.type) {

            case "bloodPressure":

                return {
                    icon: "♥",
                    title:
                        "Blood Pressure",
                    description:
                        `${entry.systolic}/${entry.diastolic} mmHg`
                };


            case "bloodSugar":

                return {
                    icon: "+",
                    title:
                        "Blood Sugar",
                    description:
                        `${entry.value} mg/dL${
                            entry.context
                                ? " • " +
                                  entry.context
                                : ""
                        }`
                };


            case "water":

                return {
                    icon: "◉",
                    title:
                        "Water",
                    description:
                        `${entry.value} ${
                            Number(entry.value) === 1
                                ? "glass"
                                : "glasses"
                        }`
                };


            case "activity":

                return {
                    icon: "↗",
                    title:
                        "Activity",
                    description:
                        `${entry.value} minutes${
                            entry.description
                                ? " • " +
                                  entry.description
                                : ""
                        }`
                };


            case "sleep":

                return {
                    icon: "☾",
                    title:
                        "Sleep",
                    description:
                        `${entry.value} hours`
                };


            case "meal":

                return {
                    icon: "◉",
                    title:
                        "Meal",
                    description:
                        entry.description ||
                        "Meal recorded"
                };


            default:

                return {
                    icon: "•",
                    title:
                        "Health Record",
                    description:
                        "Health information recorded"
                };
        }
    }


    /* =====================================================
       VITAL FILTER BUTTONS
       ===================================================== */

    vitalFilters.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    selectedVitalType =
                        button.dataset.vitalType;

                    vitalFilters.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );
                        }
                    );

                    button.classList.add(
                        "active"
                    );

                    renderVitalsReport();
                }
            );
        }
    );


    /* =====================================================
       VITALS REPORT
       ===================================================== */

    function renderVitalsReport() {

        const readings =
            getHealthHistory()
                .filter(
                    entry =>
                        entry.type ===
                        selectedVitalType
                )
                .sort(
                    function (a, b) {

                        const first =
                            `${a.date || ""} ${a.time || ""}`;

                        const second =
                            `${b.date || ""} ${b.time || ""}`;

                        return first.localeCompare(
                            second
                        );
                    }
                );


        if (
            selectedVitalType ===
            "bloodPressure"
        ) {

            renderBloodPressureStats(
                readings
            );

        } else {

            renderBloodSugarStats(
                readings
            );
        }


        renderVitalHistory(
            readings
        );
    }


    /* =====================================================
       BLOOD PRESSURE STATISTICS
       ===================================================== */

    function renderBloodPressureStats(
        readings
    ) {

        document.getElementById(
            "trendHeading"
        ).textContent =
            "Blood Pressure History";


        if (
            readings.length === 0
        ) {

            setEmptyVitalStats();

            renderEmptyTrend();

            return;
        }


        const systolic =
            readings.map(
                entry =>
                    Number(
                        entry.systolic
                    )
            );


        const diastolic =
            readings.map(
                entry =>
                    Number(
                        entry.diastolic
                    )
            );


        const latest =
            readings[
                readings.length - 1
            ];


        document.getElementById(
            "vitalLatest"
        ).textContent =
            `${latest.systolic}/${latest.diastolic}`;


        document.getElementById(
            "vitalAverage"
        ).textContent =
            `${average(systolic)}/${average(diastolic)}`;


        /*
         * For BP, highest and lowest preserve
         * the two components instead of treating
         * 120/80 as one number.
         */

        document.getElementById(
            "vitalHighest"
        ).textContent =
            `${Math.max(...systolic)}/${Math.max(...diastolic)}`;


        document.getElementById(
            "vitalLowest"
        ).textContent =
            `${Math.min(...systolic)}/${Math.min(...diastolic)}`;


        renderBloodPressureTrend(
            readings
        );
    }


    /* =====================================================
       BLOOD SUGAR STATISTICS
       ===================================================== */

    function renderBloodSugarStats(
        readings
    ) {

        document.getElementById(
            "trendHeading"
        ).textContent =
            "Blood Sugar History";


        if (
            readings.length === 0
        ) {

            setEmptyVitalStats();

            renderEmptyTrend();

            return;
        }


        const values =
            readings.map(
                entry =>
                    Number(
                        entry.value
                    )
            );


        const latest =
            values[
                values.length - 1
            ];


        document.getElementById(
            "vitalLatest"
        ).textContent =
            `${latest} mg/dL`;


        document.getElementById(
            "vitalAverage"
        ).textContent =
            `${average(values)} mg/dL`;


        document.getElementById(
            "vitalHighest"
        ).textContent =
            `${Math.max(...values)} mg/dL`;


        document.getElementById(
            "vitalLowest"
        ).textContent =
            `${Math.min(...values)} mg/dL`;


        renderBloodSugarTrend(
            readings
        );
    }


    /* =====================================================
       AVERAGE
       ===================================================== */

    function average(values) {

        if (
            values.length === 0
        ) {
            return 0;
        }

        const total =
            values.reduce(
                (sum, value) =>
                    sum + Number(value),
                0
            );

        return Math.round(
            total / values.length
        );
    }


    /* =====================================================
       EMPTY VITALS
       ===================================================== */

    function setEmptyVitalStats() {

        [
            "vitalLatest",
            "vitalAverage",
            "vitalHighest",
            "vitalLowest"
        ].forEach(
            function (id) {

                document.getElementById(
                    id
                ).textContent = "--";
            }
        );
    }


    function renderEmptyTrend() {

        document.getElementById(
            "trendChart"
        ).innerHTML = `

            <div class="empty-dashboard-state">

                <span class="empty-icon">
                    ↗
                </span>

                <p>
                    Record readings to build
                    your health trend.
                </p>

            </div>

        `;
    }


    /* =====================================================
       BP TREND
       ===================================================== */

    function renderBloodPressureTrend(
        readings
    ) {

        const container =
            document.getElementById(
                "trendChart"
            );


        /*
         * Keep the latest ten readings so the
         * mobile chart remains readable.
         */

        const displayReadings =
            readings.slice(-10);


        const allValues =
            displayReadings.flatMap(
                entry => [
                    Number(
                        entry.systolic
                    ),
                    Number(
                        entry.diastolic
                    )
                ]
            );


        const maximum =
            Math.max(
                ...allValues,
                1
            );


        container.innerHTML =
            displayReadings
                .map(
                    function (entry) {

                        const systolicHeight =
                            Math.max(
                                5,
                                (
                                    Number(
                                        entry.systolic
                                    ) /
                                    maximum
                                ) * 100
                            );


                        const diastolicHeight =
                            Math.max(
                                5,
                                (
                                    Number(
                                        entry.diastolic
                                    ) /
                                    maximum
                                ) * 100
                            );


                        return `

                            <div class="trend-column">

                                <span class="trend-value">
                                    ${entry.systolic}/${entry.diastolic}
                                </span>


                                <div class="bp-trend-bars">

                                    <div
                                        class="bp-trend-bar systolic"
                                        style="
                                            height:
                                            ${systolicHeight}%;
                                        "
                                    ></div>


                                    <div
                                        class="bp-trend-bar diastolic"
                                        style="
                                            height:
                                            ${diastolicHeight}%;
                                        "
                                    ></div>

                                </div>


                                <span class="trend-date">
                                    ${escapeHTML(
                                        formatShortDate(
                                            entry.date
                                        )
                                    )}
                                </span>

                            </div>

                        `;
                    }
                )
                .join("");
    }


    /* =====================================================
       BLOOD SUGAR TREND
       ===================================================== */

    function renderBloodSugarTrend(
        readings
    ) {

        const container =
            document.getElementById(
                "trendChart"
            );


        const displayReadings =
            readings.slice(-10);


        const maximum =
            Math.max(
                ...displayReadings.map(
                    entry =>
                        Number(
                            entry.value
                        )
                ),
                1
            );


        container.innerHTML =
            displayReadings
                .map(
                    function (entry) {

                        const height =
                            Math.max(
                                5,
                                (
                                    Number(
                                        entry.value
                                    ) /
                                    maximum
                                ) * 100
                            );


                        return `

                            <div class="trend-column">

                                <span class="trend-value">
                                    ${entry.value}
                                </span>


                                <div class="trend-bar-area">

                                    <div
                                        class="trend-bar"
                                        style="
                                            height:
                                            ${height}%;
                                        "
                                    ></div>

                                </div>


                                <span class="trend-date">
                                    ${escapeHTML(
                                        formatShortDate(
                                            entry.date
                                        )
                                    )}
                                </span>

                            </div>

                        `;
                    }
                )
                .join("");
    }


    /* =====================================================
       VITAL HISTORY
       ===================================================== */

    function renderVitalHistory(
        readings
    ) {

        const container =
            document.getElementById(
                "vitalHistoryList"
            );


        if (
            readings.length === 0
        ) {

            container.innerHTML = `

                <div class="report-no-data">
                    No readings recorded yet.
                </div>

            `;

            return;
        }


        const newestFirst =
            [...readings]
                .reverse();


        container.innerHTML =
            newestFirst
                .map(
                    function (entry) {

                        let value;
                        let context = "";


                        if (
                            entry.type ===
                            "bloodPressure"
                        ) {

                            value =
                                `${entry.systolic}/${entry.diastolic} mmHg`;

                        } else {

                            value =
                                `${entry.value} mg/dL`;

                            context =
                                entry.context || "";
                        }


                        return `

                            <article class="vital-history-item">

                                <div class="vital-history-main">

                                    <div class="vital-history-value">
                                        ${escapeHTML(
                                            value
                                        )}
                                    </div>

                                    ${
                                        context
                                            ? `
                                                <div class="vital-history-context">
                                                    ${escapeHTML(
                                                        context
                                                    )}
                                                </div>
                                              `
                                            : ""
                                    }

                                </div>


                                <div class="vital-history-date">

                                    ${escapeHTML(
                                        formatDate(
                                            entry.date
                                        )
                                    )}

                                    <br>

                                    ${escapeHTML(
                                        formatTime(
                                            entry.time
                                        )
                                    )}

                                </div>

                            </article>

                        `;
                    }
                )
                .join("");
    }


    /* =====================================================
       OVERVIEW
       ===================================================== */

    function renderOverview() {

        const healthHistory =
            getHealthHistory();

        const tasks =
            getTasks();

        const events =
            getEvents();

        const activities =
            getActivities();


        /* Total health records */

        document.getElementById(
            "totalHealthRecords"
        ).textContent =
            healthHistory.length;


        /* Completed tasks */

        const completedTasks =
            tasks.filter(
                function (task) {

                    return (
                        String(
                            task.status || ""
                        ).toLowerCase() ===
                        "completed"
                    );
                }
            );


        document.getElementById(
            "completedTaskTotal"
        ).textContent =
            completedTasks.length;


        /* Events */

        document.getElementById(
            "eventTotal"
        ).textContent =
            events.length;


        /* Activity minutes */

        const activityMinutes =
            healthHistory
                .filter(
                    entry =>
                        entry.type ===
                        "activity"
                )
                .reduce(
                    (total, entry) =>
                        total +
                        Number(
                            entry.value || 0
                        ),
                    0
                );


        document.getElementById(
            "activityMinutesTotal"
        ).textContent =
            activityMinutes;


        renderOverviewSummary(
            healthHistory,
            tasks,
            events,
            activities
        );
    }


    /* =====================================================
       OVERVIEW SUMMARY LIST
       ===================================================== */

    function renderOverviewSummary(
        healthHistory,
        tasks,
        events,
        activities
    ) {

        const container =
            document.getElementById(
                "overviewSummaryList"
            );


        const summaries = [];


        /* Blood pressure */

        const bpReadings =
            healthHistory.filter(
                entry =>
                    entry.type ===
                    "bloodPressure"
            );


        if (
            bpReadings.length > 0
        ) {

            const latest =
                bpReadings[
                    bpReadings.length - 1
                ];

            summaries.push({
                icon: "♥",
                title:
                    "Latest Blood Pressure",
                description:
                    `${latest.systolic}/${latest.diastolic} mmHg • ${formatDate(latest.date)}`
            });
        }


        /* Blood sugar */

        const glucoseReadings =
            healthHistory.filter(
                entry =>
                    entry.type ===
                    "bloodSugar"
            );


        if (
            glucoseReadings.length > 0
        ) {

            const latest =
                glucoseReadings[
                    glucoseReadings.length - 1
                ];

            summaries.push({
                icon: "+",
                title:
                    "Latest Blood Sugar",
                description:
                    `${latest.value} mg/dL${
                        latest.context
                            ? " • " +
                              latest.context
                            : ""
                    }`
            });
        }


        /* Tasks */

        summaries.push({
            icon: "✓",
            title:
                "Care Tasks",
            description:
                `${tasks.length} total • ${
                    tasks.filter(
                        task =>
                            String(
                                task.status || ""
                            ).toLowerCase() ===
                            "completed"
                    ).length
                } completed`
        });


        /* Events */

        summaries.push({
            icon: "◷",
            title:
                "Care Events",
            description:
                `${events.length} event${
                    events.length === 1
                        ? ""
                        : "s"
                } recorded`
        });


        /* Recent activity */

        if (
            activities.length > 0
        ) {

            const latestActivity =
                activities[0];

            summaries.push({
                icon:
                    latestActivity.icon ||
                    "•",
                title:
                    latestActivity.title ||
                    "Recent Activity",
                description:
                    latestActivity.description ||
                    "CareCircle activity"
            });
        }


        container.innerHTML =
            summaries
                .map(
                    function (summary) {

                        return `

                            <article class="overview-summary-item">

                                <div class="overview-summary-icon">
                                    ${escapeHTML(
                                        summary.icon
                                    )}
                                </div>


                                <div class="overview-summary-content">

                                    <div class="overview-summary-title">
                                        ${escapeHTML(
                                            summary.title
                                        )}
                                    </div>

                                    <div class="overview-summary-description">
                                        ${escapeHTML(
                                            summary.description
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
       RECORD HEALTH DATA
       ===================================================== */

    function goToRecordVitals() {

        window.location.href =
            "dashboard.html?action=vitals";
    }


    reportsRecordVitals.addEventListener(
        "click",
        goToRecordVitals
    );


    reportsQuickAdd.addEventListener(
        "click",
        goToRecordVitals
    );


    /* =====================================================
       PROFILE
       ===================================================== */

    reportsProfileButton.addEventListener(
        "click",
        function () {

            window.location.href =
                "patient-setup.html";
        }
    );


    /* =====================================================
       MAIN RENDER
       ===================================================== */

    function renderReports() {

        updateDateHeading();

        renderDailyReport();

        renderVitalsReport();

        renderOverview();
    }


    /* =====================================================
       URL ACTION

       reports.html?view=vitals
       ===================================================== */

    const parameters =
        new URLSearchParams(
            window.location.search
        );


    if (
        parameters.get("view") ===
        "vitals"
    ) {

        currentReportView =
            "vitals";


        reportTabs.forEach(
            function (tab) {

                tab.classList.toggle(
                    "active",
                    tab.dataset.reportView ===
                        "vitals"
                );
            }
        );


        Object.values(
            reportViews
        ).forEach(
            function (view) {

                view.classList.add(
                    "hidden"
                );
            }
        );


        reportViews.vitals.classList.remove(
            "hidden"
        );
    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    renderReports();

});