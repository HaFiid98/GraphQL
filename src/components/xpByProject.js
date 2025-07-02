import { createSVG } from '../utils/App.js';
import { DrawXpchart } from '../components/xpOverTime.js';
import { fetchXp } from './Profile.js';

export async function GetXPByProject() {
  try {
    const xp = await fetchXp();
    const transactions = xp;
    console.log(transactions ,  "dddddddddddddd", xp.data);
    

    const grouped = {};

    transactions.forEach(t => {
      const projectName = t.object?.name || "Unknown";
      grouped[projectName] = (grouped[projectName] || 0) + t.amount;
    });

    const projectXPArray = Object.entries(grouped)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount + a.amount); // sort descending

    console.log("Grouped XP by Project:", projectXPArray);
    return projectXPArray;
  } catch (error) {
    console.error("Error fetching XP by project:", error);
    throw error;
  }
}

export async function XPByProjectChart() {
  try {
    const svg = DrawXpchart();
    const container = document.querySelector("#project-xp-chart");
    container.innerHTML = "";

    const xpData = await GetXPByProject();

    const maxXP = Math.max(...xpData.map(d => d.amount));
    const fullXP = xpData.reduce((acc, cur) => acc + cur.amount, 0);
    const barWidth = 500 / xpData.length;

    xpData.forEach((d, i) => {
      const x = i * barWidth;
      const height = (d.amount / maxXP) * 250;
      const y = 280 - height;
      const percent = ((d.amount * 100) / fullXP).toFixed(2);

      const bar = createSVG("rect", {
        x,
        y,
        width: barWidth - 6,
        height,
        rx: 5,
        ry: 5,
        class: "chart-bar"
      });

      const tooltip = createSVG("title");
      tooltip.textContent = `Project: ${d.name}\nContribution: ${percent}%`;
      bar.appendChild(tooltip);

      svg.appendChild(bar);
    });

    container.appendChild(svg);
  } catch (error) {
    console.error("Error in XPByProjectChart:", error);
    throw error;
  }
}
