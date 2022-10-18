import { useState } from "react"
import LoginForm from "./login"
import axios from "axios"

export default function App() {
  const [user, setUser] = useState("")
  const [error, setError] = useState("")

  const Login = data => {
    // API call to login
    axios.post("/api/session", data)
      .then((response) => {
        setUser(data.email)
        setError("")  
      })
      .catch((error) => {
        if (error.response.status === 500) {
            setError("Oops, failed to sign up. Please try again.")
        } else {
            setError(error.response.data.message)
        }
      });
  }    

  const Logout = () => {setUser("")}

  return (
    <div className="App">
      {(user !== "") ? (
        <div className="welcome">
          <h2>Welcome, <span>{user}</span></h2>
         <button onClick={Logout}>Logout</button>
        </div>
      ) : (
        <LoginForm Login={Login} error={error}/>
      )}
    </div>
  );
}
 
