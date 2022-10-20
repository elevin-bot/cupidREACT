import axios from "axios"

export default function MainPage({user, Logout}) {

    axios.get("/api/main").then((response) => {
        const bagel = response.data
    })       

  return (
    <div className="welcome">
        <h2>Welcome, <span>{user.name}</span></h2>
        <button className="input" onClick={Logout}>Logout</button>
    </div>
  )
}
