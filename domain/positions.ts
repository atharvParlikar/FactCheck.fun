import type { Order, User } from "./users";

export type Position = {
  userId: string;
  marketId: string;
  yesShares: number;
};

export type Trade = {
  taker: Order;
  maker: Order;
  price: number;
  shares: number;
};

export class Positions {
  positions: Map<string, Position>;

  constructor(marketId: string) {
    this.positions = new Map();
    this.positions.set("market", {
      userId: "market",
      marketId,
      yesShares: 10_000
    });

    this.positions.set("market", {
      userId: "market",
      marketId,
      yesShares: -10_000
    });
  }

  private ensure(userId: string, marketId: string) {
    const k = userId;
    if (!this.positions.has(k)) {
      this.positions.set(k, { userId, marketId, yesShares: 0 });
    }
    return this.positions.get(k)!;
  }

  applyTrade(trade: Trade, marketId: string, users: Map<string, User>) {
    const { taker, maker, price, shares } = trade;

    const takerPos = this.ensure(taker.userId, marketId);
    const makerPos = this.ensure(maker.userId, marketId);
    const takerUser = users.get(taker.userId)!;
    const makerUser = users.get(maker.userId)!;

    if (taker.side === "yes") {
      takerUser.balance -= price * shares;
      takerPos.yesShares += shares;

      makerUser.balance += price * shares;
      makerPos.yesShares -= shares;

    } else {
      takerUser.balance -= (1 - price) * shares;
      takerPos.yesShares -= shares;

      makerUser.balance += (1 - price) * shares;
      makerPos.yesShares += shares;
    }
  }

  applyTrades(trades: Trade[], marketId: string, users: Map<string, User>) {
    for (const t of trades) {
      this.applyTrade(t, marketId, users);
    }
  }

  getPosition(userId: string, marketId: string) {
    return this.positions.get(userId) ?? {
      userId,
      marketId,
      yesShares: 0,
    };
  }

  settle(userId: string, resolution: "YES" | "NO", users: Map<string, User>) {
    const pos = this.positions.get(userId);
    if (!pos) return 0;

    let payout = 0;
    if (resolution === "YES") {
      payout = pos.yesShares * 1;
    } else {
      payout = (pos.yesShares * -1) * 1;
    }

    const user = users.get(userId);
    if (user) {
      user.balance += payout;
    }
    pos.yesShares = 0;

    return payout;
  }
}
