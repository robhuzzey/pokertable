type Rank = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'T' | 'J' | 'Q' | 'K' | 'A';
type Suit = 'h' | 'd' | 'c' | 's'; // hearts, diamonds, clubs, spades

export type PokerCard = {
    value: number;
    suit: Suit;
    key: `${Rank}${Suit}`;
    entity: string;
}