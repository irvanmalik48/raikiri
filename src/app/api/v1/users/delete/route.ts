import { NextRequest } from "next/server";
import prisma from "@/server/prisma";
import fs from "fs/promises";

async function deleteUsers(users: string[]) {
  // delete images
  users.forEach(async (user) => {
    await fs.unlink(`${process.cwd()}/uploads/images/${user}.png`);
  });

  return prisma.user.deleteMany({
    where: {
      id: {
        in: users,
      },
    },
  });
}

export async function POST(req: NextRequest) {
  const users = await req.json();
  const ids = users.map((user: any) => user.id);

  await deleteUsers(ids);

  return new Response(JSON.stringify(ids), {
    headers: { "content-type": "application/json" },
  });
}
