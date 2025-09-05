import { nanoid } from "nanoid";

export type Order = {
  orderId: string;
  userId: string;
  side: "yes" | "no";
  shares: number;
  limitProbability: number;
}

export type User = {
  userId: string;
  username: string;
  orders: Order[],
  balance: number
};

export class Users {
  users: Map<string, User>;

  constructor() {
    this.users = new Map<string, User>();
  }

  addUser(username: string) {
    const userId = nanoid();

    let user: User = {
      userId,
      username,
      orders: [],
      balance: 10_000
    };

    this.users.set(userId, user);

    return userId;
  }
}
