import { NextRequest } from "next/server";
import prisma from "@/server/prisma";

function getGiatByCUID(
  cuid: string,
  options: {
    include?: {
      lokasi: boolean;
      absensi: boolean;
    };
  }
) {
  return prisma.giat.findUnique({
    where: { id: cuid },
    include: options.include,
  });
}

function getGiats(options: {
  include?: {
    lokasi: boolean;
    absensi: boolean;
  };
}) {
  return prisma.giat.findMany({
    include: options.include,
  });
}

export async function GET(req: NextRequest) {
  const includeLokasi = req.nextUrl.searchParams.has("includeLokasi");
  const includeAbsensi = req.nextUrl.searchParams.has("includeAbsensi");

  const giat = req.nextUrl.searchParams.has("cuid")
    ? await getGiatByCUID(req.nextUrl.searchParams.get("cuid") as string, {
        include: {
          lokasi: includeLokasi,
          absensi: includeAbsensi,
        },
      })
    : await getGiats({
        include: {
          lokasi: includeLokasi,
          absensi: includeAbsensi,
        },
      });
  return new Response(JSON.stringify(giat), {
    headers: { "content-type": "application/json" },
  });
}
