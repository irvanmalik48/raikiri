import prisma from "@/server/prisma";
import { Absensi } from "@prisma/client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const form = await req.formData();

  if (form.has("userId")) {
    const data = {
      userId: form.get("userId") as string,
      giatId: form.get("giatId") as string,
      status: form.get("status") as string,
    };

    const absensi = await prisma.absensi.create({
      data: {
        user: {
          connect: {
            id: data.userId,
          },
        },
        giat: {
          connect: {
            id: data.giatId,
          },
        },
        status: data.status,
      },
    });

    return new Response(JSON.stringify(absensi), {
      headers: { "content-type": "application/json" },
    });
  } else {
    const data = JSON.parse(form.get("data") as string) as unknown as {
      userId: string;
      giatId: string;
      status: string;
    }[];

    let absensi: Absensi[] = [];

    for (const item of data) {
      const temp = await prisma.absensi.create({
        data: {
          user: {
            connect: {
              id: item.userId,
            },
          },
          giat: {
            connect: {
              id: item.giatId,
            },
          },
          status: item.status,
        },
      });

      absensi.push(temp);
    }

    return new Response(JSON.stringify(absensi), {
      headers: { "content-type": "application/json" },
    });
  }
}
