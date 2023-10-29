import { NextRequest } from "next/server";
import fs from "fs/promises";

export async function GET(req: NextRequest) {
  const path = decodeURIComponent(
    req.nextUrl.searchParams.get("path") as string
  );
  const file = await fs.readFile(`${process.cwd()}${path}`);

  if (!file) {
    return new Response(JSON.stringify({ error: "File not found" }), {
      headers: { "content-type": "application/json" },
    });
  }

  return new Response(file, {
    headers: {
      "content-type": "image/png",
    },
  });
}
