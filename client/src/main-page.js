import axios from "axios"
import { useState, useEffect } from "react";

export default function MainPage({user, Logout, displayPage}) {
    const [bagel, setBagel] = useState({})

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
    }        

    return (
        <div id="main">
            <div id="main_user">
                <img id="user_photo" src={user.photo} height="90" alt="user"/>    
                <h3 className="name">Logged in as {user.name}</h3>
            </div>            
            <div id="bagel">
                <h3 className="name">{bagel.name} {bagel.age}</h3>
                {bagel.id &&
                <div>
                    <div id="interests">
                        {bagel.interests.map((item, index) => <div className="bagel-interest" key={index}>{item.description}</div>)}
                    </div>

                    <img id="bagel_photo" src={bagel.photo_url} height="500" alt="bagel"/>
                    <div id="swipe_buttons">
                        <input className="select_button" type="image" height="50" src="/img/cross.jpg" alt="Not like" onClick={() => recordLike(false)}/>
                        <input className="select_button" type="image" height="50" src="/img/love.jpg" alt="Like" onClick={() => recordLike(true)}/>
                    </div>
                </div>
                }
            </div>
            <div id="navbar-main">
                <input className="button" type="button"  value="Logout" onClick={Logout}/>
                <input className="button" type="button" value="Edit Profile" onClick={() => displayPage("Profile")}/>
                <input className="button" type="button" value="Matched" onClick={() => displayPage("Matches")}/>
            </div>
        </div>
    )
}
