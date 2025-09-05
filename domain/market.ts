import { nanoid } from "nanoid";
import type { Order } from "./users";

class Market {
  id: string;
  question: string;
  endTime: Date;
  status: "OPEN" | "CLOSED";
  resolution: "YES" | "NO" | null;
  yesPool: number;
  noPool: number;
  orders: Order[];

  constructor({ question, endTime }: { question: string, endTime: Date }) {
    this.id = nanoid();
    this.question = question
    this.endTime = endTime
    this.status = "OPEN";
    this.resolution = null;
    this.yesPool = 0;
    this.noPool = 0;
    this.orders = [];
  }
}
