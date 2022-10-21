import axios from "axios"
import { useState, useEffect } from "react";

export default function MainPage({user, Logout}) {
    const [bagel, setBagel] = useState({})
    const [error, setError] = useState("")

    // Get first bagel for user and bagels interests
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get("/api/main")
            setBagel(response.data.bagel)
        }
        fetchData()
    })         

    const recordLike = like => {        
        const data = {swiped_user_id: bagel.id, like: like}
        console.log(data)
        // API call to register
        axios.post("/api/like", data)
        .then((response) => {setError("")})
        .catch((error) => {setError("Oops, failed to like.")})
    }        

    return (
        <div className="welcome">
            <img id="user_photo" src={user.photo} height="90" alt="user photo"/>    
            <h2><span>{user.name}</span></h2>
            <p>{error}</p>
            <h3>{bagel.name}: {bagel.age}</h3>
            {bagel.id &&
                <div>
                <div id="interests">
                    {bagel.interests.map((item, index) => <div className="interest_item" key={index}>{item.description}</div>)}
                </div>

                <img id="bagel_photo" src={bagel.photo_url} alt="bagel photo"/>
                <div id="swipe_buttons">
                    <img  height="50" src="/img/cross.jpg" alt="Not like"  onClick={() => recordLike(false)}/>
                    <img  height="50" src="/img/love.jpg" alt="Like" onClick={() => recordLike(true)}/>
                </div>
                </div>
            }
            <input className="button" type="button"  value="Logout" onClick={Logout}/>
        </div>
    )
}
