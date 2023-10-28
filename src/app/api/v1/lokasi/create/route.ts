import prisma from "@/server/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const data = {
    name: form.get("name") as string,
  };

  const lokasi = await prisma.lokasi.create({
    data: {
      name: data.name,
    },
  });

  return new Response(JSON.stringify(lokasi), {
    headers: { "content-type": "application/json" },
  });
}
