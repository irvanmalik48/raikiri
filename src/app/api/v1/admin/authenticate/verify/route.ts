import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/server/prisma";

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const token = form.get("token") as string;

  const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "");

  const getAdmin = await prisma.administrator.findFirst({
    where: {
      id: (decoded as { id: string }).id,
    },
  });

  if (!getAdmin) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      headers: { "content-type": "application/json" },
    });
  }

  if (typeof decoded === "string") {
    return new Response(JSON.stringify({ error: decoded }), {
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      auth: true,
      role: getAdmin.role,
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
}
