import axios from "axios"
import { useState, useEffect } from "react";

export default function MatchesPage({displayPage}) {
    const [matches, setMatches] = useState([])

    // Get matches
    const fetchData = async () => {
        const response = await axios.get("/api/matches")
        setMatches(response.data)
    }

    // Run once to get bagel info
    useEffect(() => {fetchData()}, [])         

    return (
      <div id="matches-outer">
        <h3 id="title">Matches</h3>
        {matches.length === 0 && <h3 className="name">No matches yet. Keep swiping!</h3>}
        <div id="matches">
          {
            matches.map((bagel, index) => 
              <div key={index}>
                <div className="name">{bagel.name} {bagel.age}</div>
                <img className="match_photo" src={bagel.photo_url} height="250" alt={bagel.name}/> 
              </div>
            )
          }
        </div>
        <input className="button" type="button" value="Close" onClick={() => displayPage("Main")}/>
      </div>
    )
}
