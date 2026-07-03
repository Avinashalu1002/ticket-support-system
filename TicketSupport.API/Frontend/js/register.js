async function register() {

    const name =
        document.getElementById("name").value.trim();

    const employeeId =
        document.getElementById("employeeId").value.trim();

    const email =
        document.getElementById("email").value.trim();

    const phoneNumber =
        document.getElementById("phoneNumber").value.trim();

    const password =
        document.getElementById("password").value;

    const department =
        document.getElementById("department").value.trim();

    const role =
        document.getElementById("role").value;

    if (!name || !employeeId || !email || !phoneNumber || !password || !department) {

        Toast.error("Missing Information", "Please fill in all fields before submitting.");
        return;
    }

    try {

        const response =
            await fetch(
                "https://ticket-support-api-uyjm.onrender.com/api/Auth/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        employeeId: employeeId,
                        email: email,
                        phoneNumber: phoneNumber,
                        password: password,
                        department: department,
                        role: role
                    })
                });

        const data =
            await response.json();

        if (!response.ok || (data.message && data.message.toLowerCase().includes("already exists"))) {

            Toast.error("Registration Failed", data.message || "Unable to register. Please try again.");
            return;
        }

        Toast.success("Registration Successful", data.message || "Your account has been created!");

        setTimeout(function () {
            window.location.href = "login.html";
        }, 1000);

    }
    catch (error) {

        console.error(error);

        Toast.error("Registration Failed", "Something went wrong. Please try again.");
    }

}