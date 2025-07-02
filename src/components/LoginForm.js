// import { Profile } from "./Profile.js";
export default function LoginForm() {
  return `
    <div class="Loginform glassmorphic">
      <form novalidate>
        <label for="username">Username</label>
        <input class="username" name="username" type="text" autocomplete="username" placeholder="Enter username" required />
        
        <label for="password">Password</label>
        <input class="password" name="password" type="password" autocomplete="current-password" placeholder="Enter password" required minlength="7" />
        
        <button class="formsubmit" type="submit">Login</button>
      </form>
      <div class="error-message" aria-live="polite"></div>
    </div>`;
}

// Attach to DOM & handle logic
const token = localStorage.getItem("jwt")
if (token == null) {


const container =   document.createElement("div")
container.classList.add("login-form-container")
container.innerHTML = LoginForm();
const main = document.querySelector("main")
main.innerHTML = ""
main.appendChild(container)



  const form = container.querySelector("form");
  var errorMessageDiv = container.querySelector(".error-message");
  

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError();

    const username = form.querySelector(".username").value.trim();
    const password = form.querySelector(".password").value;

    if (!validateCredentials(username, password)) {
      showError("Invalid username or password format.");
      return;
    }

    try {
      const response = await fetch("https://learn.zone01oujda.ma/api/auth/signin", {
        method: "POST",
        headers: { 'Authorization': `Basic ${btoa(`${username}:${password}`)}` }
      });

      if (!response.ok) throw new Error("Login failed. Please check your credentials.");

      const data = await response.text();
      const token = data.slice(1, -1); // Remove quotes if any
      localStorage.setItem("jwt", token);

      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("Payload:", payload);

      // You can trigger profile reload or redirect here
      window.location.reload()
    } catch (err) {
      showError(err.message);
      console.error(err);
    }
  });
}

function validateCredentials(username, password) {
  return username.length >= 5 && password.length >= 7;
}

function showError(msg) {
  errorMessageDiv.textContent = msg;
  errorMessageDiv.style.opacity = "1";
  errorMessageDiv.style.color = "darkred"
  errorMessageDiv.style.margin="15px 4px"
  setTimeout(() => {
    errorMessageDiv.style.opacity = "0";
  }, 3000);
}

function clearError() {
  ;
  
  errorMessageDiv.textContent = "";
  errorMessageDiv.style.opacity = "0";
}

export function Logout() {
    localStorage.removeItem("jwt")
    window.location.reload()
console.log("aaaaaaaaaaaaaaaaaa");


}
