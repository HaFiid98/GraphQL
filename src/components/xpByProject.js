import { createSVG } from '../utils/App.js';
import {DrawXpchart} from './components/xpOverTime.js'
import { GetXP } from './xpOverTime.js'


export async function GetXPByProject() {
  try {
    const xp = await fetchXp();
    const transactions = xp.data.user[0].transactions;

    // Group by project name
    const grouped = {};

    transactions.forEach(t => {
      const projectName = t.object?.name || "Unknown";
      grouped[projectName] = (grouped[projectName] || 0) + t.amount;
    });

    const projectXPArray = Object.entries(grouped).map(([name, amount]) => ({ name, amount }));

    return projectXPArray;

  } catch (error) {
    console.error("Error fetching XP by project:", error);
    throw error;
  }
}


export async function XPByProjectChart() {
  try {
    const svg = DrawXpchart();
    const container = document.querySelector("#container");
    container.innerHTML = ""; // clear previous chart
    const xpData = await GetXPByProject();

    const MaxXp = Math.max(...xpData.map(d => d.amount));
    const barWidth = 500 / xpData.length;

    xpData.forEach((d, i) => {
      const x = i * barWidth;
      const height = (d.amount / MaxXp) * 250;
      const y = 280 - height;

      svg.appendChild(createSVG("rect", {
        x,
        y,
        width: barWidth - 5,
        height,
        fill: "teal"
      }));

 
      svg.appendChild(createSVG("text", {
        x: x + barWidth / 2,
        y: 295,
        "font-size": "10",
        "text-anchor": "middle"
      })).textContent = d.name.slice(0, 10);
    });

    container.appendChild(svg);
  } catch (error) {
    console.error("Error in XPByProjectChart:", error);
    throw error;
  }
}

