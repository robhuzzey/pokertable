import { PokerCard } from "../types";

export type DealResult = {
  players: PokerCard[][];
  deck: PokerCard[];
};

export const deal = (
  deck: PokerCard[],
  playerCount: number,
  cardCount: number = 2
): DealResult => {
  // Deal one card to each player from the top in sequence:
  const deckCopy = [...deck];
  const players: PokerCard[][] = [];
  for (let i = 0; i < cardCount; i++) {
    for (let j = 0; j < playerCount; j++) {
      if (players[j] === undefined) players[j] = [];
      players[j][i] = deckCopy.shift() as PokerCard;
    }
  }

  return {
    players,
    deck: deckCopy,
  };
};
