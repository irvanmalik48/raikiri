import prisma from "@/server/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const form = await req.json();
  const data = form.map((absensi: any) => ({
    userId: absensi.userId,
    giatId: absensi.giatId,
  }));

  const findRelatedAbsensi = await prisma.absensi.findMany({
    where: {
      AND: [
        {
          userId: {
            in: data.map((item: { userId: any }) => item.userId),
          },
        },
        {
          giatId: {
            in: data.map((item: { giatId: any }) => item.giatId),
          },
        },
      ],
    },
  });

  const absensi = await prisma.absensi.deleteMany({
    where: {
      id: {
        in: findRelatedAbsensi.map((item: { id: any }) => item.id),
      },
    },
  });

  return new Response(JSON.stringify(absensi), {
    headers: { "content-type": "application/json" },
  });
}
