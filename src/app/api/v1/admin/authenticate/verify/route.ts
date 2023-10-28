import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const token = form.get("token") as string;

  const decoded = jwt.verify(token, process.env.JWT_SECRET ?? "");

  if (typeof decoded === "string") {
    return new Response(JSON.stringify({ error: decoded }), {
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
      },
    }
  );
}
