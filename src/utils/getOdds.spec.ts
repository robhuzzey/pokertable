import { getOdds } from "./getOdds";
import { PokerCard } from "../types";

const testCases = [
  [
    [
      ["7s", "2c"],
      ["Tc", "Jd"],
    ] as PokerCard["key"][][],
    ["As", "7c", "Ad"] as PokerCard["key"][],
    {
      details: [
        {
          key: "2c7s",
          equity: 70,
          cards: ["7s", "2c"],
          rank: "Two pairs: aces and sevens (2 high)",
        },
        {
          key: "JdTc",
          equity: 30,
          cards: ["Tc", "Jd"],
          rank: "Pair of aces (J,T,7 high)",
        },
      ],
    },
  ],
  [
    [
      ["As", "Ks"],
      ["Ac", "Qc"],
    ] as PokerCard["key"][][],
    ["2d", "3d", "4d"] as PokerCard["key"][],
    {
      details: [
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
    },
  ],
];

test.each(testCases)(
  "With playerCards %j & boards %s, return Equity %s",
  (playerCards, boardCards, obj) => {
    const result = getOdds(
      playerCards as PokerCard["key"][][],
      boardCards as PokerCard["key"][]
    );
    expect(result).toMatchObject(obj);
  }
);
