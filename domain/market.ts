import { nanoid } from "nanoid";
import type { Order, Users } from "./users";
import { OrderBook } from "./orderbook";
import { Positions } from "./positions";

export class Market {
  marketId: string;
  question: string;
  endTime: Date;
  status: "OPEN" | "CLOSED";
  resolution: "YES" | "NO" | null;
  yesPool: number;
  noPool: number;
  orders: Order[];
  orderBook: OrderBook;
  positions: Positions;

  constructor({ question, endTime, users }: { question: string, endTime: Date, users: Users }) {
    this.marketId = nanoid();
    this.question = question
    this.endTime = endTime
    this.status = "OPEN";
    this.resolution = null;
    this.yesPool = 0;
    this.noPool = 0;
    this.orders = [];
    this.orderBook = new OrderBook();
    this.positions = new Positions(this.marketId);
  }

  order(order: Order, users: Users) {
    const trades = this.orderBook.match(order);
    console.log("trades: ", trades);
    this.positions.applyTrades(trades, this.marketId, users.users);
  }

  resolve(resolution: "YES" | "NO", users: Users) {
    users.users.forEach((user) => {
      this.positions.settle(user.userId, resolution, users.users);
    });
  }
}
