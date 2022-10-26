import axios from "axios"
import { useState, useEffect } from "react";

export default function InterestsPage({user, displayPage}) {
    const [interests, setInterests] = useState([])

    // Get Bagel info from the server
    const fetchData = async () => {
        const response = await axios.get("/api/interests")
        setInterests(response.data)
    }

    // Run once to get interests
    useEffect(() => {fetchData()}, [])         

    const submitHandler = e => {
        e.preventDefault()
        // Post send updated interests back to server for update
        axios.post("/api/interests_update", interests)
        displayPage("Profile")
    }        

    const handleClick = index => {
        let newInterests = [...interests]        
        newInterests[index].selected = !newInterests[index].selected
        setInterests(newInterests)
    }
    
    return (
        <form onSubmit={submitHandler}>
            <div className="form-inner">
                <h2 id="title">Interests<div className="name"> ({user.name})</div></h2>
                <div id="interests">
                    {interests.map((item, index) => <div className={"interest-item" + (item.selected ? " selected" : "")} key={index} onClick={() => handleClick(index)}>{item.description}</div>)}
                </div>

                <div id="navbar-interests">
                    <input className="button" type="submit" value={"Update"}/>
                    <input className="button" type="button" value="Cancel" onClick={() => displayPage("Profile")}/>
                </div>
            </div>
        </form>
    )
}
