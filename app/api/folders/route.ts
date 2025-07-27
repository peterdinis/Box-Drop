import { Hono } from 'hono';
import { z } from 'zod';
import { eq, and } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { db } from '@/db';
import { folders } from '@/db/schema';

type Variables = {
  userId: string;
};

export const folder = new Hono<{ Variables: Variables }>();

// middleware to extract Clerk userId (you may use JWT or Clerk SDK directly)
folder.use('*', async (c, next) => {
  // This is just a placeholder — use real Clerk auth here.
  const userId = c.req.header('x-user-id'); // set by frontend auth
  if (!userId) return c.text('Unauthorized', 401);
  c.set('userId', userId);
  await next();
});

// GET /folders
folder.get('/', async (c) => {
  const userId = c.get('userId');
  const allFolders = db.select().from(folders).where(eq(folders.userId, userId)).all();
  return c.json(allFolders);
});

// POST /folders
folder.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();

  const schema = z.object({
    name: z.string().min(1),
  });

  const parsed = schema.safeParse(body);
  if (!parsed.success) return c.json({ error: 'Invalid name' }, 400);

  const id = nanoid();
  await db.insert(folders).values({
    id,
    name: parsed.data.name,
    userId,
  }).run();

  return c.json({ id, name: parsed.data.name });
});

// GET /folders/:id
folder.get('/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');

  const folder = db.select().from(folders)
    .where(and(eq(folders.id, id), eq(folders.userId, userId)))
    .get();

  if (!folder) return c.text('Not found', 404);
  return c.json(folder);
});

// PUT /folders/:id
folder.put('/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');
  const body = await c.req.json();

  const schema = z.object({
    name: z.string().min(1),
  });

  const parsed = schema.safeParse(body);
  if (!parsed.success) return c.json({ error: 'Invalid name' }, 400);

  await db.update(folders)
    .set({ name: parsed.data.name })
    .where(and(eq(folders.id, id), eq(folders.userId, userId)))
    .run();

  return c.json({ success: true });
});

// DELETE /folders/:id
folder.delete('/:id', async (c) => {
  const userId = c.get('userId');
  const id = c.req.param('id');

  await db.delete(folders)
    .where(and(eq(folders.id, id), eq(folders.userId, userId)))
    .run();

  return c.json({ success: true });
});

export default folder;