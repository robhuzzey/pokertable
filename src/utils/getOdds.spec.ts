import { getOdds } from "./getOdds";
import { PokerCard } from "../types";

type TestCase = [
  PokerCard["key"][][], // Player cards
  PokerCard["key"][], // Board cards
  {
    key: string;
    equity: number;
    cards: PokerCard["key"][];
    rank: string;
    handStats?: {
      highCard: { count: number; percent: number };
      pair: { count: number; percent: number };
      twoPair: { count: number; percent: number };
      trips: { count: number; percent: number };
      straight: { count: number; percent: number };
      flush: { count: number; percent: number };
      fullHouse: { count: number; percent: number };
      quads: { count: number; percent: number };
      straightFlush: { count: number; percent: number };
    };
  }[]
];

const testCases: TestCase[] = [
  [
    [
      ["7s", "2c"],
      ["Tc", "Jd"],
    ] as PokerCard["key"][][],
    ["As", "7c", "Ad"] as PokerCard["key"][],
    [
      {
        key: "2c7s",
        equity: 70,
        cards: ["7s", "2c"],
        rank: "Two pairs: aces and sevens (2 high)",
        handStats: {
          highCard: {
            count: expect.any(Number),
            percent: expect.any(Number),
          },
          pair: {
            count: expect.any(Number),
            percent: expect.any(Number),
          },
          twoPair: {
            count: expect.any(Number),
            percent: expect.any(Number),
          },
          trips: {
            count: expect.any(Number),
            percent: expect.any(Number),
          },
          straight: {
            count: expect.any(Number),
            percent: expect.any(Number),
          },
          flush: {
            count: expect.any(Number),
            percent: expect.any(Number),
          },
          fullHouse: {
            count: expect.any(Number),
            percent: expect.any(Number),
          },
          quads: {
            count: expect.any(Number),
            percent: expect.any(Number),
          },
          straightFlush: {
            count: expect.any(Number),
            percent: expect.any(Number),
          },
        },
      },
      {
        key: "JdTc",
        equity: 30,
        cards: ["Tc", "Jd"],
        rank: "Pair of aces (J,T,7 high)",
        handStats: {
          highCard: {
            count: expect.any(Number),
            percent: expect.any(Number),
          },
          pair: {
            count: expect.any(Number),
            percent: expect.any(Number),
          },
          twoPair: {
            count: expect.any(Number),
            percent: expect.any(Number),
          },
          trips: {
            count: expect.any(Number),
            percent: expect.any(Number),
          },
          straight: {
            count: expect.any(Number),
            percent: expect.any(Number),
          },
          flush: {
            count: expect.any(Number),
            percent: expect.any(Number),
          },
          fullHouse: {
            count: expect.any(Number),
            percent: expect.any(Number),
          },
          quads: {
            count: expect.any(Number),
            percent: expect.any(Number),
          },
          straightFlush: {
            count: expect.any(Number),
            percent: expect.any(Number),
          },
        },
      },
    ],
  ],
  [
    [
      ["As", "Ks"],
      ["Ac", "Qc"],
    ] as PokerCard["key"][][],
    ["2d", "3d", "4d"] as PokerCard["key"][],
    [
      {
        key: "AsKs",
        equity: 66,
        cards: ["As", "Ks"],
        rank: "High card (A,K,4,3,2 high)",
      },
      {
        key: "AcQc",
        equity: 10,
        cards: ["Ac", "Qc"],
        rank: "High card (A,Q,4,3,2 high)",
      },
    ],
  ],
];

test.each(testCases)(
  "With playerCards %j & boards %s, return Equity %s",
  (playerCards, boardCards, obj) => {
    const result = getOdds(playerCards, boardCards);
    expect(result).toMatchObject(obj);
  }
);
