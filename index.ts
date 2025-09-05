import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Users, type Order } from './domain/users'
import { Market } from './domain/market';
import { OrderBook } from './domain/orderbook';
import { nanoid } from 'nanoid/non-secure';

const app = new Hono()

const users = new Users();

const futureTime = new Date().getTime() + 24 * 60 * 60 * 1000;

const market = new Market({
  question: "Will I get this job",
  endTime: new Date(futureTime),
  users
});

const user1 = users.addUser("atharv");
const user2 = users.addUser("vedant");

market.order({
  orderId: nanoid(),
  userId: user1,
  side: "yes",
  shares: 100,
  price: 0.4
} as Order, users);

market.order({
  orderId: nanoid(),
  userId: user2,
  side: "no",
  shares: 100,
  price: 0.6
} as Order, users);

console.log(market.positions.positions);

console.log(users);

// app.use('*', cors())
//
// app.post('/api/v1/signup', async (c) => {
//   const { username } = await c.req.json()
//
//   const userId = users.addUser(username);
//
//   c.status(201);
//   return c.json({ userId });
// });
//
// export default {
//   port: 3000,
//   fetch: app.fetch
// };
