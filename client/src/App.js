import { useState } from "react"
import axios from "axios"
import LoginPage from "./login-page"
import RegisterPage from "./register-page"
import WelcomePage from "./welcome-page"
import MainPage from "./main-page"
import ProfilePage from "./profile-page"
import MatchesPage from "./matches-page"

export default function App() {
  const [page, setPage] = useState("W")
  const [error, setError] = useState("")
  let user = {} // Logged on user details
  let bagel = {}

  // Check if user logged in and get user info from session
  axios.get("/api/session").then((response) => {
      if (response.data.userSession.user_id) {
        user = response.data.userSession
        // Get first bagel for user and bagels interests
        axios.get("/api/main").then((response) => {
            bagel = response.data
            setPage("") // Render main page
        })       
      }
  })

  const displayPage = type => {
    setPage(type)
  }  

  const Register = data => {
    // API call to register
    axios.post("/api/register", data).then((response) => {
        setPage("L") // Render login page
      })
      .catch((error) => {
        if (error.response.status === 500) {
            setError("Oops, failed to sign up. Please try again.")
        } else {
            setError(error.response.data.message)
        }
      });
  }    

  const Login = data => {
    // API call to login
    axios.post("/api/login", data).then((response) => {
      setPage("")
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
    axios.delete("/api/session").then((response) => {
      setPage("W")
    })
    .catch((err) => {alert(err)})
  }

  const renderPage = () => {
    switch (page) {
      case "W":
        return <WelcomePage displayPage={displayPage}/>
      case "L":
        return <LoginPage Login={Login} displayPage={displayPage} error={error}/>
        case "R":
          return <RegisterPage Register={Register} displayPage={displayPage} error={error}/>
        case "P":
          return <ProfilePage/>
        case "M":
          return <MatchesPage/>  
        default:
          console.log(user)
          console.log(bagel)
          return <MainPage user={user} bagel={bagel} Logout={Logout}/>
    }
  }

  return (
    <div className="App">
      {renderPage(page)}
    </div>
  )
}
 
