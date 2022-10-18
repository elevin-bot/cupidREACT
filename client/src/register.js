import { useState } from 'react';

export default function Register() {
  const [hand, setHand] = useState([])

  function handleClick() {
    // API to backend server to hand random hand
    fetch("/api/hand").then(r => r.json()).then(json => {
        setHand(json.cards)
        })
    }
  
  return (
    <div>
      <button onClick={handleClick}>Draw Hand</button>
      { hand.map((card, index) => <p key={index}>Card {index+1}: {card.card} of {card.suit}</p>) }
    </div>
  );
}




