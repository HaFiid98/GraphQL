import { fetchGraph } from "../services/graphql.js";
import { createSVG } from "../utils/App.js";
import { fetchXp } from "./Profile.js";

// Sorting XP based on selected criteria (date or amount)
export async function GetXP(SortBy = "date") {
  const fn = SortBy !== "XP"
    ? (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    : (a, b) => b.amount - a.amount;

  try {
    const xp = await fetchXp();
    console.log("xxxxxxxxxxxxxp", xp);
    
    const transactions = xp|| [];
    return [...transactions].sort(fn);
  } catch (error) {
    console.error("Error fetching XP:", error);
    throw error;
  }
}

// Create styled chart container with abstract glass style
export function DrawXpchart() {
  const svg = createSVG("svg", {
    viewBox: "0 0 500 300",
    preserveAspectRatio: "xMidYMid meet",
    class: "xp-line-chart",
        fill: "white" // no default fill for svg container itself

  });
  return svg;
}

export async function LineChart() {
  try {
    const svg = DrawXpchart();
    const xpByDate = await GetXP("date");
    const fullXP = xpByDate.reduce((acc, curr) => acc + curr.amount, 0);
    const maxXP = Math.max(...xpByDate.map(d => d.amount));

    const container = document.querySelector("#xp-chart");
    console.log("coontainer llllll", container);
    console.log(xpByDate, "xpbyyyyyyyyyyyyyyy");
    
    container.innerHTML = ""; // Clear before drawing

    xpByDate.forEach((d, i) => {
      console.log("iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
      
      if (d.amount < 0) d.amount = 0;
      let x = i * (470 / (xpByDate.length - 1));
      if(i===0)x +=3
  
      const y = 280 - (d.amount / maxXP) * 250;
      const percentage = ((d.amount * 100) / fullXP).toFixed(2);
      const percentLabel = `${percentage}%`;
      const projectName = d.object.name?.slice(0, 12) || "Unknown";

      // Create point
      const point = createSVG("circle", {
        cx: x,
        cy: y,
        r: 3,
        fill: "rgb(255, 255, 255)",
        class: "chart-point"
      });

      const tooltip = createSVG("title");
      tooltip.textContent = `Project: ${projectName}\nContribution: ${percentLabel}`;
      point.appendChild(tooltip);
      console.log(point, "poooint");
      svg.appendChild(point);
      

      // Connect lines
      if (i > 0) {
        const prevX = (i - 1) * (470 / (xpByDate.length - 1));
        const prevY = 280 - (xpByDate[i - 1].amount / maxXP) * 250;

        svg.appendChild(createSVG("line", {
          x1: prevX,
          y1: prevY,
          x2: x,
          y2: y,
          stroke: "rgb(255, 255, 255)",
          "stroke-width": 0.5,
          class: "chart-line"
        }));
      }
    });
    container.appendChild(svg);

    console.log("conttttttttttttttttttttt", container);
    
  } catch (error) {
    console.error("Error in LineChart:", error);
  }
}
