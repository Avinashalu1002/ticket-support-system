async function loadAdminDashboard() {

    const token =
        localStorage.getItem("token");

    try {

        const response =
            await fetch(
                "http://localhost:5130/api/Dashboard/admin",
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                });

        const data =
            await response.json();

        document.getElementById("totalUsers").innerText =
            data.totalUsers;

        document.getElementById("totalEmployees").innerText =
            data.totalEmployees;

        document.getElementById("totalEngineers").innerText =
            data.totalEngineers;

        document.getElementById("totalTickets").innerText =
            data.totalTickets;

        document.getElementById("openTickets").innerText =
            data.openTickets;

        document.getElementById("inProgressTickets").innerText =
            data.inProgressTickets;

        document.getElementById("resolvedTickets").innerText =
            data.resolvedTickets;

        loadAdminChart(
            data.openTickets,
            data.inProgressTickets,
            data.resolvedTickets
        );

    }
    catch(error) {

        console.error(error);
    }
}

async function loadUsers() {

    const token =
        localStorage.getItem("token");

    try {

        const response =
            await fetch(
                "http://localhost:5130/api/Admin/users",
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                });

        const users =
            await response.json();

        let rows = "";

        users.forEach(user => {

            rows += `
                <tr>

                    <td>${user.userId}</td>

                    <td>${user.name}</td>

                    <td>${user.email}</td>

                    <td>
                        <span class="badge bg-primary">
                            ${user.role}
                        </span>
                    </td>

                    <td>
                        <span class="badge ${
                            user.isActive
                                ? "bg-success"
                                : "bg-danger"
                        }">

                            ${
                                user.isActive
                                    ? "Active"
                                    : "Inactive"
                            }

                        </span>
                    </td>

                    <td>

                        <div class="d-flex gap-2">

                            <button
                                class="btn btn-outline-primary btn-sm"
                                onclick="viewUser(${user.userId})">

                                <i class="bi bi-eye-fill"></i>
                                View

                            </button>

                            <button
                                class="btn btn-warning btn-sm"
                                onclick="toggleUserStatus(${user.userId})">

                                ${
                                    user.isActive
                                        ? "Disable"
                                        : "Enable"
                                }

                            </button>

                        </div>

                    </td>

                </tr>
            `;
    
        });

        document.getElementById(
            "userTableBody"
        ).innerHTML = rows;

    }
    catch(error) {

        console.error(error);
    }
}

async function viewUser(userId) {

    const token =
        localStorage.getItem("token");

    const modalEl =
        document.getElementById("userDetailsModal");

    const bsModal =
        bootstrap.Modal.getOrCreateInstance(modalEl);

    document.getElementById("udName").innerText = "Loading...";
    document.getElementById("udEmail").innerText = "-";
    document.getElementById("udPhone").innerText = "-";
    document.getElementById("udEmployeeId").innerText = "-";
    document.getElementById("udDepartment").innerText = "-";
    document.getElementById("udRole").innerText = "-";
    document.getElementById("udMemberSince").innerText = "-";
    document.getElementById("udStatus").innerHTML = "-";
    document.getElementById("udAvatar").innerText = "?";

    bsModal.show();

    try {

        const response =
            await fetch(
                `http://localhost:5130/api/Users/${userId}`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                });

        if (!response.ok) {
            throw new Error("Failed to load user.");
        }

        const user =
            await response.json();

        document.getElementById("udName").innerText = user.name || "-";
        document.getElementById("udEmail").innerText = user.email || "-";
        document.getElementById("udPhone").innerText = user.phoneNumber || "-";
        document.getElementById("udEmployeeId").innerText = user.employeeId || "-";
        document.getElementById("udDepartment").innerText = user.department || "-";
        document.getElementById("udRole").innerText = user.role || "-";

        document.getElementById("udMemberSince").innerText =
            user.createdDate
                ? new Date(user.createdDate).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })
                : "-";

        document.getElementById("udStatus").innerHTML =
            user.isActive
                ? '<span class="badge bg-success">Active</span>'
                : '<span class="badge bg-secondary">Inactive</span>';

        document.getElementById("udAvatar").innerText =
            (user.name || "?").trim().charAt(0).toUpperCase();

    }
    catch (error) {

        console.error(error);

        bsModal.hide();

        Toast.error("Load Failed", "We could not load this user's details. Please try again.");
    }
}

async function loadReports() {

    const token =
        localStorage.getItem("token");

    try {

        // Priority

        const priorityResponse =
            await fetch(
                "http://localhost:5130/api/Reports/priority",
                {
                    headers:{
                        "Authorization":
                            `Bearer ${token}`
                    }
                });

        const priorities =
            await priorityResponse.json();

        drawPriorityChart(priorities);

        // Category

        const categoryResponse =
            await fetch(
                "http://localhost:5130/api/Reports/category",
                {
                    headers:{
                        "Authorization":
                            `Bearer ${token}`
                    }
                });

        const categories =
            await categoryResponse.json();

        drawCategoryChart(categories);

        // Engineers

        const engineerResponse =
            await fetch(
                "http://localhost:5130/api/Reports/engineers",
                {
                    headers:{
                        "Authorization":
                            `Bearer ${token}`
                    }
                });

        const engineers =
            await engineerResponse.json();

        drawEngineerChart(engineers);

        // Monthly

        const monthlyResponse =
            await fetch(
                "http://localhost:5130/api/Reports/monthly",
                {
                    headers:{
                        "Authorization":
                            `Bearer ${token}`
                    }
                });

        const months =
            await monthlyResponse.json();

        drawMonthlyChart(months);
    }
    catch(error){

        console.error(error);
    }
}

function drawCategoryChart(data) {

    const chart =
        document.getElementById("categoryChart");

    if(!chart) return;

    new Chart(chart, {

        type:"pie",

        data:{
            labels:data.map(x => x.category),

            datasets:[{
                data:data.map(x => x.count)
            }]
        }
    });
}

function drawEngineerChart(data) {

    const chart =
        document.getElementById("engineerChart");

    if(!chart) return;

    new Chart(chart, {

        type:"bar",

        data:{
            labels:data.map(x => x.engineerName),

            datasets:[{
                label:"Resolved Tickets",

                data:data.map(x => x.resolvedTickets)
            }]
        }
    });
}

function drawMonthlyChart(data) {

    const chart =
        document.getElementById("monthlyChart");

    if(!chart) return;

    new Chart(chart, {

        type:"line",

        data:{
            labels:data.map(x => x.month),

            datasets:[{
                label:"Tickets",

                data:data.map(x => x.ticketCount)
            }]
        }
    });
}

function loadAdminChart(
    open,
    inProgress,
    resolved
){

    const chart =
        document.getElementById(
            "adminChart"
        );

    if(!chart)
        return;

    new Chart(chart, {

        type:"doughnut",

        data:{

            labels:[
                "Open",
                "In Progress",
                "Resolved"
            ],

            datasets:[{

                data:[
                    open,
                    inProgress,
                    resolved
                ]

            }]
        }
    });
}

function logout() {

    Toast.queue("info", "Logged Out", "You have been signed out successfully.");

    localStorage.clear();

    window.location.href = "../login.html";
}

async function loadAdminIdentity() {

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    function applyName(name) {

        const initial =
            (name || "A").trim().charAt(0).toUpperCase() || "A";

        const avatarEl = document.getElementById("userAvatar");
        const nameEl = document.getElementById("userName");
        const greetEl = document.getElementById("greetingName");

        if (avatarEl) avatarEl.innerText = initial;
        if (nameEl) nameEl.innerText = name;
        if (greetEl) greetEl.innerText = name;
    }

    applyName(localStorage.getItem("name") || "Admin");

    if (!userId) return;

    try {

        const response =
            await fetch(
                `http://localhost:5130/api/Users/${userId}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });

        if (!response.ok) return;

        const user = await response.json();

        if (user.name) {
            localStorage.setItem("name", user.name);
            applyName(user.name);
        }

    }
    catch (error) {

        console.error(error);
    }
}

window.onload = function() {

    loadAdminIdentity();

    if(document.getElementById("totalUsers"))
    {
        loadAdminDashboard();
    }

    if(document.getElementById("userTableBody"))
    {
        loadUsers();
    }

    if(document.getElementById("priorityChart"))
    {
        loadReports();
    }
};

function drawPriorityChart(data) {

    const chart =
        document.getElementById("priorityChart");

    if (!chart)
        return;

    new Chart(chart, {

        type: "bar",

        data: {

            labels:
                data.map(x => x.priority),

            datasets: [{

                label: "Tickets",

                data:
                    data.map(x => x.count)

            }]
        }
    });
}