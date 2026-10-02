/* =========================================================
   CARECIRCLE - SESSION HELPERS
   ========================================================= */


/* =========================================================
   GET CURRENT USER
   ========================================================= */

function getCurrentCareCircleUser() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "careCircleCurrentUser"
            ) || "{}"
        );

    } catch (error) {

        console.error(
            "Unable to read current CareCircle user.",
            error
        );

        return {};
    }
}


/* =========================================================
   SIGN OUT
   ========================================================= */

function signOutCareCircle() {

    /*
     * IMPORTANT:
     *
     * Only remove the current session.
     *
     * Do NOT clear all localStorage because that
     * would delete medications, health records,
     * tasks, events and account information.
     */

    localStorage.removeItem(
        "careCircleCurrentUser"
    );


    window.location.href =
        "signin.html";
}