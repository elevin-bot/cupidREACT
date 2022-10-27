import axios from "axios"
import { useState, useEffect } from "react";

export default function MatchesPage({user, displayPage}) {
    const [matches, setMatches] = useState([])

    // Get matches
    const fetchData = async () => {
        const response = await axios.get("/api/matches")
        setMatches(response.data)
    }

    // Run once to get bagel info
    useEffect(() => {fetchData()}, [])         

    // Unmatch and refresh matches page
    const unmatch = swiped_user_id => {
      axios.patch("/api/unmatch", {swiped_user_id})
      .then((response) => {fetchData()})

    }

    return (
      <div id="matches-outer">
        <h2 id="title">Matches<div className="name"> ({user.name})</div></h2>
        {matches.length === 0 && <h2 className="name">No matches yet. Keep swiping!</h2>}
        <div id="matches">
          {
            matches.map((bagel, index) => 
              <div key={index}>
                <div id="matches-inner">
                  <div className="name">{bagel.name} {bagel.age}</div>
                  <input className="button" type="button" value="Unmatch" onClick={() => unmatch(bagel.swiped_user_id)}/>                
                </div>
                <img className="match_photo" src={bagel.photo_url} height="250" alt={bagel.name}/> 
              </div>
            )
          }
        </div>
        <input className="button" type="button" value="Close" onClick={() => displayPage("Main")}/>
      </div>
    )
}
