import prisma from "@/server/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const data = {
    name: form.get("name") as string,
    lokasi: form.get("lokasi") as string,
    waktu: form.get("waktu") as string,
  };

  const getLokasi = await prisma.lokasi.findUnique({
    where: {
      id: data.lokasi,
    },
  });

  const giat = await prisma.giat.create({
    data: {
      name: data.name,
      lokasi: {
        connectOrCreate: {
          where: {
            id: getLokasi?.id ?? "",
          },
          create: {
            name: data.lokasi,
          },
        },
      },
      waktu: data.waktu,
    },
  });

  return new Response(JSON.stringify(giat), {
    headers: { "content-type": "application/json" },
  });
}
