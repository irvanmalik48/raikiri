import prisma from "@/server/prisma";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const data = {
    username: form.get("username") as string,
    password: form.get("password") as string,
  };

  const user = await prisma.administrator.findFirst({
    where: {
      username: data.username,
    },
  });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      headers: { "content-type": "application/json" },
    });
  }

  const pass = await bcrypt.hash(data.password, 12);

  const admin = prisma.administrator.update({
    data: {
      username: data.username,
      password: pass,
    },
    where: {
      id: user?.id,
    },
  });

  return new Response(JSON.stringify(admin), {
    headers: { "content-type": "application/json" },
  });
}
