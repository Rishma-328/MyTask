// ======================================================
//                    MyTask APP
// ======================================================


// ======================================================
//                    APP DATA
// ======================================================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let alerts = JSON.parse(localStorage.getItem("alerts")) || [];


// ======================================================
//                     TV DATA
// ======================================================

let tvOn = false;
let volume = 20;
let channel = 1;


// ======================================================
//                  ALERT FILTER
// ======================================================

let currentAlertFilter = "All";


// ======================================================
//                  PAGE NAVIGATION
// ======================================================

function hideAllScreens() {

    const screens = [
        "homeScreen",
        "controlScreen",
        "tvScreen",
        "taskScreen",
        "alertScreen",
        "settingsScreen"
    ];

    screens.forEach(function (screenId) {

        const screen = document.getElementById(screenId);

        if (screen) {
            screen.classList.add("hidden");
        }

    });
}


// ------------------------------
// HOME
// ------------------------------

function goHome() {

    hideAllScreens();

    const home = document.getElementById("homeScreen");

    if (home) {
        home.classList.remove("hidden");
    }

    updateDashboard();
}


// ------------------------------
// CONTROLS
// ------------------------------

function showControls() {

    hideAllScreens();

    const controls = document.getElementById("controlScreen");

    if (controls) {
        controls.classList.remove("hidden");
    }
}


// ------------------------------
// TASKS
// ------------------------------

function showTasks() {

    hideAllScreens();

    const taskScreen = document.getElementById("taskScreen");

    if (taskScreen) {
        taskScreen.classList.remove("hidden");
        displayTasks();
    }
}


// ------------------------------
// ALERTS
// ------------------------------

function showAlerts() {

    hideAllScreens();

    const alertScreen = document.getElementById("alertScreen");

    if (alertScreen) {
        alertScreen.classList.remove("hidden");

        currentAlertFilter = "All";

        document.querySelectorAll(".filter-btn").forEach(function (button) {
            button.classList.remove("active");
        });

        const firstFilter = document.querySelector(".filter-btn");

        if (firstFilter) {
            firstFilter.classList.add("active");
        }

        displayAlerts();
        updateAlertCount();
    }
}


// ------------------------------
// SETTINGS
// ------------------------------

function showSettings() {

    hideAllScreens();

    const settings = document.getElementById("settingsScreen");

    if (settings) {
        settings.classList.remove("hidden");
    }
}


// ======================================================
//                    ADD TASK
// ======================================================

function addTask() {

    const popup = document.getElementById("taskPopup");

    if (popup) {
        popup.classList.remove("hidden");
    }

    const input = document.getElementById("taskName");

    if (input) {
        input.focus();
    }
}


// ------------------------------
// CLOSE POPUP
// ------------------------------

function closePopup() {

    const popup = document.getElementById("taskPopup");

    if (popup) {
        popup.classList.add("hidden");
    }
}


// ------------------------------
// SAVE TASK
// ------------------------------

function saveTask() {

    const nameInput = document.getElementById("taskName");
    const statusInput = document.getElementById("taskStatus");

    if (!nameInput || !statusInput) {
        return;
    }

    const name = nameInput.value.trim();
    const status = statusInput.value;

    if (name === "") {

        alert("Please enter task name");

        return;
    }


    const task = {

        id: Date.now(),

        name: name,

        status: status,

        time: new Date().toLocaleString()

    };


    tasks.push(task);

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );


    nameInput.value = "";

    closePopup();

    updateDashboard();

    displayTasks();


    createAlert(
        "New Task Added",
        name + " has been added.",
        "Task"
    );
}


// ======================================================
//                    DISPLAY TASKS
// ======================================================

function displayTasks() {

    const list = document.getElementById("taskList");

    if (!list) {
        return;
    }


    if (tasks.length === 0) {

        list.innerHTML = `
            <div class="empty">
                No tasks yet
            </div>
        `;

        return;
    }


    list.innerHTML = "";


    tasks
        .slice()
        .reverse()
        .forEach(function (task) {

            const card = document.createElement("div");

            card.className = "task-card";


            card.innerHTML = `

                <h3>${task.name}</h3>

                <p>
                    Status: ${task.status}
                </p>

                <p>
                    ${task.time || ""}
                </p>

            `;


            list.appendChild(card);

        });
}


// ======================================================
//                  UPDATE DASHBOARD
// ======================================================

function updateDashboard() {

    const completed =
        tasks.filter(function (task) {

            return task.status === "Completed";

        }).length;


    const progress =
        tasks.filter(function (task) {

            return task.status === "In Progress";

        }).length;


    const pending =
        tasks.filter(function (task) {

            return task.status === "Pending";

        }).length;


    const completedCount =
        document.getElementById("completedCount");

    const progressCount =
        document.getElementById("progressCount");

    const pendingCount =
        document.getElementById("pendingCount");


    if (completedCount) {
        completedCount.innerText = completed;
    }

    if (progressCount) {
        progressCount.innerText = progress;
    }

    if (pendingCount) {
        pendingCount.innerText = pending;
    }


    displayRecentActivities();
}


// ======================================================
//                RECENT ACTIVITIES
// ======================================================

function displayRecentActivities() {

    const activities =
        document.getElementById("activities");


    if (!activities) {
        return;
    }


    if (tasks.length === 0) {

        activities.innerHTML = `
            <div class="empty">
                No activities yet
            </div>
        `;

        return;
    }


    activities.innerHTML = "";


    const recentTasks =
        tasks.slice(-3).reverse();


    recentTasks.forEach(function (task) {

        const item =
            document.createElement("div");


        item.className = "activity";


        item.innerHTML = `

            <div>

                <div class="activity-name">
                    ${task.name}
                </div>

            </div>

            <div class="activity-status">
                ${task.status}
            </div>

        `;


        activities.appendChild(item);

    });
}


// ======================================================
//              ALERTS & NOTIFICATIONS
// ======================================================

function createAlert(
    title,
    message,
    type = "System"
) {

    const newAlert = {

        id: Date.now(),

        title: title,

        message: message,

        type: type,

        time: new Date().toLocaleTimeString()

    };


    alerts.unshift(newAlert);


    // Maximum 50 alerts

    if (alerts.length > 50) {

        alerts =
            alerts.slice(0, 50);

    }


    localStorage.setItem(
        "alerts",
        JSON.stringify(alerts)
    );


    updateNotificationCount();

    updateAlertCount();


    const alertScreen =
        document.getElementById("alertScreen");


    if (
        alertScreen &&
        !alertScreen.classList.contains("hidden")
    ) {

        displayAlerts();

    }
}


// ======================================================
//                DISPLAY ALERTS
// ======================================================

function displayAlerts() {

    const list =
        document.getElementById("alertList");


    if (!list) {
        return;
    }


    let filteredAlerts = alerts;


    // ------------------------------
    // FILTER
    // ------------------------------

    if (currentAlertFilter !== "All") {

        filteredAlerts =
            alerts.filter(function (alertItem) {

                return (
                    alertItem.type ===
                    currentAlertFilter
                );

            });

    }


    // ------------------------------
    // NO ALERTS
    // ------------------------------

    if (filteredAlerts.length === 0) {

        list.innerHTML = `

            <div class="empty">

                🔔

                <br><br>

                No notifications

            </div>

        `;

        return;
    }


    list.innerHTML = "";


    // ------------------------------
    // ALERT CARDS
    // ------------------------------

    filteredAlerts.forEach(function (alertItem) {


        let icon = "🔔";


        if (alertItem.type === "Security") {

            icon = "🛡️";

        }


        if (alertItem.type === "Task") {

            icon = "📋";

        }


        if (alertItem.type === "System") {

            icon = "⚙️";

        }


        const card =
            document.createElement("div");


        card.className =
            "alert-card " +
            alertItem.type.toLowerCase();


        card.innerHTML = `

            <div class="alert-top">

                <div class="alert-icon">

                    ${icon}

                </div>


                <div class="alert-info">

                    <h3>
                        ${alertItem.title}
                    </h3>

                    <p>
                        ${alertItem.message}
                    </p>

                </div>

            </div>


            <div class="alert-time">

                ${alertItem.time}

            </div>

        `;


        list.appendChild(card);

    });
}


// ======================================================
//                  ALERT FILTER
// ======================================================

function filterAlerts(type, button) {

    currentAlertFilter = type;


    document
        .querySelectorAll(".filter-btn")
        .forEach(function (btn) {

            btn.classList.remove("active");

        });


    if (button) {

        button.classList.add("active");

    }


    displayAlerts();
}


// ======================================================
//                  ALERT COUNT
// ======================================================

function updateAlertCount() {

    const count =
        document.getElementById("alertCount");


    if (count) {

        count.innerText =
            alerts.length;

    }
}


// ======================================================
//             TOP NOTIFICATION COUNT
// ======================================================

function updateNotificationCount() {

    const count =
        document.getElementById(
            "notificationCount"
        );


    if (count) {

        count.innerText =
            alerts.length;

    }
}


// ======================================================
//                  CLEAR ALERTS
// ======================================================

function clearAlerts() {

    if (alerts.length === 0) {

        alert("No alerts to clear.");

        return;
    }


    const confirmClear =
        confirm(
            "Clear all notifications?"
        );


    if (!confirmClear) {

        return;

    }


    alerts = [];


    localStorage.removeItem(
        "alerts"
    );


    updateNotificationCount();

    updateAlertCount();

    displayAlerts();
}


// ======================================================
//                 DEVICE CONTROLS
// ======================================================

function controlChanged(
    device,
    status
) {

    const state =
        status ? "ON" : "OFF";


    createAlert(

        device + " Control",

        device +
        " turned " +
        state,

        "System"

    );


    console.log(
        device +
        " : " +
        state
    );
}


// ======================================================
//                     TV CONTROL
// ======================================================

function openTVControl() {

    hideAllScreens();


    const tvScreen =
        document.getElementById(
            "tvScreen"
        );


    if (tvScreen) {

        tvScreen.classList.remove(
            "hidden"
        );

    } else {

        alert(
            "TV Control page not added yet."
        );

    }
}


// ======================================================
//                    TV POWER
// ======================================================

function toggleTV() {

    tvOn = !tvOn;


    const status =
        document.getElementById(
            "tvStatus"
        );


    const button =
        document.getElementById(
            "tvPowerButton"
        );


    if (tvOn) {

        if (status) {

            status.innerText =
                "TV is ON";

        }


        if (button) {

            button.style.background =
                "#4caf50";

        }


        createAlert(
            "TV Control",
            "TV turned ON",
            "System"
        );


    } else {


        if (status) {

            status.innerText =
                "TV is OFF";

        }


        if (button) {

            button.style.background =
                "";

        }


        createAlert(
            "TV Control",
            "TV turned OFF",
            "System"
        );

    }
}


// ======================================================
//                    TV VOLUME
// ======================================================

function changeVolume(value) {

    volume += value;


    if (volume < 0) {

        volume = 0;

    }


    if (volume > 100) {

        volume = 100;

    }


    const display =
        document.getElementById(
            "volumeValue"
        );


    if (display) {

        display.innerText =
            volume;

    }
}


// ======================================================
//                    TV CHANNEL
// ======================================================

function changeChannel(value) {

    channel += value;


    if (channel < 1) {

        channel = 1;

    }


    if (channel > 999) {

        channel = 999;

    }


    const display =
        document.getElementById(
            "channelValue"
        );


    if (display) {

        display.innerText =
            channel;

    }
}


// ======================================================
//                  TV QUICK ACTION
// ======================================================

function tvAction(action) {

    createAlert(

        "TV Control",

        action + " selected",

        "System"

    );


    alert(
        "TV " +
        action
    );
}


// ======================================================
//                 SECURITY SYSTEM
// ======================================================

function securityControl() {

    createAlert(

        "Security System",

        "Security system opened",

        "Security"

    );


    alert(
        "Security System page coming next 🛡️"
    );
}


// ======================================================
//                  CLEAR ALL DATA
// ======================================================

function clearData() {

    const confirmClear =
        confirm(
            "Clear all MyTask data?"
        );


    if (!confirmClear) {

        return;

    }


    localStorage.removeItem(
        "tasks"
    );


    localStorage.removeItem(
        "alerts"
    );


    tasks = [];

    alerts = [];


    updateDashboard();

    updateNotificationCount();

    updateAlertCount();

    displayTasks();

    displayAlerts();


    alert(
        "App data cleared successfully."
    );


    goHome();
}


// ======================================================
//                  TEST NOTIFICATIONS
// ======================================================

// இந்த function testing காக.
// Alerts page வேலை செய்கிறதா என்று பார்க்க
// browser console இல்லாமலே notification create செய்யலாம்.

function testSystemAlert() {

    createAlert(

        "System Alert",

        "MyTask system is working correctly.",

        "System"

    );

}


function testSecurityAlert() {

    createAlert(

        "Security Alert",

        "A security event has been detected.",

        "Security"

    );

}


function testTaskAlert() {

    createAlert(

        "Task Notification",

        "Your task has been updated.",

        "Task"

    );

}


// ======================================================
//                    APP START
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        updateDashboard();

        updateNotificationCount();

        updateAlertCount();

        displayTasks();

        displayAlerts();

        goHome();

    }
);