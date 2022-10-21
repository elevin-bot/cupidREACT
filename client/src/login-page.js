import React, { useState } from 'react'

export default function LoginPage({Login, displayPage, error}) {
    const [data, setData] = useState({email: "", password: ""})

    const submitHandler = e => {
        e.preventDefault()
        Login(data)
    }

    return (
        <form onSubmit={submitHandler}>
            <div className="form-inner">
                <h2>Login</h2>
                <div className="error">{error}</div>
                <div className = "form-group">
                    <label htmlFor="email">Email:</label>
                    <input className="input" type="text" name="email" id="email" onChange={e => setData({...data, email: e.target.value})} value={data.email}/>
                </div>
                <div className = "form-group">
                    <label htmlFor="password">Password:</label>
                    <input className="input" type="password" name="password" id="password" onChange={e => setData({...data, password: e.target.value})} value={data.password}/>
                </div>
                <input className="button" type="submit" value="Login"/>
                <input className="button" type="button" value="Register" onClick={() => displayPage("R")}/>
                <input className="button" type="button" value="Cancel" onClick={() => displayPage("W")}/>
            </div>
        </form>
  )
}

