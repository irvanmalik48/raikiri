import { NextRequest } from "next/server";
import prisma from "@/server/prisma";
import fs from "fs/promises";
import JSZip from "jszip";

async function getUserByCUID(cuid: string) {
  const buf = await prisma.user.findUnique({
    where: { id: cuid },
    select: {
      cardUrl: true,
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

  const getFile = await fs.readFile(`${process.cwd()}${buf?.cardUrl}`);

  return getFile;
}

async function getUserByIds(ids: string[]) {
  const bufs = await prisma.user.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      cardUrl: true,
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

  const zip = new JSZip();

  for (let i = 0; i < bufs.length; i++) {
    const getFile = await fs.readFile(`${process.cwd()}${bufs[i].cardUrl}`);
    zip.file(
      `${bufs[i].name}-${bufs[i].lokasi?.name}-${bufs[i].statusKeanggotaan}.png`,
      getFile
    );
  }

  return zip.generateAsync({ type: "nodebuffer" });
}

async function getUsers() {
  const bufs = await prisma.user.findMany({
    select: {
      cardUrl: true,
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

  const zip = new JSZip();

  for (let i = 0; i < bufs.length; i++) {
    const getFile = await fs.readFile(`${process.cwd()}${bufs[i].cardUrl}`);
    zip.file(
      `${bufs[i].name}-${bufs[i].lokasi?.name}-${bufs[i].statusKeanggotaan}.png`,
      getFile
    );
  }

  return zip.generateAsync({ type: "nodebuffer" });
}

export async function POST(req: NextRequest) {
  const jsonData = await req.json();

  if (jsonData.cuid) {
    const user = await getUserByCUID(jsonData.cuid);
    return new Response(user, {
      headers: { "content-type": "image/png" },
    });
  } else if (jsonData.ids) {
    const users = await getUserByIds(
      jsonData.ids.filter((id: string) => id !== null)
    );
    return new Response(users, {
      headers: { "content-type": "application/zip" },
    });
  } else {
    const users = await getUsers();
    return new Response(users, {
      headers: { "content-type": "application/zip" },
    });
  }
}
