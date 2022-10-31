import axios from "axios"
import { useState, useEffect } from "react";

export default function MainPage({user, Logout, displayPage}) {
    const [bagel, setBagel] = useState({})
    const [showTextRight, setShowTextRight] = useState(false)
    const [showTextLeft, setShowTextLeft] = useState(false)

    // Get Bagel info from the server
    const fetchData = async () => {
        const response = await axios.get("/api/main")
        setBagel(response.data.bagel)
    }

    // Run once to get bagel info
    useEffect(() => {fetchData()}, [])         

    const recordLike = like => {        
        // Display text over photo for 5 seconds
        (like ? setShowTextRight(true) : setShowTextLeft(true))
        setTimeout(() => {
            // API call to record a like/unlike and get next bagel
            const data = {swiped_user_id: bagel.id, like: like}
            axios.post("/api/like", data)
            .then((response) => {
                fetchData()
                setShowTextRight(false)
                setShowTextLeft(false)
            })
        }, 500)
    }        

    return (
        <div id="main">
            <div id="main_user">
                <img id="user_photo" src={user.photo} height="90" alt="user"/>    
                <h2 className="name">Logged in as {user.name}</h2>
            </div>            
            <div id="bagel">
                <h3 className="name">{bagel.name} {bagel.age}</h3>
                {bagel.id &&
                <div>
                    <div id="interests">
                        {bagel.interests.map((item, index) => <div className="bagel-interest" key={index}>{item.description}</div>)}
                    </div>
                    <div id="bagel_photo">
                        <img src={bagel.photo_url} height="500" alt="bagel"/>
                        {showTextLeft && <p id='text-on-image-left'>PASSED</p>}
                        {showTextRight && <p id='text-on-image-right'>LIKED</p>}
                    </div>    
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
