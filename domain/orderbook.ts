import { nanoid } from "nanoid";
import type { Order } from "./users";

class OrderBook {
  bookId: string;
  yesPool: Order[];
  noPool: Order[];

  constructor() {
    this.bookId = nanoid();
    this.yesPool = [];
    this.noPool = [];
  }

  match(order: Order) {
  }
}
