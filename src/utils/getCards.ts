import { PokerCard } from "../types";
export type GetCardsResult = {
  cards: PokerCard[];
  deck: PokerCard[];
};

// This simulates taking one card off the top of the deck
export const getCards = (count: number, deck: PokerCard[]): GetCardsResult => {
  return {
    cards: deck.slice(0, count),
    deck: deck.slice(count),
  };
};
