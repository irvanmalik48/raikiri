import { NextRequest } from "next/server";
import prisma from "@/server/prisma";

async function getUserByCUID(cuid: string) {
  const buf = await prisma.user.findUnique({
    where: { id: cuid },
    select: {
      cardFront: true,
      name: true,
      id: false,
      lokasi: true,
      statusKeanggotaan: true,
    },
  });

  // update all download count
  await prisma.user.update({
    where: {
      id: cuid,
    },
    data: {
      trackDownloads: {
        increment: 1,
      },
    },
  });

  return buf?.cardFront?.toJSON();
}

async function getUserByIds(ids: string[]) {
  const bufs = await prisma.user.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      cardFront: true,
      name: true,
      id: true,
      lokasi: true,
      statusKeanggotaan: true,
    },
  });

  // update all download count
  await prisma.user.updateMany({
    where: {
      id: {
        in: ids,
      },
    },
    data: {
      trackDownloads: {
        increment: 1,
      },
    },
  });

  return bufs.map((buf) => ({
    id: buf.id,
    content: {
      name: buf.name,
      lokasi: buf.lokasi?.name,
      statusKeanggotaan: buf.statusKeanggotaan,
    },
    card: buf.cardFront?.toJSON(),
  }));
}

async function getUsers() {
  const bufs = await prisma.user.findMany({
    select: {
      cardFront: true,
      name: true,
      id: true,
      lokasi: true,
      statusKeanggotaan: true,
    },
  });

  // update all download count
  await prisma.user.updateMany({
    where: {
      id: {
        in: bufs.map((buf) => buf.id),
      },
    },
    data: {
      trackDownloads: {
        increment: 1,
      },
    },
  });

  return bufs.map((buf) => ({
    id: buf.id,
    content: {
      name: buf.name,
      lokasi: buf.lokasi?.name,
      statusKeanggotaan: buf.statusKeanggotaan,
    },
    card: buf.cardFront?.toJSON(),
  }));
}

export async function POST(req: NextRequest) {
  const jsonData = await req.json();

  if (jsonData.cuid) {
    const user = await getUserByCUID(jsonData.cuid);
    return new Response(
      user?.type === "Buffer" ? Buffer.from(user.data) : null,
      {
        headers: { "content-type": "image/png" },
      }
    );
  } else if (jsonData.ids) {
    const users = await getUserByIds(
      jsonData.ids.filter((id: string) => id !== null)
    );
    return new Response(JSON.stringify(users), {
      headers: { "content-type": "application/json" },
    });
  } else {
    const users = await getUsers();
    return new Response(JSON.stringify(users), {
      headers: { "content-type": "application/json" },
    });
  }
}
