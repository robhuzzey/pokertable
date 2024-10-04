import { deal } from "./deal";
import { PokerCard } from "../types";

const deck = [
  {
    value: 1,
    suit: "s",
    key: "as",
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
  {
    value: 4,
    suit: "s",
    key: "4s",
    entity: "&#127140",
  },
];

const playerCount = 2;
const cardCount = 2;
const expectedResult = {
  players: [
    [
      {
        value: 1,
        suit: "s",
        key: "as",
        entity: "&#127137",
      },
      {
        value: 3,
        suit: "s",
        key: "3s",
        entity: "&#127139",
      },
    ],
    [
      {
        value: 2,
        suit: "s",
        key: "2s",
        entity: "&#127138",
      },
      {
        value: 4,
        suit: "s",
        key: "4s",
        entity: "&#127140",
      },
    ],
  ],
  deck: [],
};

const testCases = [[deck, playerCount, cardCount, expectedResult]];

test.each(testCases)(
  "With deck %j & playerCount %s, with cardCount %s, return expected %j",
  (deck, playerCount, cardCount, expectedResult) => {
    const result = deal(
      deck as PokerCard[],
      playerCount as number,
      cardCount as number
    );
    expect(result).toEqual(expectedResult);
  }
);
