import { fetchGraph } from "../services/graphql.js";
import { createSVG } from "../utils/App.js";
import { fetchXp } from "./Profile.js";



export async function GetXP(SortBy) {

 const fn = SortBy !== "XP" ? (a, b) => { return new Date(a.createdAT) > new Date(b.createdAT)? 1 :-1} :
        (a,b)=> { return a.amount > new Date(b.amount)? 1 :-1}
  try {

    const xp = await fetchXp()
    console.log("xppppppppppppppppp", xp.data.user[0].transactions.sort((a, b) => { return new Date(a.createdAT) > new Date(b.createdAT) ? 1 : -1 }))
    return xp.data.user[0].transactions.sort(fn)

  } catch (error) {
    console.log(error);
    throw error
  }
}



function DrawXpchart() {

  const viewBox = createSVG("svg", { viewBox: "0 0 500 300", preserveAspectRatio: "xMidYMid meet"  ,  fill: "black"})
  // viewBox.style.width = "100%";
  // viewBox.style.height = "auto";
  return viewBox
}


export async function LineChart() {
  try {
    const svg = DrawXpchart();
    const XpByDate = await GetXP();
    const container = document.querySelector("#container");
    const MaxXp = Math.max(...XpByDate.map(d => d.amount));

    XpByDate.forEach((d, i) => {
      const x = i * (500 / (XpByDate.length - 1));
      const y = 280 - (d.amount / MaxXp) * 250;

      svg.appendChild(createSVG("circle", { cx: x, cy: y, r: 4, fill: "blue" }));

      if (i > 0) {
        const prevX = (i - 1) * (500 / (XpByDate.length - 1));
        const prevY = 280 - (XpByDate[i - 1].amount / MaxXp) * 250;

        svg.appendChild(createSVG("line", {
          x1: prevX,
          y1: prevY,
          x2: x,
          y2: y,
          stroke: "blue",
          "stroke-width": 2
        }));
      }
    });

    container.appendChild(svg);
  } catch (error) {
    console.log("Error in LineChart:", error);
    throw error;
  }
}
