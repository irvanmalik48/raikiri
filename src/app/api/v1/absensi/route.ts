import { NextRequest } from "next/server";
import prisma from "@/server/prisma";

function getAbsensiByCUID(
  cuid: string,
  options: {
    include?: {
      users: boolean;
      giat: boolean;
    };
  }
) {
  return prisma.absensi.findUnique({
    where: { id: cuid },
    include: options.include,
  });
}

function getAbsensis(options: {
  include?: {
    users: boolean;
    giat: boolean;
  };
}) {
  return prisma.absensi.findMany({
    include: options.include,
  });
}

function getAbsensiByGiat(
  giatId: string,
  options: {
    include?: {
      users: boolean;
      giat: boolean;
    };
  }
) {
  return prisma.absensi.findMany({
    where: { giatId },
    include: options.include,
  });
}

export async function GET(req: NextRequest) {
  const includeUsers = req.nextUrl.searchParams.has("includeUsers");
  const includeGiat = req.nextUrl.searchParams.has("includeGiat");

  if (req.nextUrl.searchParams.has("cuid")) {
    const absensi = await getAbsensiByCUID(
      req.nextUrl.searchParams.get("cuid") as string,
      {
        include: {
          users: includeUsers,
          giat: includeGiat,
        },
      }
    );
    return new Response(JSON.stringify(absensi), {
      headers: { "content-type": "application/json" },
    });
  } else if (req.nextUrl.searchParams.has("giatId")) {
    const absensi = await getAbsensiByGiat(
      req.nextUrl.searchParams.get("giatId") as string,
      {
        include: {
          users: includeUsers,
          giat: includeGiat,
        },
      }
    );
    return new Response(JSON.stringify(absensi), {
      headers: { "content-type": "application/json" },
    });
  } else {
    const absensi = await getAbsensis({
      include: {
        users: includeUsers,
        giat: includeGiat,
      },
    });
    return new Response(JSON.stringify(absensi), {
      headers: { "content-type": "application/json" },
    });
  }
}
