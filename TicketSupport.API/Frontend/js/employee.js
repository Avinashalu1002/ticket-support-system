// AI Suggestions

async function getSuggestions() {

    const description =
        document.getElementById("description").value;

    if (!description) {
        Toast.warning("Missing Description", "Please enter an issue description first.");
        return;
    }

    try {

        const response = await fetch(
            "http://localhost:5130/api/AI/suggestions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    description: description
                })
            });

        const result = await response.text();

        document.getElementById("suggestions").innerHTML =
            `
            <div class="alert alert-info mt-3">
                <strong>AI Suggestions:</strong><br>
                ${result}
            </div>
            `;

    }
    catch (error) {

        console.error(error);

        Toast.error("AI Suggestions Failed", "We could not fetch AI suggestions. Please try again.");
    }
}


// AI Analyze

async function analyzeTicket() {

    const description =
        document.getElementById("description").value;

    if (!description) {

        Toast.warning("Missing Description", "Please enter an issue description first.");

        return;
    }

    try {

        const response =
            await fetch(
                "http://localhost:5130/api/AI/analyze",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        description: description
                    })
                });

        const result =
            await response.json();

        document.getElementById("category").value =
            result.category;

        document.getElementById("priority").value =
            result.priority;

    }
    catch(error) {

        console.error(error);

        Toast.error("Analysis Failed", "We could not analyze this ticket. Please try again.");
    }
}


// Create Ticket

async function createTicket() {

    const token =
        localStorage.getItem("token");

    const userId =
        localStorage.getItem("userId");

    const ticket = {

        title:
            document.getElementById("title").value,

        description:
            document.getElementById("description").value,

        category:
            document.getElementById("category").value,

        priority:
            document.getElementById("priority").value,

        createdByUserId:
            parseInt(userId)
    };

    const button =
        document.getElementById("createTicketBtn");

    button.disabled = true;

    button.innerHTML =
        '<i class="bi bi-hourglass-split"></i> Creating...';

    try {

        const response =
            await fetch(
                "http://localhost:5130/api/Tickets",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        "Authorization":
                            `Bearer ${token}`
                    },

                    body:
                        JSON.stringify(ticket)
                });

        if (!response.ok) {

            const errorText =
                await response.text();

            Toast.error("Ticket Creation Failed", errorText);

            return;
        }

        const result =
            await response.json();

        Toast.success("Ticket Created", `Your ticket #${result.ticketId} was created successfully.`);

        setTimeout(function () {
            button.innerHTML =
                '<i class="bi bi-check-circle-fill"></i> Created';
            window.location.href = "dashboard.html";

        }, 1000);

        document.getElementById("title").value = "";
        document.getElementById("description").value = "";
        document.getElementById("category").value = "";
        document.getElementById("priority").value = "";

        const suggestions =
            document.getElementById("suggestions");

        if (suggestions) {

            suggestions.innerHTML = "";
        }

    }
    catch(error)
    {
        console.error(error);

        Toast.error("Ticket Creation Failed", "Something went wrong while creating your ticket.");

        button.disabled = false;

        button.innerHTML =
            '<i class="bi bi-send-fill"></i> Create Ticket';
    }
}

function validateAndCreateTicket() {

    const title =
        document.getElementById("title");

    const category =
        document.getElementById("category");

    const priority =
        document.getElementById("priority");

    const description =
        document.getElementById("description");

    // Remove old validation
    document
        .querySelectorAll(".is-invalid")
        .forEach(x => x.classList.remove("is-invalid"));

    if(title.value.trim() === "")
    {
        title.classList.add("is-invalid");
        title.focus();
        return;
    }

    if(category.value.trim() === "")
    {
        category.classList.add("is-invalid");
        category.focus();
        return;
    }

    if(priority.value.trim() === "")
    {
        priority.classList.add("is-invalid");
        priority.focus();
        return;
    }

    if(description.value.trim() === "")
    {
        description.classList.add("is-invalid");
        description.focus();
        return;
    }

    createTicket();

}
// Load Tickets
let allTickets = [];
let currentPage = 1;
const pageSize = 10;
async function loadTickets() {

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    try {

        const response = await fetch(
            `http://localhost:5130/api/Tickets/user/${userId}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

        if (!response.ok) {
            throw new Error("Failed to load tickets");
        }

        const tickets = await response.json();
        allTickets = tickets.sort((a, b) => b.ticketId - a.ticketId);

        currentPage = 1;

        displayTickets();

        // Dashboard Counts
        document.getElementById("totalCount").innerText = tickets.length;

        document.getElementById("openCount").innerText =
            tickets.filter(t => t.status === "Open").length;

        document.getElementById("progressCount").innerText =
            tickets.filter(t => t.status === "In Progress").length;

        document.getElementById("resolvedCount").innerText =
            tickets.filter(t => t.status === "Resolved").length;

        const table = document.getElementById("ticketTableBody");

        if (tickets.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-5">

                        <i class="bi bi-inbox display-4 text-secondary"></i>

                        <h5 class="mt-3">
                            No Tickets Found
                        </h5>

                        <p class="text-muted">
                            Create your first support ticket.
                        </p>

                    </td>
                </tr>
            `;

            return;
        }

        let rows = "";

        tickets.forEach(ticket => {

            let priorityClass = "priority-low";

            if (ticket.priority === "High")
                priorityClass = "priority-high";
            else if (ticket.priority === "Medium")
                priorityClass = "priority-medium";

            let statusClass = "status-progress";

            if (ticket.status === "Open")
                statusClass = "status-open";
            else if (ticket.status === "Resolved")
                statusClass = "status-resolved";

            
            rows += `
                <tr>

                    <td>
                        <strong>#${ticket.ticketId}</strong>
                    </td>

                    <td>
                        ${ticket.title}
                    </td>

                    <td>
                        ${ticket.category}
                    </td>

                    <td>
                        ${
                            ticket.priority
                            ? renderPriorityBadge(ticket.priority)
                            : "-"
                        }
                    </td>

                    <td>
                        ${renderStatusBadge(ticket.status)}
                    </td>
                    <td class="text-center">

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

        table.innerHTML = rows;

    }
    catch (error) {

        console.error(error);

        Toast.error("Load Failed", "We could not load your tickets. Please refresh the page.");

    }
}


// Auto Load Tickets Page
window.onload = function () {
    loadUserInfo();
    loadNotifications();

    if(document.getElementById("totalTickets"))
    {
        loadEmployeeDashboard();
    }

    if(document.getElementById("ticketTableBody"))
    {
        loadTickets();
    }

    if(document.getElementById("ticketId"))
    {
        loadTicketDetails();
        loadComments();
        loadAttachments();
    }

    if(document.getElementById("historyTableBody"))
    {
        loadTicketHistory();
    }

    if(document.getElementById("profileUserId"))
    {
        loadProfile();
    }

};

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
        
        const created = new Date(ticket.createdAt);

        document.getElementById("createdDate").innerText =
            created.toLocaleDateString();

        document.getElementById("createdTime").innerText =
            created.toLocaleTimeString();

        document.getElementById("engineerName").innerText =
            ticket.engineerName ?? "Not Assigned";

        document.getElementById("engineerEmail").innerText =
            ticket.engineerEmail ?? "-";

        document.getElementById("engineerPhone").innerText =
            ticket.engineerPhoneNumber ?? "-";

        document.getElementById("timelineCreated").innerText =
            new Date(ticket.createdAt).toLocaleString();

        document.getElementById("timelineEngineer").innerText =
            ticket.engineerName ?? "Not Assigned";

        document.getElementById("timelineStatus").innerText =
            ticket.status;

    }
    catch(error)
    {
        console.error(error);
    }
}

async function addComment() {

    const token =
        localStorage.getItem("token");

    const params =
        new URLSearchParams(window.location.search);

    const ticketId =
        params.get("id");

    const comment =
        document.getElementById("commentText").value;

    if (!comment) {

        Toast.warning("Empty Comment", "Please enter a comment before submitting.");

        return;
    }

    try {

        await fetch(
            "http://localhost:5130/api/TicketComments",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    ticketId: ticketId,
                    comment: comment
                })
            });

        Toast.success("Comment Added", "Your comment was posted successfully.");

        document.getElementById("commentText").value = "";

        loadComments();

    }
    catch(error) {

        console.error(error);

        Toast.error("Comment Failed", "We could not add your comment. Please try again.");
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
            <div class="card border-0 shadow-sm mb-3">

                <div class="card-body">

                    <div class="d-flex justify-content-between">

                        <strong>

                            💬 User

                        </strong>

                        <small class="text-muted">

                            ${new Date(comment.createdDate).toLocaleString()}

                        </small>

                    </div>

                    <p class="mb-0 mt-2">

                        ${comment.comment}

                    </p>

                </div>

            </div>
            `;
        });

        document.getElementById("commentsList").innerHTML =
            html;
    }
    catch(error) {

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
            <div class="card border-0 shadow-sm mb-3">

                <div class="card-body d-flex justify-content-between align-items-center">

                    <div>

                        <i class="bi bi-file-earmark-text-fill text-primary fs-4 me-2"></i>

                        <strong>${file.fileName}</strong>

                    </div>

                    <a
                        href="http://localhost:5130/${file.filePath}"
                        target="_blank"
                        class="btn btn-outline-primary btn-sm">

                        <i class="bi bi-download"></i>

                        Download

                    </a>

                </div>

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

function logout() {

    Toast.queue("info", "Logged Out", "You have been signed out successfully.");

    localStorage.clear();

    window.location.href = "../login.html";
}

async function loadEmployeeDashboard() {

    const token =
        localStorage.getItem("token");

    try {

        const userId =
            localStorage.getItem("userId");

        const response =
            await fetch(
                `http://localhost:5130/api/Dashboard/employee/${userId}`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                });

        const data =
            await response.json();

        document.getElementById("totalTickets").innerText =
            data.totalTickets;

        document.getElementById("openTickets").innerText =
            data.openTickets;

        document.getElementById("resolvedTickets").innerText =
            data.resolvedTickets;

        loadTicketChart(
            data.openTickets,
            data.inProgressTickets || 0,
            data.resolvedTickets
        );

        if(document.getElementById("inProgressTickets"))
        {
            document.getElementById("inProgressTickets").innerText =
                data.inProgressTickets || 0;
        }

        let rows = "";

        data.recentTickets.forEach(ticket => {

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
                </tr>
            `;
        });

        const recentTable =
            document.getElementById("recentTickets");

        if(recentTable)
        {
            recentTable.innerHTML = rows;
        }

    }
    catch(error)
    {
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

                    <td>${item.historyId}</td>

                    <td>${item.ticketId}</td>

                    <td>${renderStatusBadge(item.status)}</td>

                    <td>
                        ${new Date(item.updatedDate).toLocaleString()}
                    </td>

                </tr>
            `;
        });

        document.getElementById(
            "historyTableBody"
        ).innerHTML = rows;

    }
    catch(error) {

        console.error(error);
    }
}

function loadTicketChart(open, inProgress, resolved) {

    const ctx =
        document.getElementById("ticketChart");

    if(!ctx)
        return;

    new Chart(ctx, {

        type: "doughnut",

        data: {

            labels: [
                "Open",
                "In Progress",
                "Resolved"
            ],

            datasets: [{

                data: [
                    open,
                    inProgress,
                    resolved
                ]

            }]
        }
    });
}

function parseJwt(token) {

    try {

        return JSON.parse(
            atob(token.split('.')[1])
        );
    }
    catch {

        return null;
    }
}

function loadUserInfo() {

    const token =
        localStorage.getItem("token");

    if(!token)
        return;

    const user =
        parseJwt(token);

    if(!user)
        return;

    const email =
        user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];
    
    const name =
        user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

    const welcome =
        document.getElementById("welcomeUser");

    if(welcome)
    {
        welcome.innerText =
            `Welcome ${name} 👋`;
    }

    const headerUser =
    document.getElementById("headerUser");

    if(headerUser)
    {
        headerUser.innerText = name;
    }

    const greetingText =
        document.getElementById("greetingText");

    if (greetingText) {

        const hour = new Date().getHours();

        let greeting = "Good Evening";

        if (hour < 12) {

            greeting = "Good Morning";

        }
        else if (hour < 17) {

            greeting = "Good Afternoon";

        }

        greetingText.innerHTML =
            `${greeting}, <span id="headerUser">${name}</span> 👋`;

    }

    const aiWelcome = document.getElementById("aiWelcome");

    if (aiWelcome) {

        aiWelcome.innerHTML = `
            👋 Hello ${name}

            <br><br>

            How can I help you today?
        `;

    }
}

async function askAI() {

    const query =
        document.getElementById("aiQuery").value.trim();

    if (query === "") {

        document.getElementById("aiQuery").focus();

        return;

    }

    const chat =
        document.getElementById("chatMessages");

    chat.innerHTML += `
    <div class="chat-message user">

        <div class="chat-bubble">

            ${query}

        </div>

    </div>
    `;

    const loadingId = "loading-" + Date.now();

    chat.innerHTML += `
    <div class="chat-message ai" id="${loadingId}">

        <div class="chat-bubble">

            🤖 AI is thinking...

        </div>

    </div>
    `;

chat.scrollTop = chat.scrollHeight;

    try {

        const response =
            await fetch(
                "http://localhost:5130/api/AI/suggestions",
                {
                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body:JSON.stringify({
                        description:query
                    })
                });

        const result =
            await response.text();

        chat.innerHTML += `
            <div class="chat-message ai">

                <div class="chat-bubble">

                    ${result}

                </div>

            </div>
            `;

        document.getElementById("aiQuery").value = "";

        chat.scrollTop =
            chat.scrollHeight;
    }
    catch(error){

        console.error(error);

        Toast.error("AI Assistant Error", "The AI assistant could not process your request.");
    }
}

function issueSolved(){

    Toast.success("All Set!", "Great! No ticket needed.");
}

async function createTicketFromChat(query) {

    const token =
        localStorage.getItem("token");

    const userId =
        localStorage.getItem("userId");

    try {

        const analyzeResponse =
            await fetch(
                "http://localhost:5130/api/AI/analyze",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        description: query
                    })
                });

        const analysis =
            await analyzeResponse.json();

        const ticket = {
            title: "AI Generated Ticket",
            description: query,
            category: analysis.category,
            priority: analysis.priority,
            createdByUserId: parseInt(userId)
        };

        const ticketResponse =
            await fetch(
                "http://localhost:5130/api/Tickets",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(ticket)
                });

        if (!ticketResponse.ok)
        {
            const error =
                await ticketResponse.text();

            Toast.error("Ticket Creation Failed", error);

            return;
        }

        const result =
            await ticketResponse.json();

        Toast.success("Ticket Created", `Ticket #${result.ticketId} was created successfully.`);

        window.location.href =
            "my-tickets.html";
    }
    catch(error)
    {
        console.error(error);
        Toast.error("Ticket Creation Failed", "Something went wrong while creating your ticket.");
    }
}

function loadProfile() {

    const token =
        localStorage.getItem("token");

    if(!token)
        return;

    const user =
        parseJwt(token);

    document.getElementById("profileUserId").innerText =
        user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

    document.getElementById("profileEmail").innerText =
        user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"];

    document.getElementById("profileRole").innerText =
        user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
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

        if(!response.ok)
        {
            console.error(
                "Notification API Error"
            );

            return;
        }

        const notifications =
            await response.json();

        const notificationCount =
            document.getElementById("notificationCount");

        if (notificationCount) {

            notificationCount.innerText =
                notifications.length;

        }

        let html = "";

        notifications.forEach(n => {

            html += `
                <div class="border-bottom pb-2 mb-2">

                    ${n.message}

                    <br>

                    <small class="text-muted">
                        ${n.createdDate}
                    </small>

                </div>
            `;
        });

        const notificationList =
            document.getElementById("notificationList");

        if (notificationList) {

            notificationList.innerHTML = html;

        }
    }
    catch(error) {

        console.error(error);
    }
}

function toggleNotifications() {

    const panel =
        document.getElementById(
            "notificationPanel"
        );

    if(panel.style.display === "none")
    {
        panel.style.display = "block";
    }
    else
    {
        panel.style.display = "none";
    }
}

function filterTickets() {

    const search =
        document
        .getElementById("searchBox")
        .value
        .toLowerCase();

    const rows =
        document.querySelectorAll(
            "#ticketTableBody tr"
        );

    rows.forEach(row => {

        const text =
            row.innerText.toLowerCase();

        row.style.display =
            text.includes(search)
            ? ""
            : "none";
    });
}

function filterTickets() {

    const search =
        document
        .getElementById("searchBox")
        .value
        .toLowerCase();

    const status =
        document
        .getElementById("statusFilter")
        .value;

    const rows =
        document.querySelectorAll(
            "#ticketTableBody tr"
        );

    rows.forEach(row => {

        const text =
            row.innerText.toLowerCase();

        const matchesSearch =
            text.includes(search);

        const matchesStatus =
            status === "" ||
            row.innerText.includes(status);

        row.style.display =
            matchesSearch &&
            matchesStatus
            ? ""
            : "none";
    });
}

// Status/priority badge markup now lives in js/status-badges.js
// (renderStatusBadge / renderPriorityBadge) so it stays identical
// across the Employee, Engineer and Admin modules.
function getStatusBadge(status){
    return renderStatusBadge(status);
}

function getPriorityBadge(priority){
    return renderPriorityBadge(priority);
}


function askSuggestion(question) {

    document.getElementById("aiQuery").value = question;

    askAI();

}
const aiInput = document.getElementById("aiQuery");

if (aiInput) {

    aiInput.addEventListener("keydown", function (e) {

        if (e.key === "Enter") {

            e.preventDefault();

            askAI();

        }

    });

}
const aiButton = document.getElementById("aiToggle");

if (aiButton) {

    aiButton.onclick = function (event) {

        event.stopPropagation();

        const popup = document.getElementById("aiPopup");

        popup.classList.add("show");

        document.getElementById("aiQuery").focus();

    };

}

const popup = document.getElementById("aiPopup");

if (popup) {

    popup.addEventListener("click", function (event) {

        event.stopPropagation();

    });

}

function closeAI(){

    document
        .getElementById("aiPopup")
        .classList.remove("show");

}

const hour = new Date().getHours();

let greeting = "Good Evening";

if (hour < 12) {

    greeting = "Good Morning";

}
else if (hour < 17) {

    greeting = "Good Afternoon";

}

const profileName = document.getElementById("profileName");

if (profileName) {

    const userName = profileName.innerText;

    document.querySelector(".dashboard-title").innerHTML =
        `Welcome ${userName}`;

}

const greetingText = document.getElementById("greetingText");
const headerUser = document.getElementById("headerUser");

if (greetingText && headerUser && profileName) {

    headerUser.innerText = profileName.innerText;

    greetingText.innerHTML =
        `${greeting}, <span id="headerUser">${profileName.innerText}</span> 👋`;

}


// Close AI popup when clicking outside

document.addEventListener("click", function(event) {

    const popup = document.getElementById("aiPopup");
    const button = document.getElementById("aiToggle");

    if (
        popup.classList.contains("show") &&
        !popup.contains(event.target) &&
        !button.contains(event.target)
    ) {
        popup.classList.remove("show");
    }

});

function scrollChatToBottom() {

    const chat = document.getElementById("chatMessages");

    if (chat) {

        chat.scrollTop = chat.scrollHeight;

    }

}

const attachmentInput =
    document.getElementById("attachment");

if (attachmentInput) {

    attachmentInput.addEventListener("change", function () {

        const fileName =
            this.files.length > 0
                ? this.files[0].name
                : "No file selected";

        document.getElementById("selectedFile").innerText =
            fileName;

    });

}

function displayTickets() {

    const table = document.getElementById("ticketTableBody");

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    const pageTickets = allTickets.slice(start, end);

    let rows = "";

    pageTickets.forEach(ticket => {

        rows += `
        <tr>

            <td><strong>#${ticket.ticketId}</strong></td>

            <td>${ticket.title}</td>

            <td>${ticket.category}</td>

            <td>
                ${renderPriorityBadge(ticket.priority)}
            </td>

            <td>
                ${renderStatusBadge(ticket.status)}
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

    table.innerHTML = rows;

    const totalPages =
        Math.ceil(allTickets.length / pageSize);

    document.getElementById("pageNumber").innerText =
        currentPage;

    const previous =
        document.querySelector(".pagination .page-item:first-child");

    const next =
        document.querySelector(".pagination .page-item:last-child");

    previous.classList.toggle(
        "disabled",
        currentPage === 1
    );

    next.classList.toggle(
        "disabled",
        currentPage === totalPages
    );
}

function nextPage() {

    const totalPages = Math.ceil(allTickets.length / pageSize);

    if (currentPage < totalPages) {

        currentPage++;

        displayTickets();

        document.getElementById("pageNumber").innerText = currentPage;
    }
}

function previousPage() {

    if (currentPage > 1) {

        currentPage--;

        displayTickets();

        document.getElementById("pageNumber").innerText = currentPage;
    }
}

document.addEventListener("click", function (event) {

    const popup = document.getElementById("aiPopup");
    const button = document.getElementById("aiToggle");

    if (!popup || !button) return;

    // If popup is not open, do nothing
    if (!popup.classList.contains("show")) return;

    // If click is inside popup or on AI button, do nothing
    if (
        popup.contains(event.target) ||
        button.contains(event.target)
    ) {
        return;
    }

    // Otherwise close popup
    popup.classList.remove("show");

});