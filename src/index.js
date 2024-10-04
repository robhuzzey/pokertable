import React, { useEffect, useState, useCallback } from "react";
import { createRoot } from 'react-dom/client';
import cards from "./cards.json";
import { deal } from "./utils/deal";
import { getCards } from "./utils/getCards";
import { getOdds } from "./utils/getOdds";
import { shuffle } from "./utils/shuffle";
import Card from "./Card";

const App = () => {
  const [deck, setDeck] = useState([]);
  const [players, setPlayers] = useState([]);
  const [odds, setOdds] = useState({});
  const [board, setBoard] = useState([]);
  const [folded, setFolded] = useState([]);
  const [gameCount, setGameCount] = useState(1);
  const [burnedCards, setBurnedCards] = useState([]);

  const newGame = useCallback(() => {
    setDeck([]);
    setPlayers([]);
    setOdds({});
    setBoard([]);
    setFolded([]);
    setGameCount(gameCount + 1);
    setBurnedCards([]);
  }, [setDeck, setPlayers, setOdds, setBoard, setFolded, setGameCount, setBurnedCards, gameCount]);

  const burn = useCallback((numberOfCards) => {
    const { cards, deck: remainingDeck } = getCards(numberOfCards, deck);
    setBurnedCards([...cards, ...burnedCards]);
    setDeck(remainingDeck);
  }, [getCards, setBurnedCards, setDeck, burnedCards]);

  const dealBoard = useCallback((numberOfCards) => {
    burn(1);
    const { cards, deck: remainingDeck } = getCards(numberOfCards, deck);
    setBoard([...board,...cards]);
    setDeck(remainingDeck);
  }, [burn, getCards, setBoard, setDeck, deck])

  const fold = useCallback((i) => {
    setFolded([...folded, i]);
  }, [setFolded, folded]);

  useEffect(() => {
    const shuffledCards = shuffle(cards);
    const { players, deck } = deal(shuffledCards, 6, 2);
    setPlayers(players);
    setDeck(deck);
  }, [gameCount]);

  useEffect(() => {
    const playerCardsInPlay = players.reduce((acc, playerCards, i) => {
      if (!folded.includes(i)) {
        acc.push(playerCards.map(card => {
          return card.key;
        }))
      }
      return acc;
    }, []);
    const boardCardsInPlay = board.map(card => {
      return card.key;
    });

    const details = getOdds(playerCardsInPlay, boardCardsInPlay).details;
    const maxEquity = Math.max(...details.map(obj => obj.equity));
    const oddsAsMap = details.reduce((acc, curr) => {
      acc[curr.key] = {
        equity: curr.equity,
        rank: curr.rank,
        best: curr.equity === maxEquity
      }
      return acc;
    }, {});

    setOdds(oddsAsMap);
  }, [players, board, folded]);

  return (
    <div>
      <div className="table">
        {players.map((cards, i) => {
          const key = cards.reduce((acc, curr) => {
            acc.push(curr.key);
            return acc;
          }, []).sort().join('');
          const hasFolded = folded.includes(i);
          return (
            <div key={`player_${i}`} className={`player${hasFolded ? ' excluded' : ''}${odds[key]?.best ? ' best' : ''}`}>
              <div className="equity">{odds[key]?.equity || 0}%</div>
              <div className="cards">
                {cards.map(card => {
                  return <Card className="card" key={`card_${card.value}_${card.suit}`} value={card.value} suit={card.suit} />
                })}
              </div>
              <span className="info">{odds[key]?.rank} <button onClick={() => fold(i)} disabled={hasFolded ? 'disabled' : ''}>Fold{hasFolded ? 'ed' : ''}</button></span>
            </div>
          )
        })}
      </div>
      <div className="board">
        <div>
          {players.length === 0 && <div>Loading...</div>}
          {(board.length < 3 || board.length) === 5 && <button onClick={newGame}>New Game</button>}
          {players.length > 0 && board.length === 0 && <button onClick={() => dealBoard(3)}>Flop</button>}
          {players.length > 0 && board.length === 3 && <button onClick={() => dealBoard(1)}>Turn</button>}
          {players.length > 0 && board.length === 4 && <button onClick={() => dealBoard(1)}>River</button>}
        </div>
        {board.map(card => {
          return <Card key={`card_${card.value}_${card.suit}`} value={card.value} suit={card.suit} />
        })}
      </div>
    </div>
  )
}

const container = document.getElementById('app');
const root = createRoot(container);
root.render(<App />);