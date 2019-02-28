import React from "react";
const Card = props => {
  let value = ''
  switch(props.value) {
    case 1:
      value = 'A'
      break;
    case 10:
      value = 'T'
      break;
    case 11:
      value = 'J'
      break;
    case 12:
      value = 'Q'
      break;
    case 13:
      value = 'K'
      break;
    default:
      value = props.value
  }
  const card = `${value}${props.suit.toUpperCase()}`
  return (
    <img className='card' src={`images/cardimages-large/${card}.svg`} />
  )
}

export default Card;
