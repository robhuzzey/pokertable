import { CardGroup, OddsCalculator } from "poker-odds-calculator";
import { Calculator } from "poker-odds-machine";
import { PokerCard } from "../types";

type HandStat = {
  count: number;
  percent: number;
};

export type HandStats = {
  highCard: HandStat;
  pair: HandStat;
  twoPair: HandStat;
  trips: HandStat;
  straight: HandStat;
  flush: HandStat;
  fullHouse: HandStat;
  quads: HandStat;
  straightFlush: HandStat;
};

export type OddsResult = {
  key: string;
  equity: number;
  cards: PokerCard["key"][];
  rank: string;
  handStats?: HandStats;
};

export const generateKey = (playerCards: PokerCard[]): string => {
  return playerCards.sort().join("");
};

export const getOdds = (
  playersCards: PokerCard["key"][][],
  board: PokerCard["key"][]
): OddsResult[] => {
  if (!playersCards.length) return [];

  const playerCards = playersCards.map((cards) => {
    return CardGroup.fromString(cards.join(""));
  });
  const boardCards = CardGroup.fromString(board.join(""));

  const calculated = OddsCalculator.calculate(playerCards, boardCards);

  const details = calculated.equities.map((equity, i) => {
    const percent = equity.getEquity();
    return {
      key: generateKey(playerCards[i]),
      equity: percent,
      cards: playersCards[i],
      rank: calculated.getHandRank(i).toString(),
    };
  });

  const hands = details.reduce<string[]>((acc, curr) => {
    return [...acc, curr.cards.join(",")];
  }, []);

  const c = new Calculator({
    hands: hands,
    board: board.join(","),
    returnHandStats: true,
  });
  const s = c.simulate();

  const detailsWithStats: OddsResult[] = details.map((detail) => {
    const key = detail.cards.join(",");
    return {
      ...detail,
      handStats: s[key].handStats as HandStats,
    };
  });

  return detailsWithStats;
};
