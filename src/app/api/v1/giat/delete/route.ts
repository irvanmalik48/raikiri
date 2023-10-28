import prisma from "@/server/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const form = await req.json();

  const data = form.map((item: any) => item.id);

  const giat = await prisma.giat.deleteMany({
    where: {
      id: {
        in: data,
      },
    },
  });

  return new Response(JSON.stringify(giat), {
    headers: { "content-type": "application/json" },
  });
}
