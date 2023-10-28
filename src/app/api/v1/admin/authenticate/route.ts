import prisma from "@/server/prisma";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const data = {
    username: form.get("username") as string,
    password: form.get("password") as string,
  };

  const adminData = await prisma.administrator.findFirst({
    where: {
      username: data.username,
    },
  });

  if (!adminData) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      headers: { "content-type": "application/json" },
    });
  }

  const compare = await bcrypt.compare(data.password, adminData.password ?? "");

  if (!compare) {
    return new Response(JSON.stringify({ error: "Password is incorrect" }), {
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({
      auth: true,
    }),
    {
      headers: {
        "content-type": "application/json",
        "set-cookie": `token=${jwt.sign(
          { id: adminData.id },
          process.env.JWT_SECRET ?? "",
          {
            expiresIn: "12h",
          }
        )}; path=/; HttpOnly; SameSite=Strict`,
      },
    }
  );
}
