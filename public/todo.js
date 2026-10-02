/* =========================================================
   CARECIRCLE
   TODO MANAGEMENT
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTS
       ===================================================== */

    const todoList =
        document.getElementById("todoList");

    const taskModal =
        document.getElementById("taskModal");

    const taskDetailsModal =
        document.getElementById("taskDetailsModal");

    const taskForm =
        document.getElementById("taskForm");

    const addTaskButton =
        document.getElementById("addTaskButton");

    const todoQuickAdd =
        document.getElementById("todoQuickAdd");

    const closeTaskModal =
        document.getElementById("closeTaskModal");

    const cancelTaskButton =
        document.getElementById("cancelTaskButton");

    const closeTaskDetails =
        document.getElementById("closeTaskDetails");

    const editTaskButton =
        document.getElementById("editTaskButton");

    const deleteTaskButton =
        document.getElementById("deleteTaskButton");

    const taskModalTitle =
        document.getElementById("taskModalTitle");

    const taskDetailsTitle =
        document.getElementById("taskDetailsTitle");

    const taskDetailsContent =
        document.getElementById("taskDetailsContent");

    const filters =
        document.querySelectorAll(".todo-filter");


    let currentFilter = "all";

    let selectedTaskId = null;


    /* =====================================================
       LOCAL STORAGE
       ===================================================== */

    function getTasks() {

        const saved =
            localStorage.getItem("careCircleTasks");

        if (!saved) {
            return [];
        }

        try {

            const tasks = JSON.parse(saved);

            return Array.isArray(tasks)
                ? tasks
                : [];

        } catch (error) {

            console.error(
                "Unable to load CareCircle tasks:",
                error
            );

            return [];
        }

    }


    function saveTasks(tasks) {

        localStorage.setItem(
            "careCircleTasks",
            JSON.stringify(tasks)
        );

    }


    /* =====================================================
       DATE HELPERS
       ===================================================== */

    function getTodayString() {

        const today = new Date();

        const year =
            today.getFullYear();

        const month =
            String(
                today.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                today.getDate()
            ).padStart(2, "0");


        return `${year}-${month}-${day}`;

    }


    function isToday(task) {

        return (
            task.date ===
            getTodayString()
        );

    }


    function isOverdue(task) {

        if (!task.date) {
            return false;
        }

        if (
            task.status === "Completed" ||
            task.status === "Missed"
        ) {
            return false;
        }

        return (
            task.date <
            getTodayString()
        );

    }


    /* =====================================================
       DISPLAY STATUS
       ===================================================== */

    function getDisplayStatus(task) {

        if (task.status === "Completed") {
            return "Completed";
        }

        if (task.status === "Missed") {
            return "Missed";
        }

        if (isOverdue(task)) {
            return "Overdue";
        }

        return "Pending";

    }


    /* =====================================================
       TASK ICON
       ===================================================== */

    function getTaskIcon(type) {

        switch (type) {

            case "Medication":
                return "+";

            case "Appointment":
                return "◷";

            case "Meal":
                return "◉";

            case "Exercise":
                return "↗";

            case "Personal Care":
                return "♡";

            default:
                return "✓";
        }

    }


    function getTaskTypeClass(type) {

        return String(type || "General")
            .toLowerCase()
            .replaceAll(" ", "-");

    }


    /* =====================================================
       FORMAT DATE
       ===================================================== */

    function formatDate(dateString) {

        if (!dateString) {
            return "No date";
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
            return dateString;
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


    /* =====================================================
       FORMAT TIME
       ===================================================== */

    function formatTime(time) {

        if (!time) {
            return "No time";
        }


        const parts =
            time.split(":");


        let hours =
            Number(parts[0]);

        const minutes =
            parts[1];

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


    /* =====================================================
       SORT TASKS

       Earliest date/time appears first.
       ===================================================== */

    function sortTasks(tasks) {

        return [...tasks].sort(
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
       FILTER TASKS
       ===================================================== */

    function filterTasks(tasks) {

        switch (currentFilter) {

            case "today":

                return tasks.filter(
                    function (task) {

                        return (
                            isToday(task) &&
                            task.status !==
                                "Completed"
                        );

                    }
                );


            case "overdue":

                return tasks.filter(
                    function (task) {

                        return isOverdue(task);

                    }
                );


            case "completed":

                return tasks.filter(
                    function (task) {

                        return (
                            task.status ===
                            "Completed"
                        );

                    }
                );


            default:

                return tasks;
        }

    }


    /* =====================================================
       RENDER TASKS
       ===================================================== */

    function renderTasks() {

        const tasks =
            sortTasks(
                getTasks()
            );


        updateCounters(tasks);

        updateTaskHeading();


        const filtered =
            filterTasks(tasks);


        if (filtered.length === 0) {

            todoList.innerHTML = `

                <div class="empty-dashboard-state">

                    <span class="empty-icon">
                        ✓
                    </span>

                    <p>
                        No tasks found in this section.
                    </p>

                </div>

            `;

            return;
        }


        todoList.innerHTML =
            filtered
                .map(
                    function (task) {

                        const status =
                            getDisplayStatus(task);

                        const typeClass =
                            getTaskTypeClass(
                                task.type
                            );


                        let cardClass =
                            "todo-card";


                        if (
                            task.status ===
                            "Completed"
                        ) {
                            cardClass +=
                                " completed";
                        }


                        if (isOverdue(task)) {

                            cardClass +=
                                " overdue";

                        } else if (
                            isToday(task) &&
                            task.status !==
                                "Completed"
                        ) {

                            cardClass +=
                                " today";

                        }


                        return `

                            <article
                                class="${cardClass}"
                                data-task-id="${task.id}"
                                tabindex="0"
                            >

                                <div
                                    class="
                                        todo-type-icon
                                        ${typeClass}
                                    "
                                >
                                    ${escapeHTML(
                                        getTaskIcon(
                                            task.type
                                        )
                                    )}
                                </div>


                                <div class="todo-card-content">

                                    <div class="todo-card-top">

                                        <h3 class="todo-card-title">
                                            ${escapeHTML(
                                                task.title
                                            )}
                                        </h3>


                                        <span
                                            class="
                                                todo-status
                                                ${status.toLowerCase()}
                                            "
                                        >
                                            ${escapeHTML(
                                                status
                                            )}
                                        </span>

                                    </div>


                                    <p class="todo-card-type">
                                        ${escapeHTML(
                                            task.type
                                        )}
                                    </p>


                                    <div class="todo-card-details">

                                        <span class="todo-card-detail">
                                            ◷
                                            ${escapeHTML(
                                                formatDate(
                                                    task.date
                                                )
                                            )}
                                        </span>


                                        <span class="todo-card-detail">
                                            ${escapeHTML(
                                                formatTime(
                                                    task.time
                                                )
                                            )}
                                        </span>


                                        ${
                                            task.assignedTo
                                                ? `
                                                    <span
                                                        class="
                                                            todo-card-detail
                                                        "
                                                    >
                                                        👤
                                                        ${escapeHTML(
                                                            task.assignedTo
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


        attachTaskListeners();

    }


    /* =====================================================
       COUNTERS
       ===================================================== */

    function updateCounters(tasks) {

        const pending =
            tasks.filter(
                function (task) {

                    return (
                        task.status ===
                        "Pending"
                    );

                }
            ).length;


        const today =
            tasks.filter(
                function (task) {

                    return (
                        isToday(task) &&
                        task.status !==
                            "Completed"
                    );

                }
            ).length;


        const overdue =
            tasks.filter(
                function (task) {

                    return isOverdue(task);

                }
            ).length;


        const completed =
            tasks.filter(
                function (task) {

                    return (
                        task.status ===
                        "Completed"
                    );

                }
            ).length;


        document
            .getElementById(
                "pendingCount"
            )
            .textContent = pending;


        document
            .getElementById(
                "todayCount"
            )
            .textContent = today;


        document
            .getElementById(
                "overdueCount"
            )
            .textContent = overdue;


        document
            .getElementById(
                "completedCount"
            )
            .textContent = completed;

    }


    /* =====================================================
       FILTER HEADING
       ===================================================== */

    function updateTaskHeading() {

        const heading =
            document.getElementById(
                "taskListHeading"
            );


        const headings = {

            all: "All Tasks",

            today: "Today's Tasks",

            overdue: "Overdue Tasks",

            completed:
                "Completed Tasks"

        };


        heading.textContent =
            headings[currentFilter];

    }


    /* =====================================================
       FILTER BUTTONS
       ===================================================== */

    filters.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    filters.forEach(
                        function (item) {

                            item.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    currentFilter =
                        button.dataset.filter;


                    renderTasks();

                }
            );

        }
    );


    /* =====================================================
       OPEN ADD TASK MODAL
       ===================================================== */

    function openAddTaskModal() {

        taskForm.reset();

        document
            .getElementById("taskId")
            .value = "";


        document
            .getElementById(
                "taskStatus"
            )
            .value = "Pending";


        document
            .getElementById(
                "taskDate"
            )
            .value =
                getTodayString();


        taskModalTitle.textContent =
            "Add New Task";


        taskModal.classList.remove(
            "hidden"
        );


        document.body.style.overflow =
            "hidden";

    }


    /* =====================================================
       CLOSE TASK MODAL
       ===================================================== */

    function closeTaskForm() {

        taskModal.classList.add(
            "hidden"
        );

        document.body.style.overflow =
            "";

    }


    addTaskButton.addEventListener(
        "click",
        openAddTaskModal
    );


    todoQuickAdd.addEventListener(
        "click",
        openAddTaskModal
    );


    closeTaskModal.addEventListener(
        "click",
        closeTaskForm
    );


    cancelTaskButton.addEventListener(
        "click",
        closeTaskForm
    );


    taskModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                taskModal
            ) {
                closeTaskForm();
            }

        }
    );


    /* =====================================================
       SAVE TASK
       ===================================================== */

    taskForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            const taskId =
                document
                    .getElementById(
                        "taskId"
                    )
                    .value;


            const task = {

                id:
                    taskId
                        ? Number(taskId)
                        : Date.now(),

                type:
                    document
                        .getElementById(
                            "taskType"
                        )
                        .value,

                title:
                    document
                        .getElementById(
                            "taskTitle"
                        )
                        .value
                        .trim(),

                date:
                    document
                        .getElementById(
                            "taskDate"
                        )
                        .value,

                time:
                    document
                        .getElementById(
                            "taskTime"
                        )
                        .value,

                assignedTo:
                    document
                        .getElementById(
                            "assignedTo"
                        )
                        .value
                        .trim(),

                assignedBy:
                    document
                        .getElementById(
                            "assignedBy"
                        )
                        .value
                        .trim(),

                notes:
                    document
                        .getElementById(
                            "taskNotes"
                        )
                        .value
                        .trim(),

                status:
                    document
                        .getElementById(
                            "taskStatus"
                        )
                        .value,

                updatedAt:
                    new Date()
                        .toISOString()

            };


            let tasks =
                getTasks();


            if (taskId) {

                tasks =
                    tasks.map(
                        function (existing) {

                            if (
                                Number(existing.id) ===
                                Number(taskId)
                            ) {

                                return {
                                    ...existing,
                                    ...task
                                };

                            }

                            return existing;

                        }
                    );


                addActivity(
                    "Task updated",
                    task.title,
                    "✓"
                );

            } else {

                task.createdAt =
                    new Date()
                        .toISOString();


                tasks.push(task);


                addActivity(
                    "Task added",
                    task.title,
                    "✓"
                );

            }


            saveTasks(tasks);

            syncAttentionItems();

            closeTaskForm();

            renderTasks();

    });


    /* =====================================================
       TASK CARD LISTENERS
       ===================================================== */

    function attachTaskListeners() {

        const cards =
            document.querySelectorAll(
                ".todo-card"
            );


        cards.forEach(
            function (card) {

                card.addEventListener(
                    "click",
                    function () {

                        openTaskDetails(
                            Number(
                                card.dataset.taskId
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

                            openTaskDetails(
                                Number(
                                    card.dataset.taskId
                                )
                            );

                        }

                    }
                );

            }
        );

    }


    /* =====================================================
       OPEN TASK DETAILS
       ===================================================== */

    function openTaskDetails(taskId) {

        const tasks =
            getTasks();


        const task =
            tasks.find(
                function (item) {

                    return (
                        Number(item.id) ===
                        Number(taskId)
                    );

                }
            );


        if (!task) {
            return;
        }


        selectedTaskId =
            task.id;


        taskDetailsTitle.textContent =
            task.title;


        const displayStatus =
            getDisplayStatus(task);


        taskDetailsContent.innerHTML = `

            <div class="task-detail-row">

                <div class="task-detail-label">
                    Type
                </div>

                <div class="task-detail-value">
                    ${escapeHTML(task.type)}
                </div>

            </div>


            <div class="task-detail-row">

                <div class="task-detail-label">
                    Status
                </div>

                <div class="task-detail-value">
                    ${escapeHTML(
                        displayStatus
                    )}
                </div>

            </div>


            <div class="task-detail-row">

                <div class="task-detail-label">
                    Date
                </div>

                <div class="task-detail-value">
                    ${escapeHTML(
                        formatDate(
                            task.date
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
                            task.time
                        )
                    )}
                </div>

            </div>


            <div class="task-detail-row">

                <div class="task-detail-label">
                    Assigned To
                </div>

                <div class="task-detail-value">
                    ${escapeHTML(
                        task.assignedTo ||
                        "Not assigned"
                    )}
                </div>

            </div>


            <div class="task-detail-row">

                <div class="task-detail-label">
                    Assigned By
                </div>

                <div class="task-detail-value">
                    ${escapeHTML(
                        task.assignedBy ||
                        "Not provided"
                    )}
                </div>

            </div>


            <div class="task-detail-row">

                <div class="task-detail-label">
                    Notes
                </div>

                <div class="task-detail-value">
                    ${escapeHTML(
                        task.notes ||
                        "No additional notes"
                    )}
                </div>

            </div>

        `;


        taskDetailsModal.classList.remove(
            "hidden"
        );


        document.body.style.overflow =
            "hidden";

    }


    /* =====================================================
       CLOSE DETAILS
       ===================================================== */

    function closeDetails() {

        taskDetailsModal.classList.add(
            "hidden"
        );

        document.body.style.overflow =
            "";

        selectedTaskId = null;

    }


    closeTaskDetails.addEventListener(
        "click",
        closeDetails
    );


    taskDetailsModal.addEventListener(
        "click",
        function (event) {

            if (
                event.target ===
                taskDetailsModal
            ) {
                closeDetails();
            }

        }
    );


    /* =====================================================
       EDIT TASK
       ===================================================== */

    editTaskButton.addEventListener(
        "click",
        function () {

            if (
                selectedTaskId === null
            ) {
                return;
            }


            const tasks =
                getTasks();


            const task =
                tasks.find(
                    function (item) {

                        return (
                            Number(item.id) ===
                            Number(selectedTaskId)
                        );

                    }
                );


            if (!task) {
                return;
            }


            const editingId =
                task.id;


            closeDetails();


            document
                .getElementById(
                    "taskId"
                )
                .value =
                    editingId;


            document
                .getElementById(
                    "taskType"
                )
                .value =
                    task.type;


            document
                .getElementById(
                    "taskTitle"
                )
                .value =
                    task.title;


            document
                .getElementById(
                    "taskDate"
                )
                .value =
                    task.date;


            document
                .getElementById(
                    "taskTime"
                )
                .value =
                    task.time || "";


            document
                .getElementById(
                    "assignedTo"
                )
                .value =
                    task.assignedTo || "";


            document
                .getElementById(
                    "assignedBy"
                )
                .value =
                    task.assignedBy || "";


            document
                .getElementById(
                    "taskNotes"
                )
                .value =
                    task.notes || "";


            document
                .getElementById(
                    "taskStatus"
                )
                .value =
                    task.status;


            taskModalTitle.textContent =
                "Edit Task";


            taskModal.classList.remove(
                "hidden"
            );


            document.body.style.overflow =
                "hidden";

        }
    );


    /* =====================================================
       DELETE TASK
       ===================================================== */

    deleteTaskButton.addEventListener(
        "click",
        function () {

            if (
                selectedTaskId === null
            ) {
                return;
            }


            const tasks =
                getTasks();


            const task =
                tasks.find(
                    function (item) {

                        return (
                            Number(item.id) ===
                            Number(selectedTaskId)
                        );

                    }
                );


            if (!task) {
                return;
            }


            const confirmed =
                window.confirm(
                    "Delete \"" +
                    task.title +
                    "\"?"
                );


            if (!confirmed) {
                return;
            }


            const updated =
                tasks.filter(
                    function (item) {

                        return (
                            Number(item.id) !==
                            Number(selectedTaskId)
                        );

                    }
                );


            saveTasks(updated);


            addActivity(
                "Task deleted",
                task.title,
                "✓"
            );


            closeDetails();

            syncAttentionItems();

            renderTasks();

        }
    );


    /* =====================================================
       DASHBOARD ATTENTION

       Overdue and missed tasks are copied into the
       dashboard's Requires Attention data.
       ===================================================== */

    function syncAttentionItems() {

        const tasks =
            getTasks();


        const attention =
            tasks
                .filter(
                    function (task) {

                        return (
                            isOverdue(task) ||
                            task.status ===
                                "Missed"
                        );

                    }
                )
                .map(
                    function (task) {

                        const missed =
                            task.status ===
                            "Missed";


                        return {

                            id:
                                "task-" +
                                task.id,

                            title:
                                missed
                                    ? "Missed: " +
                                      task.title
                                    : "Overdue: " +
                                      task.title,

                            description:
                                task.type +
                                " • " +
                                formatDate(
                                    task.date
                                ),

                            urgent: true,

                            source:
                                "task",

                            taskId:
                                task.id

                        };

                    }
                );


        localStorage.setItem(
            "careCircleAttention",
            JSON.stringify(attention)
        );

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

            id: Date.now(),

            title: title,

            description: description,

            icon: icon,

            createdAt:
                new Date()
                    .toISOString()

        });


        if (activities.length > 50) {
            activities.length = 50;
        }


        localStorage.setItem(
            "careCircleActivities",
            JSON.stringify(activities)
        );

    }


    /* =====================================================
       PROFILE BUTTON
       ===================================================== */

    const profileButton =
        document.getElementById(
            "todoProfileButton"
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

            if (event.key === "Escape") {

                closeTaskForm();

                closeDetails();

            }

        }
    );


    /* =====================================================
       DASHBOARD QUICK ADD SUPPORT

       dashboard.html sends:
       todo.html?action=new
       ===================================================== */

    const parameters =
        new URLSearchParams(
            window.location.search
        );


    if (
        parameters.get("action") ===
        "new"
    ) {

        openAddTaskModal();

    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    syncAttentionItems();

    renderTasks();

});