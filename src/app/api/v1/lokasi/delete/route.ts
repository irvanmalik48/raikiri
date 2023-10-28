import prisma from "@/server/prisma";
import { NextRequest } from "next/server";

async function deleteLokasi(statuses: string[]) {
  return prisma.lokasi.deleteMany({
    where: {
      id: {
        in: statuses,
      },
    },
  });
}

export async function POST(req: NextRequest) {
  const form = await req.json();

  const ids = form.map((lokasi: any) => lokasi.id);

  const deletedLokasi = await deleteLokasi(ids);

  return new Response(JSON.stringify(deletedLokasi), {
    headers: { "content-type": "application/json" },
  });
}
