import { fetchGraph } from "../services/graphql.js";
import RenderUserLevel from "./Level.js";
import { Logout } from "./LoginForm.js";

export async function fetchXp() {
  const xpQuery = {
    query: `{
      user {
        transactions(where: {
          _and: [{type: {_eq: "xp"}}, {eventId: {_eq: 41}}]
        }) {
          amount
          createdAt
          object {
            name
          }
        }
      }
    }`
  };
  const res = await fetchGraph(xpQuery);
  return res.data.user[0].transactions;
}

export async function currentXP() {
  const transactions = await fetchXp();
  const total = transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const mb = total / 1_000_000;
  const isMB = mb >= 1;
  return `
    <div class="bento-box glass reveal">
      <h3>Current XP</h3>
      <p>${isMB ? mb.toFixed(2) + " MB" : (mb * 1000).toFixed() + " KB"}</p>
    </div>`;
}

export async function AuditRatio() {
  const query = { query: `{ user { auditRatio } }` };
  const res = await fetchGraph(query);
  const ratio = Math.ceil(10 * res.data.user[0].auditRatio) / 10;
  return `
    <div class="bento-box glass reveal">
      <h3>Audit Ratio</h3>
      <p>${ratio}</p>
    </div>`;
}

export async function UserName() {
  const query = { query: `{ user { login firstName lastName } }` };
  const res = await fetchGraph(query);
  const { firstName, lastName } = res.data.user[0];
  return `
    <div >
      <h1 class="greeting">Hello, ${firstName} ${lastName}</h1>
    </div>`;
}

export  async  function Profile() {
  const container = document.querySelector("#user_identication");
  if (!container) return;

  try {
    container.innerHTML = `
      <div class="bento-box glass reveal">Loading user data...</div>
    `;

    const [name, audit, xp, level] = await Promise.all([
      UserName(),
      AuditRatio(),
      currentXP(),
      RenderUserLevel()
    ]);
    console.log();
    

    container.innerHTML = name + audit + xp + level;

  } catch (err) {
    container.innerHTML = `<div class="bento-box glass reveal"><p>Failed to load profile.</p></div>`;
    console.error("Profile Load Error:", err);
    Logout()
  }
}
