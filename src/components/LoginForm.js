export default function LoginForm() {

    return `  
    <div class="Loginform">
        <form action="" method="post">
            <label for="username">username</label>
            <input class='username' name="username" type="text">
            <label for="password">password</label>
            <input class='password' name="password" type="password">
            <button class="formsubmit" type="submit">Login</button>
        </form>
    </div>`
}


const container = document.querySelector("#container")
container.innerHTML = LoginForm()
const LoginFormInput = container.querySelector(".Loginform")
console.log(container);

const submitButton = container.querySelector(".formsubmit")
submitButton.addEventListener("click", (e) => {
    e.preventDefault()
    const cred = GetCred()
    if (cred.Error) {
        window.alert(cred.Error)
        return
    }
    fetch("https://learn.zone01oujda.ma/api/auth/signin",
        { method: "POST", headers: { 'Authorization': cred.Encoded } }
    ).then(respo => {
        if (!respo.ok) throw new Error("Ooops SomethingHappened...")
       return respo.text()
    })
        .then(data => {
            const token = data

            localStorage.setItem("jwt", token.slice(1, token.length-1))
                        console.log("tooooooooken", token.slice(1, token.length-1));

            const playload = JSON.parse(atob(token.split('.')[1]))
            console.log("load",playload);

        }).catch(err => {
            console.log(err, LoginFormInput);

            InjectErr(err, LoginFormInput)
        })
})


function GetCred() {
    const name = document.querySelector(".username").value
    const password = document.querySelector(".password").value
    if (name === "" || password === "" || password.length < 7 || name.length < 5)
        return { Error: new Error("Wrong Password or Username Format") }
    return { Encoded: `Basic ${btoa(`${name}:${password}`)}`};
}


function InjectErr(errMsg, container) {
    console.log("container", container);
    const err = document.createElement("div")

    err.innerHTML = `<p class='err'>${errMsg}</p>`
    console.log(err)
    container.appendChild(err)
    if (err) setTimeout(() => { container.removeChild(err) }, 2000)
}