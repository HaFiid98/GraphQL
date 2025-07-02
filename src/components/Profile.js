import { fetchGraph } from "../services/graphql.js"

export async function fetchXp() {
  const xpQuery = {
    query:
      `
{
  user {
    transactions(where : 
      {_and: [{type :{ _eq : "xp"}} , 
				{eventId : {_eq : 41}}]}
    ){
      amount
      createdAt
    }
    }
}
    `
  }
  try {
    const xp = await fetchGraph(xpQuery)
    console.log(xp);
    return xp
  } catch (error) {
    console.log("Failed to fetch XP:", error);

    throw error;

  }

}




export async function currentXP() {
  try {
    const xp = await fetchXp()
    console.log(xp.data.user[0].transactions);
    const xpp = xp.data.user[0].transactions.reduce((acc, current) => { return acc + current.amount }, 0)
    console.log("aamount", xpp);
    const XpAMount = (xpp / Math.pow(1000, 2))
    const XpConverstion = XpAMount >= 1 ? "MB" : "KB"
    return `<p class="CurrentXp"> ${XpConverstion === "KB" ? (XpAMount * 1000).toFixed() : XpAMount.toFixed(2)}${XpConverstion}</p>`
  } catch (error) {
    console.log(error);
    throw error

  }

}


export async function AuditRatio() {
  const AuditQuery = {
    query: `{
  user{
    auditRatio
  }
}`
  }
  try {
    const Audit = await fetchGraph(AuditQuery)
    console.log("audiiit", Audit.data.user[0].auditRatio);
    const Res = Audit.data.user[0].auditRatio
    //  > 1 ? (Audit.data.user[0].auditRatio).toFixed(2): Audit.data.user[0].auditRatio

    return `<p class="AuditRatio"> Audit Ratio : ${Math.ceil(10 * Res) / 10} </p>`

  } catch (error) {
    console.log(error);
    throw error
  }

}

const Audit = await AuditRatio()
console.log(Audit);


export async function UserName() {
  const UsernameQUey = {
    query: `{ 
user
{
  login
  firstName
  lastName}}`}


  try {

    const Username = await fetchGraph(UsernameQUey)
    const Login = Username.data.user[0].login
    const Fullname = `Hello ${Username.data.user[0].firstName}${Username.data.user[0].lastName}`
    console.log("usseername", Username, Fullname, Login);

    return `<p> ${Fullname}<p>`



  } catch (error) {
    console.log(error);
    throw error
  }
}

await UserName()