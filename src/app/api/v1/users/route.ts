import { NextRequest } from "next/server";
import prisma from "@/server/prisma";

function getUserByCUID(cuid: string) {
  return prisma.user.findUnique({
    where: { id: cuid },
    select: {
      cardFront: false,
      name: true,
      id: true,
      lokasi: true,
      statusKeanggotaan: true,
      trackDownloads: true,
    },
  });
}

function getUsers() {
  return prisma.user.findMany({
    select: {
      cardFront: false,
      name: true,
      id: true,
      lokasi: true,
      statusKeanggotaan: true,
      trackDownloads: true,
    },
  });
}

export async function GET(req: NextRequest) {
  const users = req.nextUrl.searchParams.has("cuid")
    ? await getUserByCUID(req.nextUrl.searchParams.get("cuid") as string)
    : await getUsers();
  return new Response(JSON.stringify(users), {
    headers: { "content-type": "application/json" },
  });
}
