/* =========================================================
   CARECIRCLE MYMAP
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =================================================
           ELEMENTS
           ================================================= */

        const recipientMapMarker =
            document.getElementById(
                "recipientMapMarker"
            );

        const caregiverMapMarker =
            document.getElementById(
                "caregiverMapMarker"
            );

        const mapRecipientName =
            document.getElementById(
                "mapRecipientName"
            );

        const mapCaregiverName =
            document.getElementById(
                "mapCaregiverName"
            );

        const selectedPersonName =
            document.getElementById(
                "selectedPersonName"
            );

        const selectedPersonStatus =
            document.getElementById(
                "selectedPersonStatus"
            );

        const selectedDistance =
            document.getElementById(
                "selectedDistance"
            );

        const selectedETA =
            document.getElementById(
                "selectedETA"
            );

        const selectedLastUpdate =
            document.getElementById(
                "selectedLastUpdate"
            );

        const selectedTask =
            document.getElementById(
                "selectedTask"
            );

        const mapMemberList =
            document.getElementById(
                "mapMemberList"
            );

        const mapMemberCount =
            document.getElementById(
                "mapMemberCount"
            );

        const refreshMapButton =
            document.getElementById(
                "refreshMapButton"
            );

        const mapProfileButton =
            document.getElementById(
                "mapProfileButton"
            );


        /* =================================================
           STORAGE
           ================================================= */

        function getRegistration() {

            const saved =
                localStorage.getItem(
                    "careCircleRegistration"
                );

            if (!saved) {
                return {};
            }


            try {

                return JSON.parse(
                    saved
                );

            } catch (error) {

                return {};
            }
        }


        function getTasks() {

            const saved =
                localStorage.getItem(
                    "careCircleTasks"
                );

            if (!saved) {
                return [];
            }


            try {

                const tasks =
                    JSON.parse(saved);

                return Array.isArray(tasks)
                    ? tasks
                    : [];

            } catch (error) {

                return [];
            }
        }


        /* =================================================
           REGISTRATION DATA
           ================================================= */

        const registration =
            getRegistration();


        const caregiver =
            registration.caregiver || {};


        const recipient =
            registration.recipient || {};


        const caregiverName =
            caregiver.fullName ||
            caregiver.name ||
            "Caregiver";


        const recipientName =
            recipient.fullName ||
            recipient.name ||
            "Care Recipient";


        /* =================================================
           PROTOTYPE CARE MEMBERS

           These values simulate shared location information.
           They are NOT real GPS readings.
           ================================================= */

        const members = [

            {
                id:
                    "recipient",

                name:
                    recipientName,

                role:
                    "Care Recipient",

                status:
                    "Active",

                statusClass:
                    "online",

                distance:
                    "Home",

                eta:
                    "At location",

                lastUpdate:
                    "Just now"
            },


            {
                id:
                    "caregiver",

                name:
                    caregiverName,

                role:
                    "Caregiver",

                status:
                    "Active",

                statusClass:
                    "online",

                distance:
                    "2.4 km",

                eta:
                    "8 min",

                lastUpdate:
                    "2 min ago"
            }

        ];


        let selectedMemberId =
            "recipient";


        /* =================================================
           MAP NAMES
           ================================================= */

        mapRecipientName.textContent =
            getFirstName(
                recipientName
            );


        mapCaregiverName.textContent =
            getFirstName(
                caregiverName
            );


        /* =================================================
           FIRST NAME
           ================================================= */

        function getFirstName(name) {

            return String(
                name || ""
            )
                .trim()
                .split(/\s+/)[0] ||
                "Member";
        }


        /* =================================================
           ACTIVE TASK

           Finds the first pending task assigned to the
           selected member.
           ================================================= */

        function getActiveTask(
            member
        ) {

            const tasks =
                getTasks();


            const activeTasks =
                tasks.filter(
                    function (task) {

                        const status =
                            String(
                                task.status ||
                                ""
                            ).toLowerCase();


                        return (
                            status !==
                                "completed" &&
                            status !==
                                "missed"
                        );
                    }
                );


            if (
                activeTasks.length === 0
            ) {

                return "None";
            }


            const memberName =
                String(
                    member.name
                ).toLowerCase();


            const memberRole =
                String(
                    member.role
                ).toLowerCase();


            const matchingTask =
                activeTasks.find(
                    function (task) {

                        const assignedTo =
                            String(
                                task.assignedTo ||
                                ""
                            ).toLowerCase();


                        return (
                            assignedTo.includes(
                                memberName
                            ) ||
                            assignedTo.includes(
                                memberRole
                            )
                        );
                    }
                );


            const task =
                matchingTask ||
                (
                    member.id ===
                    "recipient"
                        ? activeTasks[0]
                        : null
                );


            return task
                ? (
                    task.title ||
                    task.taskTitle ||
                    "Care Task"
                )
                : "None";
        }


        /* =================================================
           SELECT MEMBER
           ================================================= */

        function selectMember(
            memberId
        ) {

            const member =
                members.find(
                    item =>
                        item.id ===
                        memberId
                );


            if (!member) {
                return;
            }


            selectedMemberId =
                member.id;


            selectedPersonName
                .textContent =
                member.name;


            selectedPersonStatus
                .textContent =
                `● ${member.status}`;


            selectedPersonStatus
                .className =
                `map-status-badge ${member.statusClass}`;


            selectedDistance
                .textContent =
                member.distance;


            selectedETA
                .textContent =
                member.eta;


            selectedLastUpdate
                .textContent =
                member.lastUpdate;


            selectedTask
                .textContent =
                getActiveTask(
                    member
                );


            renderMembers();
        }


        /* =================================================
           RENDER MEMBER LIST
           ================================================= */

        function renderMembers() {

            mapMemberCount.textContent =
                members.length;


            mapMemberList.innerHTML =
                members
                    .map(
                        function (member) {

                            const selected =
                                member.id ===
                                selectedMemberId;


                            return `

                                <button
                                    type="button"
                                    class="
                                        map-member-card
                                        ${
                                            selected
                                                ? "selected"
                                                : ""
                                        }
                                    "
                                    data-member-id="${escapeHTML(
                                        member.id
                                    )}"
                                >

                                    <div class="map-member-avatar">
                                        👤
                                    </div>


                                    <div class="map-member-info">

                                        <strong>
                                            ${escapeHTML(
                                                member.name
                                            )}
                                        </strong>

                                        <span>
                                            ${escapeHTML(
                                                member.role
                                            )}
                                        </span>

                                    </div>


                                    <span class="map-member-status">
                                        ● ${escapeHTML(
                                            member.status
                                        )}
                                    </span>

                                </button>

                            `;
                        }
                    )
                    .join("");


            document
                .querySelectorAll(
                    ".map-member-card"
                )
                .forEach(
                    function (button) {

                        button.addEventListener(
                            "click",
                            function () {

                                selectMember(
                                    button.dataset
                                        .memberId
                                );
                            }
                        );
                    }
                );
        }


        /* =================================================
           MARKER CLICKS
           ================================================= */

        recipientMapMarker
            .addEventListener(
                "click",
                function () {

                    selectMember(
                        "recipient"
                    );
                }
            );


        caregiverMapMarker
            .addEventListener(
                "click",
                function () {

                    selectMember(
                        "caregiver"
                    );
                }
            );


        /* =================================================
           REFRESH

           Prototype refreshes stored CareCircle data.
           It does NOT request GPS.
           ================================================= */

        refreshMapButton
            .addEventListener(
                "click",
                function () {

                    refreshMapButton
                        .textContent =
                        "…";


                    setTimeout(
                        function () {

                            selectMember(
                                selectedMemberId
                            );


                            refreshMapButton
                                .textContent =
                                "↻";

                        },
                        400
                    );
                }
            );


        /* =================================================
           PROFILE
           ================================================= */

        mapProfileButton
            .addEventListener(
                "click",
                function () {

                    window.location.href =
                        "patient-setup.html";
                }
            );


        /* =================================================
           ESCAPE HTML
           ================================================= */

        function escapeHTML(
            value
        ) {

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

        selectMember(
            "recipient"
        );

    }
);