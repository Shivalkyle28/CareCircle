const quickAddBtn = document.getElementById("quickAddBtn");

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
        alert("Please choose an option from 1 to 5.");
    }

});