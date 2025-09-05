import { nanoid } from "nanoid";

export type Order = {
  orderId: string;
  userId: string;
  side: "yes" | "no";
  shares: number;
  price: number; // always between 0 and 1 not including 0 and 1.
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
