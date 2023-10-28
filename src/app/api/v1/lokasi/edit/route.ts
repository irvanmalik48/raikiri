import prisma from "@/server/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const data = {
    id: form.get("id") as string,
    name: form.get("name") as string,
  };

  const lokasi = await prisma.lokasi.update({
    data: {
      name: data.name,
    },
    where: {
      id: data.id,
    },
  });

  return new Response(JSON.stringify(lokasi), {
    headers: { "content-type": "application/json" },
  });
}
