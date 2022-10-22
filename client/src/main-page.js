import axios from "axios"
import { useState, useEffect } from "react";

export default function MainPage({user, Logout, displayPage}) {
    const [bagel, setBagel] = useState({})
    const [error, setError] = useState("")

    // Get Bagel info from the server
    const fetchData = async () => {
        const response = await axios.get("/api/main")
        setBagel(response.data.bagel)
    }

    // Run once to get bagel info
    useEffect(() => {fetchData()}, [])         

    const recordLike = like => {        
        const data = {swiped_user_id: bagel.id, like: like}
        // API call to record a like/unlike and get next bagel
        axios.post("/api/like", data)
        .then((response) => {fetchData()})
        .catch((error) => {setError("Oops, failed at /api/like.")})       
    }        

    return (
        <div className="welcome">
            <img id="user_photo" src={user.photo} height="90" alt="user"/>    
            <h2><span>{user.name}</span></h2>
            <p>{error}</p>
            <h3>{bagel.name}: {bagel.age}</h3>
            {bagel.id &&
                <div>
                <div id="interests">
                    {bagel.interests.map((item, index) => <div className="interest_item" key={index}>{item.description}</div>)}
                </div>

                <img id="bagel_photo" src={bagel.photo_url} alt="bagel"/>
                <div id="swipe_buttons">
                    <img  height="50" src="/img/cross.jpg" alt="Not like"  onClick={() => recordLike(false)}/>
                    <img  height="50" src="/img/love.jpg" alt="Like" onClick={() => recordLike(true)}/>
                </div>
                </div>
            }
            <input className="button" type="button"  value="Logout" onClick={Logout}/>
            <input className="button" type="button" value="Edit Profile" onClick={() => displayPage("Profile")}/>
            <input className="button" type="button" value="Matches" onClick={() => displayPage("Matches")}/>
        </div>
    )
}
