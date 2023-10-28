export async function GET() {
  // logging out, send back empty cookie with max age 0

  return new Response(
    JSON.stringify({
      auth: false,
    }),
    {
      headers: {
        "content-type": "application/json",
        "set-cookie": `token=; path=/; HttpOnly; SameSite=Strict; Max-Age=0`,
      },
    }
  );
}
