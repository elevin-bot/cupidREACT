import { useState } from "react"
import LoginForm from "./login"
import axios from "axios"
import RegisterForm from "./register"

export default function App() {
  const [user, setUser] = useState("")
  const [register, setRegister] = useState(false)
  const [error, setError] = useState("")

  // Chekc if user logged in and get user info from session
  axios.get("/api/session")
    .then((response) => {
      if (response.data.userSession.user_id) {
        setUser(response.data.userSession.name)
      }
  })

  const Login = data => {
    // API call to login
    axios.post("/api/login", data)
      .then((response) => {
        setUser(data.email)
      })
      .catch((error) => {
        if (error.response.status === 500) {
            setError("Oops, failed to sign up. Please try again.")
        } else {
            setError(error.response.data.message)
        }
      });
  }    

  const registerForm = () => {
    setRegister(true)
    setError("")
  }  

  const loginForm = () => {
    setRegister(false)
    setError("")
  }  

  const Register = data => {
    // API call to register
    axios.post("/api/register", data)
      .then((response) => {
        setUser("") // Render login form
        setRegister(false)  
      })
      .catch((error) => {
        if (error.response.status === 500) {
            setError("Oops, failed to sign up. Please try again.")
        } else {
            setError(error.response.data.message)
        }
      });
  }    

  const Logout = () => {
    axios.delete("/api/session")
      .then((response) => {
        setUser("")
        setError("")
    })
    .catch((err) => {alert(err)})
  }

  return (
    <div className="App">
      {(user !== "") ? (
        <div className="welcome">
          <h2>Welcome, <span>{user}</span></h2>
         <button className="input" onClick={Logout}>Logout</button>
        </div>
      ) : ((register) ? (
            <RegisterForm Register={Register} loginForm={loginForm} error={error}/>
      ) : (
            <LoginForm Login={Login} registerForm={registerForm} error={error}/>
      ))}
    </div>
  );
}
 
