import { Logout } from "../components/LoginForm.js";
export async function fetchGraph(query) {
    const token = localStorage.getItem("jwt")
    console.log("tooken",token);
    
   return fetch("https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql",
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(query)
        }
    ).then(resp => {
        if (!resp.ok) throw new Error("netowrk Error")
        return resp.json()
    }).then(data => data )
    
    .catch(err => {
        console.log(err);
        Logout()
         throw err;
         
    })
}