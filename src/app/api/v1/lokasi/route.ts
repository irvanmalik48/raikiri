import { NextRequest } from "next/server";
import prisma from "@/server/prisma";

function getLokasiByCUID(
  cuid: string,
  options: {
    include?: {
      users: boolean;
      absensi: boolean;
      giat: boolean;
    };
  }
) {
  return prisma.lokasi.findUnique({
    where: { id: cuid },
    include: options.include,
  });
}

function getLokasis(options: {
  include?: {
    users: boolean;
    absensi: boolean;
    giat: boolean;
  };
}) {
  return prisma.lokasi.findMany({
    include: options.include,
  });
}

export async function GET(req: NextRequest) {
  const includeUsers = req.nextUrl.searchParams.has("includeUsers");
  const includeAbsensi = req.nextUrl.searchParams.has("includeAbsensi");
  const includeGiat = req.nextUrl.searchParams.has("includeGiat");

  const lokasi = req.nextUrl.searchParams.has("cuid")
    ? await getLokasiByCUID(req.nextUrl.searchParams.get("cuid") as string, {
        include: {
          users: includeUsers,
          absensi: includeAbsensi,
          giat: includeGiat,
        },
      })
    : await getLokasis({
        include: {
          users: includeUsers,
          absensi: includeAbsensi,
          giat: includeGiat,
        },
      });
  return new Response(JSON.stringify(lokasi), {
    headers: { "content-type": "application/json" },
  });
}
