let allAssignedTickets = [];

async function loadEngineerDashboard() {

    const token =
        localStorage.getItem("token");

    const engineerId =
        localStorage.getItem("userId");

    try {

        const response =
            await fetch(
                `http://localhost:5130/api/Dashboard/engineer/${engineerId}`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                });

        const data =
            await response.json();
    
        animateCounter(
            "assignedCount",
            data.assignedTickets
        );

        animateCounter(
            "openCount",
            data.openTickets
        );

        animateCounter(
            "resolvedCount",
            data.resolvedTickets
        );

        loadEngineerChart(
            data.openTickets,
            data.resolvedTickets
        );

        loadProgress(
            data.assignedTickets,
            data.resolvedTickets
        );
        const userName =
            localStorage.getItem("name") || "Engineer";

        const headerUser =
            document.getElementById("headerUser");

        if(headerUser){

            headerUser.innerText = userName;

        }

        let rows = "";

        data.recentTickets.forEach(ticket => {
        if (data.recentTickets.length === 0) {

        document.getElementById("recentEngineerTickets").innerHTML = `
            <tr>

                <td colspan="6" class="text-center py-5">

                    <i class="bi bi-inbox fs-1 text-secondary"></i>

                    <h5 class="mt-3">

                        No Assigned Tickets

                    </h5>

                    <p class="text-muted">

                        You're all caught up!

                    </p>

                </td>

            </tr>
        `;

        return;
    }

            rows += `
            <tr>

                <td>

                    <span class="badge bg-dark fs-6">

                        #${ticket.ticketId}

                    </span>

                </td>

                <td>

                    ${ticket.title}

                </td>

                <td>

                    <span class="badge bg-info text-dark">

                        ${ticket.category}

                    </span>

                </td>

                <td>

                    ${renderPriorityBadge(ticket.priority)}

                </td>

                <td>

                    ${renderStatusBadge(ticket.status)}

                </td>

                <td>

                    <a
                        href="ticket-details.html?id=${ticket.ticketId}"
                        class="btn btn-primary btn-sm rounded-pill">

                        <i class="bi bi-eye-fill"></i>

                        View

                    </a>

                </td>

            </tr>
            `;
        });
       
        document.getElementById(
            "recentEngineerTickets"
        ).innerHTML = rows;
    }
    catch(error) {

        console.error(error);
    }
}

async function startWork(ticketId) {

    const token =
        localStorage.getItem("token");

    try {

        const response =
            await fetch(
                `http://localhost:5130/api/Tickets/${ticketId}/start`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                });

        const result =
            await response.text();

        Toast.success("Work Started", result || "You have started working on this ticket.");

        loadAssignedTickets();

    }
    catch(error) {

        console.error(error);
    }
}

async function resolveTicket(ticketId) {

    const token =
        localStorage.getItem("token");

    try {

        const response =
            await fetch(
                `http://localhost:5130/api/Tickets/${ticketId}/resolve`,
                {
                    method: "PUT",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                });

        const result =
            await response.text();

        Toast.success("Ticket Resolved", result || "This ticket has been marked as resolved.");

        loadTicketDetails();

    }
    catch(error) {

        console.error(error);
    }
}

window.onload = function () {

    if (document.body.id === "engineerDashboard") 
    {

        loadEngineerDashboard();

        loadGreeting();

        loadCurrentDate();

    }
       

    if (document.body.id === "assignedTicketsPage") 

    {
        loadAssignedTickets();

        document
            .getElementById("searchBox")
            .addEventListener("keyup", applyFilters);
    }

    if(document.getElementById("ticketId"))
    {
        loadTicketDetails();
    }

    if(document.getElementById("commentsList"))
    {
        loadComments();
    }

    if(document.getElementById("attachmentsList"))
    {
        loadAttachments();
    }

    if(document.getElementById("historyTableBody"))
    {
        loadTicketHistory();
    }   
    if (document.getElementById("notificationCount")) 
    {
        loadNotifications();
    }

    const statusFilter =
        document.getElementById("statusFilter");

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            applyFilters
        );

    }

    const priorityFilter =
        document.getElementById("priorityFilter");

    if (priorityFilter) {

        priorityFilter.addEventListener(
            "change",
            applyFilters
        );

    }


};

function logout() {

    Toast.queue("info", "Logged Out", "You have been signed out successfully.");

    localStorage.clear();

    window.location.href = "../login.html";
}

function loadEngineerChart(open,resolved){

    const ctx =
        document.getElementById("engineerChart");

    if(!ctx)
        return;

    new Chart(ctx, {

        type:"doughnut",

        data:{

            labels:[
                "Open",
                "Resolved"
            ],

            datasets:[{

                data:[
                    open,
                    resolved
                ]

            }]
        }
    });
}

async function loadAssignedTickets() {

    const token =
        localStorage.getItem("token");

    const engineerId =
        localStorage.getItem("userId");

    try {

        const response =
            await fetch(
                `http://localhost:5130/api/Tickets/assigned/${engineerId}`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                });

        const tickets =
            await response.json();
        allAssignedTickets = tickets;
        document.getElementById("assignedCount").innerText =
            tickets.length;

        document.getElementById("openCount").innerText =
            tickets.filter(t => t.status === "Open").length;

        document.getElementById("progressCount").innerText =
            tickets.filter(t => t.status === "InProgress").length;

        document.getElementById("resolvedCount").innerText =
            tickets.filter(t => t.status === "Resolved").length;

        renderAssignedTickets(allAssignedTickets);  
      }
    catch(error) {

        console.error(error);
    }
}

async function loadTicketDetails() {

    const token = localStorage.getItem("token");

    const params =
        new URLSearchParams(window.location.search);

    const id = params.get("id");

    if (!id)
        return;

    try {

        const response =
            await fetch(
                `http://localhost:5130/api/Tickets/${id}`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                });

        const ticket =
            await response.json();

        document.getElementById("ticketId").innerText =
            ticket.ticketId;

        document.getElementById("title").innerText =
            ticket.title;

        document.getElementById("description").innerText =
            ticket.description;

        document.getElementById("category").innerText =
            ticket.category;

        document.getElementById("priority").innerHTML =
            renderPriorityBadge(ticket.priority);

        document.getElementById("status").innerHTML =
            renderStatusBadge(ticket.status);
        
        document.getElementById("employeeName").innerText =
            ticket.employeeName;

        document.getElementById("employeeId").innerText =
            ticket.employeeId;

        document.getElementById("employeeEmail").innerText =
            ticket.employeeEmail;

        document.getElementById("employeePhoneNumber").innerText =
            ticket.employeePhoneNumber;

        document.getElementById("employeeDepartment").innerText =
            ticket.employeeDepartment;
        renderTicketActions(ticket);
    }
    catch(error)
    {
        console.error(error);
    }
}

async function loadComments() {

    const token =
        localStorage.getItem("token");

    const params =
        new URLSearchParams(window.location.search);

    const ticketId =
        params.get("id");

    try {

        const response =
            await fetch(
                `http://localhost:5130/api/TicketComments/${ticketId}`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                });

        const comments =
            await response.json();

        let html = "";

        comments.forEach(comment => {

            html += `
                <div class="border rounded p-2 mb-2">

                    <strong>
                        User ${comment.userId}
                    </strong>

                    <br>

                    ${comment.comment}

                    <br>

                    <small class="text-muted">
                        ${comment.createdDate}
                    </small>

                </div>
            `;
        });

        document.getElementById(
            "commentsList"
        ).innerHTML = html;
    }
    catch(error)
    {
        console.error(error);
    }
}

async function addComment() {

    const token =
        localStorage.getItem("token");

    const userId =
        localStorage.getItem("userId");

    const params =
        new URLSearchParams(window.location.search);

    const ticketId =
        params.get("id");

    const comment =
        document.getElementById(
            "commentText"
        ).value;

    try {

        const response =
            await fetch(
                "http://localhost:5130/api/TicketComments",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        ticketId:
                            parseInt(ticketId),

                        userId:
                            parseInt(userId),

                        comment:
                            comment
                    })
                });

        if(response.ok)
        {
            document.getElementById(
                "commentText"
            ).value = "";

            loadComments();
        }
    }
    catch(error)
    {
        console.error(error);
    }
}

async function uploadAttachment() {

    const token =
        localStorage.getItem("token");

    const params =
        new URLSearchParams(window.location.search);

    const ticketId =
        params.get("id");

    const file =
        document.getElementById("attachmentFile").files[0];

    if (!file) {

        Toast.warning("No File Selected", "Please choose a file to upload.");

        return;
    }

    const formData =
        new FormData();

    formData.append("file", file);

    try {

        const response =
            await fetch(
                `http://localhost:5130/api/TicketAttachments/upload/${ticketId}`,
                {
                    method: "POST",

                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: formData
                });

        const result =
            await response.text();

        Toast.success("File Uploaded", result || "Your attachment was uploaded successfully.");

        loadAttachments();

    }
    catch(error) {

        console.error(error);

        Toast.error("Upload Failed", "We could not upload your file. Please try again.");
    }
}

async function loadAttachments() {

    const token =
        localStorage.getItem("token");

    const params =
        new URLSearchParams(window.location.search);

    const ticketId =
        params.get("id");

    try {

        const response =
            await fetch(
                `http://localhost:5130/api/TicketAttachments/${ticketId}`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                });

        const attachments =
            await response.json();

        let html = "";

        attachments.forEach(file => {

            html += `
                <div class="alert alert-info">

                    <strong>${file.fileName}</strong>

                    <br>

                    Uploaded:
                    ${new Date(file.uploadedDate).toLocaleString()}

                </div>
            `;
        });

        document.getElementById("attachmentsList").innerHTML =
            html;
    }
    catch(error) {

        console.error(error);
    }
}

async function loadTicketHistory() {

    const token =
        localStorage.getItem("token");

    const params =
        new URLSearchParams(window.location.search);

    const ticketId =
        params.get("id");

    try {

        const response =
            await fetch(
                `http://localhost:5130/api/TicketHistory/${ticketId}`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                });

        const history =
            await response.json();

        let rows = "";

        history.forEach(item => {

            rows += `
                <tr>

                    <td>${renderStatusBadge(item.status)}</td>

                    <td>${item.updatedDate}</td>

                </tr>
            `;
        });

        document.getElementById(
            "historyTableBody"
        ).innerHTML = rows;
    }
    catch(error)
    {
        console.error(error);
    }
}

async function loadNotifications() {

    const token =
        localStorage.getItem("token");

    const userId =
        localStorage.getItem("userId");

    try {

        const response =
            await fetch(
                `http://localhost:5130/api/Notifications/user/${userId}`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                });

        const notifications =
            await response.json();

        document.getElementById(
            "notificationCount"
        ).innerText =
            notifications.length;

        let html = "";
        if (notifications.length === 0) {

        document.getElementById("notificationList").innerHTML = `
            <li>

                <div class="text-center py-4">

                    <i class="bi bi-bell-slash fs-1 text-secondary"></i>

                    <p class="mt-2 text-muted">

                        No notifications

                    </p>

                </div>

            </li>
        `;

        return;

    }

        notifications.forEach(n => {

            html += `
                <li>

                    <div class="dropdown-item py-3">

                        <div class="d-flex">

                            <div class="me-3">

                                <i class="bi bi-bell-fill text-primary fs-5"></i>

                            </div>

                            <div>

                                <div class="fw-semibold">

                                    ${n.message}

                                </div>

                                <small class="text-muted">

                                    ${new Date(n.createdDate).toLocaleString()}

                                </small>

                            </div>

                        </div>

                    </div>

                </li>

                <li>

                    <hr class="dropdown-divider m-0">

                </li>
            `;

        });

        document.getElementById(
            "notificationList"
        ).innerHTML = html;

    }
    catch(error) {

        console.error(error);
    }
}

function renderAssignedTickets(tickets) {

    let rows = "";

    tickets.forEach(ticket => {

        rows += `
            <tr>

                <td>${ticket.ticketId}</td>

                <td>${ticket.title}</td>

                <td>${ticket.category}</td>

                <td>
                    ${renderPriorityBadge(ticket.priority)}
                </td>

                <td>
                    ${renderStatusBadge(ticket.status)}
                </td>

                <td>

                    ${new Date(ticket.createdAt).toLocaleDateString()}

                </td>

                <td>

                    <a
                        href="ticket-details.html?id=${ticket.ticketId}"
                        class="btn btn-outline-primary btn-sm">

                        <i class="bi bi-eye"></i>

                        View

                    </a>

                </td>

            </tr>
        `;

    });

    document.getElementById("ticketTableBody").innerHTML = rows;

}

function applyFilters() {

    const keyword =
        document.getElementById("searchBox")
        .value
        .toLowerCase();

    const status =
        document.getElementById("statusFilter")
        .value;

    const priority =
        document.getElementById("priorityFilter")
        .value;

    let filteredTickets =
        allAssignedTickets;

    if (keyword !== "") {

        filteredTickets =
            filteredTickets.filter(ticket =>

                ticket.title.toLowerCase().includes(keyword) ||

                ticket.category.toLowerCase().includes(keyword) ||

                ticket.ticketId.toString().includes(keyword)

            );

    }

    if (status !== "All") {

        filteredTickets =
            filteredTickets.filter(ticket =>
                ticket.status === status
            );

    }

    if (priority !== "All") {

        filteredTickets =
            filteredTickets.filter(ticket =>
                ticket.priority === priority
            );

    }

    renderAssignedTickets(filteredTickets);

}

function renderTicketActions(ticket) {

    let html = "";

    if (ticket.status === "Open") {

        html = `
            <button
                class="btn btn-primary"
                onclick="startWork(${ticket.ticketId})">

                <i class="bi bi-play-fill"></i>

                Start Work

            </button>
        `;
    }

    else if (ticket.status === "InProgress") {

        html = `
            <button
                class="btn btn-success"
                onclick="resolveTicket(${ticket.ticketId})">

                <i class="bi bi-check-circle"></i>

                Resolve Ticket

            </button>
        `;
    }

    else if (ticket.status === "Resolved") {

        html = `
            <button
                class="btn btn-secondary"
                disabled>

                <i class="bi bi-check2-all"></i>

                Ticket Completed

            </button>
        `;
    }

    document.getElementById("ticketActions").innerHTML = html;
}
function loadCurrentDate(){

    document.getElementById("currentDate").innerText =
        new Date().toLocaleDateString(
            "en-IN",
            {
                weekday:"long",
                day:"numeric",
                month:"long",
                year:"numeric"
            });

}

function loadGreeting() {

    const greeting =
        document.getElementById("greetingText");

    if (!greeting)
        return;

    const hour =
        new Date().getHours();

    let message = "Good Morning";

    if (hour >= 12 && hour < 17) {

        message = "Good Afternoon";

    }
    else if (hour >= 17) {

        message = "Good Evening";

    }

    greeting.innerHTML = `
        ${message} 👋
        <br>
        <span class="fs-4 fw-normal">
            Welcome,
            <span id="headerUser">
                Engineer
            </span>
        </span>
    `;

}

function animateCounter(elementId, targetValue) {

    const element =
        document.getElementById(elementId);

    if (!element)
        return;

    let current = 0;

    const increment =
        Math.max(1, Math.ceil(targetValue / 40));

    const timer =
        setInterval(() => {

            current += increment;

            if (current >= targetValue) {

                current = targetValue;

                clearInterval(timer);

            }

            element.innerText = current;

        }, 30);

}

function loadProgress(assigned, resolved) {

    const percentage =
        assigned === 0
            ? 0
            : Math.round((resolved / assigned) * 100);

    document.getElementById("progressBar").style.width =
        percentage + "%";

    document.getElementById("progressPercentage").innerText =
        percentage + "%";

    document.getElementById("progressText").innerText =
        `Resolved ${resolved} of ${assigned} assigned tickets`;

}