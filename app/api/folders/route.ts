import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { db } from '@/db';
import { folders } from '@/db/schema';

export async function GET(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const allFolders = await db.select().from(folders).where(eq(folders.userId, userId)).all();
  return new Response(JSON.stringify(allFolders), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function POST(req: Request) {
  const userId = req.headers.get('x-user-id');
  if (!userId) return new Response('Unauthorized', { status: 401 });

  const body = await req.json();
  const schema = z.object({ name: z.string().min(1) });
  const parsed = schema.safeParse(body);
  if (!parsed.success)
    return new Response(JSON.stringify({ error: 'Invalid name' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });

  const id = nanoid();
  await db.insert(folders).values({ id, name: parsed.data.name, userId }).run();

  return new Response(JSON.stringify({ id, name: parsed.data.name }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  });
}