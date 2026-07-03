localStorage.setItem("token", data.token);
localStorage.setItem("role", data.role);

if(data.role === "Employee")
{
    window.location.href = "employee/dashboard.html";
}
else if(data.role === "Engineer")
{
    window.location.href = "engineer/dashboard.html";
}
else
{
    window.location.href = "admin/dashboard.html";
}