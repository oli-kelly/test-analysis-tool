# Version 0.1 specification

Input: a JSON array of strictly increasing ISO calendar dates and positive finite closing prices. Daily observations are assumed to represent trading sessions; missing calendar dates are permitted.

Method: arithmetic mean of the latest 20 and 50 closing prices. If fewer than 50 prices exist, signal INSUFFICIENT_DATA. Otherwise SMA20 > SMA50 means BULLISH, SMA20 < SMA50 means BEARISH, equality means NEUTRAL. This is a trend *state*, not a crossover event or trade signal.

Output: signal, shortSma, longSma, observations and asOf. No external price feed or brokerage connection.

## Run

```sh
npm install
npm run check
node dist/cli.js examples/daily-closes.json
```

## Retrospective plan

Week 1: project setup and data contract. Week 2: SMA calculation and trend classification. Week 3: tests and CLI/CI. This plan is retrospective; GitHub records actual creation and merge timestamps.

This tool is for educational analysis, not investment advice.
