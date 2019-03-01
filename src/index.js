import React from "react";
import ReactDOM from "react-dom";
import { CardGroup, OddsCalculator } from "poker-odds-calculator";

import Card from "./Card";

import cards from "./cards.json";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.defaultState = {
      status: null,
      players: [],
      boardCards: [],
      deck: [],
      error: null,
      equities: [],
      loading: false,
      straightDraw: false,
      flushDraw: false,
      fullHouseDraw: false,
      playerExcluded: false,
      iterations: 0
    };

    this.state = Object.assign({}, this.defaultState);

    this.deal = this.deal.bind(this);
    this.calculateEquity = this.calculateEquity.bind(this);
    this.flop = this.flop.bind(this);
    this.turn = this.turn.bind(this);
    this.river = this.river.bind(this);
    this.checkStraightDraw = this.checkStraightDraw.bind(this);
    this.excludePlayer = this.excludePlayer.bind(this)
  }

  shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
  }

  calculateEquity() {
    const equity = [];
    this.state.players.map(player => {
      if (!player.excluded) {
        const cardString = `${player.cards[0].key}${player.cards[1].key}`;
        equity.push(CardGroup.fromString(cardString));
      }
    });
    const board = CardGroup.fromString(
      this.state.boardCards.map(card => card.key).join("")
    );
    const result = OddsCalculator.calculate(equity, board);

    const iterations = result.iterations

    const percentages = result.equities.map(equity => {
      return equity.getEquity();
    })

    const ranks = result.handranks.map(hand => {
      return hand.alias;
    })

    const players = [].concat(this.state.players).map((player) => {
      let percentage
      let rank
      if (!player.excluded) {
        percentage = percentages.shift()
        rank = ranks.shift()
      }
      return Object.assign({}, player, {
        percentage,
        rank
      });
    });
    this.setState(() => {
      return Object.assign({}, this.state, {
        calculatingEquity: false,
        playerExcluded: false,
        players,
        iterations
      });
    }, this.checkStraightDraw); 
  }

  flop() {
    const deck = [].concat(this.state.deck);
    const boardCards = [deck.pop(), deck.pop(), deck.pop()];
    this.setState(() => {
      return Object.assign({}, this.state, {
        deck,
        boardCards,
        status: "postflop"
      });
    }, this.calculateEquity);
  }

  turn() {
    const deck = [].concat(this.state.deck);
    const boardCards = [].concat(this.state.boardCards, deck.pop());
    this.setState(() => {
      return Object.assign({}, this.state, {
        deck,
        boardCards,
        status: "postturn"
      });
    }, this.calculateEquity);
  }

  river() {
    const deck = [].concat(this.state.deck);
    const boardCards = [].concat(this.state.boardCards, deck.pop());
    this.setState(() => {
      return Object.assign({}, this.state, {
        deck,
        boardCards,
        status: "postriver"
      });
    }, this.calculateEquity);
  }

  deal() {
    const deck = this.shuffle([].concat(cards));
    const players = [];

    for (var i = 0; i < 6; i++) {
      const card1 = deck.pop();
      const card2 = deck.pop();
      const id = `${card1.key}_${card2.key}`
      players.push({
        id,
        cards: [card1, card2]
      });
    }

    this.setState(() => {
      return Object.assign({}, this.defaultState, {
        loading: false,
        players,
        deck,
        equities: [],
        boardCards: [],
        status: "preflop"
      });
    });
  }

  checkStraightDraw() {
    const values = this.state.boardCards
      .map(card => card.value)
      .sort((a, b) => a - b);
    let straightDraw = false;
    for (let i = 0; i < values.length; i++) {
      const nextEntry = values[i + 1];
      if (nextEntry && !straightDraw) {
        const diff = nextEntry - values[i];
        console.log("diff", diff);
        if (diff <= 3) {
          straightDraw = true;
        } else {
          straightDraw = false;
        }
      }
    }
    this.setState(() => {
      return Object.assign({}, this.state, {
        straightDraw
      });
    });
  }

  excludePlayer(playerId, reCalculateEquity = false) {
    const players = this.state.players.map(player => {
      if(player.id === playerId) {
        player.excluded = !player.excluded
      }
      return player
    })

    this.setState(() => {
      return Object.assign({}, this.state, {
        playerExcluded: true,
        players
      })
    }, () => {
      reCalculateEquity && this.calculateEquity()
    })
  }

  render() {
    const cards = this.state.deck;
    if (this.state.loading) {
      return (
        <div>
          <p>loading...</p>
        </div>
      );
    }
    let actionButton;
    switch (this.state.status) {
      case "preflop":
        actionButton = (
          <React.Fragment>
            <button onClick={this.flop}>Deal Flop</button>
            <button onClick={() => {
              const ok = confirm('This takes a few seconds')
              if(ok) {
                this.setState(() => {
                  return Object.assign({}, this.state, {
                    iterations: 0,
                    calculatingEquity: true
                  })
                }, () => {
                  // Timeout to allow state change before CPU goes into overdrive!
                  setTimeout(() => {
                    this.calculateEquity()
                  }, 1000)
                })
              }
            }}>Calculate Pre-flop Equity</button>
          </React.Fragment>
        )
        break;
      case "postflop":
        actionButton = <button onClick={this.turn}>Deal Turn</button>;
        break;
      case "postturn":
        actionButton = <button onClick={this.river}>Deal River</button>;
        break;
      case "postriver":
        actionButton = <button onClick={this.deal}>New Game</button>;
        break;
      default:
        actionButton = <button onClick={this.deal}>Deal</button>;
    }

    return (
      <div className="App">
        <div className="table">
          {this.state.players.map((player) => {
            const cards = player.cards;
            return (
              <div className={`player ${player.excluded ? 'excluded' : ''}`} key={`player_${player.id}`}>
                <div className="cards">
                  <Card suit={cards[0].suit} value={cards[0].value} />
                  <Card suit={cards[1].suit} value={cards[1].value} />
                </div>
                <div className="info">
                  <div>
                    {player.percentage === undefined ? '--' : `${player.percentage}%`}
                    <br />
                    <small>{player.rank}</small>
                  </div>
                </div>
                <button className='fold' onClick={() => this.excludePlayer(player.id, this.state.boardCards.length !== 0)}>{player.excluded ? 'un' : ''}fold</button>
              </div>
            );
          })}
          <div className="board">
            {this.state.calculatingEquity ? (
              <div className='loading'>Loading... please wait...</div>
            ) : (
              <div>
                {actionButton}
              </div>
            )}
            {this.state.boardCards.map((boardCard, i) => {
              return (
                <Card suit={boardCard.suit} value={boardCard.value} key={`boardCard_${i}`} />
              );
            })}
            {this.state.iterations !== 0 && <div className='iterations'>{this.state.iterations} variants calculated</div>}
          </div>
        </div>
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
