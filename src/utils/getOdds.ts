import { CardGroup, OddsCalculator } from "poker-odds-calculator";
import { PokerCard } from "../types";

export type OddsResult = {
  details: {
    key: string;
    equity: number;
    cards: PokerCard["key"][];
    rank: string;
  }[];
};

export const getOdds = (
  playersCards: PokerCard["key"][][],
  board: PokerCard["key"][]
): OddsResult => {
  const playerCards = playersCards.map((cards) => {
    return CardGroup.fromString(cards.join(""));
  });
  const boardCards = CardGroup.fromString(board.join(""));

  const calculated = OddsCalculator.calculate(playerCards, boardCards);

  const details = calculated.equities.map((equity, i) => {
    const percent = equity.getEquity();
    return {
      key: playerCards[i].sort().join(""),
      equity: percent,
      cards: playersCards[i],
      rank: calculated.getHandRank(i).toString(),
    };
  });

  return {
    details,
  };
};
