import { useState, useEffect } from "react";
import axios from "axios"
import LoginPage from "./login-page"
import RegisterPage from "./register-page"
import WelcomePage from "./welcome-page"
import MainPage from "./main-page"
import MatchesPage from "./matches-page"

export default function App() {
  const [page, setPage] = useState("")
  const [error, setError] = useState("")
  const [user, setUser] = useState({})

  // Check if user logged in and get session info
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get("/api/session")
        if (response.data.user_id) {
          setUser(response.data) 
          setPage("Main") // Render main (swipe) page
        }       
        else
          setPage("Welcome") // Render welcome page
    }
    fetchData()
  }, [])   

  const displayPage = type => {
    setPage(type)
  }  

  const Register = data => {
    // API call to register
    axios.post("/api/register", data).then((response) => {
        setPage("Login") // Render login page
      })
      .catch((error) => {
        if (error.response.status === 500) {
            setError("Oops, failed to sign up. Please try again.")
        } else {
            setError(error.response.data.message)
        }
      });
  }    

  const Profile = data => {
    // API call to register
    axios.put("/api/profile", data).then((response) => {
        setPage("Main") // Render login page
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
      // Set session data
      setUser(response.data) 
      setPage("Main") // Render main (swipe) page
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
      setPage("Welcome") // Render welcome page
    })
    .catch((err) => {alert(err)})
  }

  const renderPage = () => {
    console.log('renderPage:  ' + page + ', ' + user.email)
    switch (page) {
      case "Welcome":
        return <WelcomePage displayPage={displayPage}/>
      case "Login":
        return <LoginPage Login={Login} displayPage={displayPage} error={error}/>
        case "Register":
          return <RegisterPage action={Register} displayPage={displayPage} error={error} newUser={true}/>
        case "Profile":
          return <RegisterPage action={Profile} displayPage={displayPage} error={error} newUser={false}/>
        case "Matches":
          return <MatchesPage/>  
        case "Main":
          return <MainPage user={user} Logout={Logout} displayPage={displayPage}/>
        default:
          return ''
    }
  }

  return (
    <div className="App">
      {renderPage(page)}
    </div>
  )
}
 
