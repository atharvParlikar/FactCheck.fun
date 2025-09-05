import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { Users } from './domain/users'

const app = new Hono()

const users = new Users();

app.use('*', cors())

app.post('/api/v1/signup', async (c) => {
  const { username } = await c.req.json()

  const userId = users.addUser(username);

  c.status(201);
  return c.json({ userId });
});

export default {
  port: 3000,
  fetch: app.fetch
};
