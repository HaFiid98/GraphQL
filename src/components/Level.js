import { fetchGraph } from "../services/graphql.js";

export default async function RenderUserLevel() {
    const level = await fetchGraph({
        query: `
{
user {
  transactions(
    where: { type: { _eq: "level" }, eventId: { _eq: 41 } }
    order_by: { amount: desc}
    limit: 1
  ){
    type
    amount
  }
}  
  }`})
  try {
       console.log("leeeevel", level, level.data.user[0].transactions[0].amount);


    return `<p class="bento-box reveal"> <b>LEVEL</b><br><br> ${level.data.user[0].transactions[0].amount}</p>`
  } catch (error) {
    console.log(error);
    throw error
    
  }

 
}