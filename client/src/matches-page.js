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
      <div className="matches">
      {
        matches.map((bagel, index) => 
          <div key={index}>
            <div>{bagel.name}: {bagel.age}</div>
            <img className="match_photo" src={bagel.photo_url} alt={bagel.name}/> 
          </div>
        )
      }
      <input className="button" type="button" value="Cancel" onClick={() => displayPage("Main")}/>
      </div>
    )
}
