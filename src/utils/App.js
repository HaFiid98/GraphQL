import { Profile } from '../components/Profile.js';
import { LineChart } from '../components/xpOverTime.js';
import { XPByProjectChart } from '../components/xpByProject.js';
import { Logout } from '../components/LoginForm.js';


function initApp() {
  const logoutButton = document.createElement("button")
  logoutButton.className = "logout-btn"
  logoutButton.textContent = "Logout"
  logoutButton.addEventListener("click", Logout)

  document.addEventListener("DOMContentLoaded", async () => {
    // Insert login form



    const token = localStorage.getItem("jwt")
    if (token != null) {
      
      console.log("loooooooooooooged");
      
      document.querySelector("nav").appendChild(logoutButton)
      await Profile();
      await LineChart();
      await XPByProjectChart();

    } else {
      console.log('immmmmmmmmm here ');

      document.querySelector("main").innerHTML = LoginForm();
      document.querySelector("nav").removeChild(logoutButton)
    }

    // Render user profile and charts once form is present
  });
}

initApp();

export function createSVG(type, attr = {}) {
  const Svgelement = document.createElementNS("http://www.w3.org/2000/svg", type)
  for (const [key, value] of Object.entries(attr)) {
    Svgelement.setAttribute(key, value)
  }
  return Svgelement
}