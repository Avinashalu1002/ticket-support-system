async function login() {

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    try {

        const response =
            await fetch(
                "https://ticket-support-api-uyjm.onrender.com/api/Auth/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });

        const data =
            await response.json();

        localStorage.setItem(
            "token",
            data.token);

        localStorage.setItem(
            "role",
            data.role);

        localStorage.setItem(
            "email",
            email);

        // Extract UserId from JWT Token

        const payload =
            JSON.parse(
                atob(
                    data.token.split(".")[1]
                )
            );

        const userId =
            payload[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
            ];

        localStorage.setItem(
            "userId",
            userId);

        // Extract Name from JWT Token

        const name =
            payload[
                "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
            ];

        localStorage.setItem(
            "name",
            name);


        Toast.success("Login Successful", data.message || "Welcome back!");
const role = data.role.toLowerCase();

        let destination = null;

        if (role === "employee") {

            destination = "employee/dashboard.html";
        }
        else if (role === "engineer") {

            destination = "engineer/dashboard.html";
        }
        else if (role === "admin") {

            destination = "admin/dashboard.html";
        }
        else {

            Toast.error("Unknown Role", "Role \"" + data.role + "\" is not recognized.");
        }

        if (destination) {

            setTimeout(function () {
                window.location.href = destination;
            }, 700);
        }
            }
    catch (error) {

        console.error(error);

        Toast.error("Login Failed", "Please check your credentials and try again.");
    }
}