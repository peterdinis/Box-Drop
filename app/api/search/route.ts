import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '@/db';
import { folders, files, members } from '@/db/schema';
import { like, or } from 'drizzle-orm';

const app = new Hono();

app.get(async (c) => {
  const q = c.req.query('q');
  const parsed = z.string().min(1).safeParse(q);

  if (!parsed.success) {
    return c.json({ error: 'Missing query param ?q' }, 400);
  }

  const query = `%${q}%`;

  const [folderResults, fileResults, memberResults] = await Promise.all([
    db.select().from(folders).where(like(folders.name, query)).limit(10),
    db.select().from(files).where(like(files.name, query)).limit(10),
    db
      .select()
      .from(members)
      .where(or(like(members.name, query), like(members.email, query)))
      .limit(10),
  ]);

  return c.json({
    folders: folderResults,
    files: fileResults,
    members: memberResults,
  });
});

// 👇 Plug in Hono using .fetch(req)
export async function GET(req: Request) {
  return app.fetch(req);
}