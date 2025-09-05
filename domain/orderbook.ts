import { nanoid } from "nanoid";
import type { Order } from "./users";
import BTree from "sorted-btree";

const descendingComparator = (a: number, b: number) => {
  if (a < b) {
    return 1;
  } else if (a > b) {
    return -1;
  } else {
    return 0;
  }
};

export class OrderBook {
  bookId: string;
  yesPool: BTree<number, Order[]>;
  noPool: BTree<number, Order[]>;

  constructor() {
    this.bookId = nanoid();
    this.yesPool = new BTree<number, Order[]>(undefined, descendingComparator);
    this.noPool = new BTree<number, Order[]>();
  }

  private addOrder(order: Order) {
    const pool = order.side === "yes" ? this.yesPool : this.noPool;
    const level = pool.get(order.price) ?? [];
    level.push(order);
    pool.set(order.price, level);
  }

  match(incoming: Order) {
    const trades: {
      taker: Order;
      maker: Order;
      price: number;
      shares: number;
    }[] = [];

    if (incoming.side === "yes") {
      while (incoming.shares > 0 && this.noPool.minKey() !== undefined) {
        const bestAskPrice = this.noPool.minKey()!;

        if (incoming.price + bestAskPrice < 1) break; // no cross

        const queue = this.noPool.get(bestAskPrice)!;
        const maker = queue[0]!;
        const fillShares = Math.min(incoming.shares, maker.shares);

        if (incoming.userId === maker.userId) break;

        trades.push({
          taker: incoming,
          maker,
          price: bestAskPrice,
          shares: fillShares,
        });

        incoming.shares -= fillShares;
        maker.shares -= fillShares;

        if (maker.shares === 0) {
          queue.shift();
          if (queue.length === 0) this.noPool.delete(bestAskPrice);
        }
      }

      if (incoming.shares > 0) this.addOrder(incoming);
    } else {
      while (incoming.shares > 0 && this.yesPool.minKey() !== undefined) {
        const bestBidPrice = this.yesPool.minKey()!;
        if (incoming.price + bestBidPrice < 1) break; // no cross

        const queue = this.yesPool.get(bestBidPrice)!;
        const maker = queue[0]!;
        const fillShares = Math.min(incoming.shares, maker.shares);

        trades.push({
          taker: incoming,
          maker,
          price: bestBidPrice,
          shares: fillShares,
        });

        incoming.shares -= fillShares;
        maker.shares -= fillShares;

        if (maker.shares === 0) {
          queue.shift();
          if (queue.length === 0) this.yesPool.delete(bestBidPrice);
        }
      }

      if (incoming.shares > 0) this.addOrder(incoming);
    }

    return trades;
  }
}
