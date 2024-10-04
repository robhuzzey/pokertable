import { PokerCard } from "../types";

export function isPokerCard(card: string): card is PokerCard["key"] {
  const rankPattern = /^(2|3|4|5|6|7|8|9|10|J|Q|K|A)$/;
  const suitPattern = /^(h|d|c|s)$/;

  const rank = card.slice(0, -1);
  const suit = card.slice(-1);

  return rankPattern.test(rank) && suitPattern.test(suit);
}
