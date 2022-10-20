import React, { useState } from 'react'

export default function RegisterPage({Register, displayPage, error}) {
    const [data, setData] = useState({
                                    email: "", 
                                    password: "", 
                                    name: "", 
                                    photo: "", 
                                    gender: "",
                                    age: "",
                                    pref_age_from: "",
                                    pref_age_to: "",
                                    pref_gender: ""
                                })

    const submitHandler = e => {
        e.preventDefault()
        Register(data)
    }

    return (
        <form onSubmit={submitHandler}>
            <div className="form-inner">
                <h2>Register</h2>
                <div className="error">{error}</div>
                <div className = "form-group">
                    <label htmlFor="email">Email:</label>
                    <input className="input" type="text" name="email" id="email" required onChange={e => setData({...data, email: e.target.value})} value={data.email}/>
                </div>
                <div className = "form-group">
                    <label htmlFor="password">Password:</label>
                    <input className="input" type="password" name="password" id="password" required onChange={e => setData({...data, password: e.target.value})} value={data.password}/>
                </div>
                <div className = "form-group">
                    <label htmlFor="name">Name:</label>
                    <input className="input" type="text" name="name" id="name" required onChange={e => setData({...data, name: e.target.value})} value={data.name}/>
                </div>
                <div className = "form-group">
                    <label htmlFor="photo">Photo URL:</label>
                    <input className="input" type="text" name="photo" id="photo" required onChange={e => setData({...data, photo: e.target.value})} value={data.photo}/>
                </div>
                <div className = "form-group-radio">
                    <label className="radioLabel" htmlFor="gender">Gender:</label>
                    <input type="radio" name="gender" required value="m"  onChange={e => setData({...data, gender: e.target.value})} checked={data.gender === "m"}/> <label className="radioButton">Male</label>
                    <input type="radio" name="gender" required value="f"  onChange={e => setData({...data, gender: e.target.value})} checked={data.gender === "f"}/> <label className="radioButton">Female</label>
                </div>
                <div className = "form-group">
                    <label htmlFor="age">Age:</label>
                    <input className="input" type="number" name="age" id="age"  min="18" max="99" required onChange={e => setData({...data, age: e.target.value})} value={data.age}/>
                </div>
                <div className = "form-group">
                    <label htmlFor="pref_age_from">Preference Age from:</label>
                    <input className="input" type="number" name="pref_age_from" id="pref_age_from"  min="18" max="99" onChange={e => setData({...data, pref_age_from: e.target.value})} value={data.pref_age_from}/>
                    <label htmlFor="pref_age_to">to: </label>
                    <input className="input" type="number" name="pref_age_to" id="pref_age_to"  min="18" max="99" onChange={e => setData({...data, pref_age_to: e.target.value})} value={data.pref_age_to}/>
                </div>
                <div className = "form-group-radio">
                    <label className="radioLabel" htmlFor="pref_gender">Gender:</label>
                    <input type="radio" name="pref_gender" required value="m"  onChange={e => setData({...data, pref_gender: e.target.value})} checked={data.pref_gender === "m"}/> <label className="radioButton">Male</label>
                    <input type="radio" name="pref_gender" required value="f"  onChange={e => setData({...data, pref_gender: e.target.value})} checked={data.pref_gender === "f"}/> <label className="radioButton">Female</label>
                    <input type="radio" name="pref_gender" required value="o"  onChange={e => setData({...data, pref_gender: e.target.value})} checked={data.pref_gender === "o"}/> <label className="radioButton">Other</label>
                </div>
                <input className="input" type="submit" value="Register"/>
                <input className="input" type="button" value="Cancel" onClick={() => displayPage("W")}/>
            </div>
        </form>
  )
}

