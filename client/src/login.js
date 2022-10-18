import React, { useState } from 'react'

export default function LoginForm({Login, error}) {
    const [details, setDetails] = useState({email: "", password: ""})

    const submitHandler = e => {
        e.preventDefault()
        Login(details)
    }

    return (
        <form onSubmit={submitHandler}>
            <div className="form-inner">
                <h2>Login</h2>
                {/* {(error !== "") ? (<div className="error">{error}</div>) : ""} */}
                <div className="error">{error}</div>
                <div className = "form-group">
                    <label htmlFor="email">Email:</label>
                    <input type="text" name="email" id="email" onChange={e => setDetails({...details, email: e.target.value})}/>
                </div>
                <div className = "form-group">
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" id="password" onChange={e => setDetails({...details, password: e.target.value})}/>
                </div>
                <input type="submit" value="Login"/>
                <input type="submit" value="Register"/>
                <input type="submit" value="Cancel"/>
            </div>
        </form>
  )
}

