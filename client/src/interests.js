import axios from "axios"
import { useState, useEffect } from "react";

export default function InterestsPage({displayPage}) {
    const [interests, setInterests] = useState([])

    // Get Bagel info from the server
    const fetchData = async () => {
        const response = await axios.get("/api/interests")
        console.log(response.data)
        setInterests(response.data)
    }

    // Run once to get interests
    useEffect(() => {fetchData()}, [])         

    const submitHandler = e => {
        e.preventDefault()
        // Get all interest elements
        const items = Array.from(document.getElementsByClassName('interest-item'))
        console.log(items)
        // Populate array with selected interest codes
        let data = []
        items.forEach((item) => {
            if (item.classList.contains('selected')) 
                data.push(item.id)
        })
        console.log(data)
        // Post selected interest codes to the server
        axios.post("/api/interests_update", data)
    }        

    const handleClick = event => {
        event.currentTarget.classList.toggle("selected")
    }
    
    return (
        <form onSubmit={submitHandler}>
            <div className="form-inner">
                <h3 id="title">Interests</h3>
                <div id="interests">
                    {interests.map((item, index) => <div className={"interest-item" + (item.selected ? " selected" : "")} key={index} onClick={handleClick} id={item.code}>{item.description}</div>)}
                </div>

                <div id="navbar">
                    <input className="button" type="submit" value={"Update"}/>
                    <input className="button" type="button" value="Cancel" onClick={() => displayPage("Profile")}/>
                </div>
            </div>
        </form>
    )
}
