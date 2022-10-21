import { useState, useEffect } from "react";
import axios from "axios"
import LoginPage from "./login-page"
import RegisterPage from "./register-page"
import WelcomePage from "./welcome-page"
import MainPage from "./main-page"
import ProfilePage from "./profile-page"
import MatchesPage from "./matches-page"

export default function App() {
  const [page, setPage] = useState("")
  const [error, setError] = useState("")
  const [user, setUser] = useState({})

  // Get user info from session
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/api/session")
        if (response.data.userSession.user_id) {
          setUser(response.data.userSession) 
          setPage("S") // Render main (swipe) page
        }       
        else
          setPage("W") // Render welcome page
    }
    fetchData()
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
      setPage("S") // Render main (swipe) page
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
      setPage("W") // Render welcome page
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
        case "S":
          return <MainPage user={user} Logout={Logout}/>
    }
  }

  return (
    <div className="App">
      {renderPage(page)}
    </div>
  )
}
 
