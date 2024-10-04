import { getCards } from "./getCards";
import { PokerCard } from "../types";

const testCases = [
  [
    2,
    [
      {
        value: 1,
        suit: "s",
        key: "As",
        entity: "&#127137",
      },
      {
        value: 2,
        suit: "s",
        key: "2s",
        entity: "&#127138",
      },
      {
        value: 3,
        suit: "s",
        key: "3s",
        entity: "&#127139",
      },
    ],
    {
      cards: [
        {
          value: 1,
          suit: "s",
          key: "As",
          entity: "&#127137",
        },
        {
          value: 2,
          suit: "s",
          key: "2s",
          entity: "&#127138",
        },
      ],
      deck: [
        {
          value: 3,
          suit: "s",
          key: "3s",
          entity: "&#127139",
        },
      ],
    },
  ],
];

test.each(testCases)(
  "Returns %s cards and the remaining deck %j",
  (count, deck, expectedResult) => {
    const result = getCards(count as number, deck as PokerCard[]);
    expect(result).toEqual(expectedResult);
  }
);
