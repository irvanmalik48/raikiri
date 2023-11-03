import { NextRequest } from "next/server";
import ExcelJS from "exceljs";

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const excelFile = form.get("file") as File;
  const buffer = await excelFile.arrayBuffer();

  const workbook = new ExcelJS.Workbook();

  const loaded = await workbook.xlsx.load(buffer);
  const worksheet = loaded.worksheets[0];

  const data = () => {
    let data: {
      name: string;
      lokasi: string;
      statusName: string;
    }[] = [];

    for (let i = 6; i <= worksheet.rowCount; i++) {
      const row = worksheet.getRow(i);

      const name = row.getCell(2).value as string;
      const lokasi = row.getCell(3).value as string;
      const statusName = row.getCell(4).value as string;

      data.push({
        name,
        lokasi,
        statusName,
      });
    }

    return data;
  };

  const allUser = data();
  const res = [];

  for (let i = 0; i < allUser.length; i++) {
    const form = new FormData();
    form.append("name", allUser[i].name);
    form.append("lokasi", allUser[i].lokasi);
    form.append("statusName", allUser[i].statusName);

    const send = await fetch(
      `${
        process.env.NEXT_PUBLIC_URL || "http://localhost:3000"
      }/api/v1/users/create`,
      {
        method: "POST",
        body: form,
        headers: {
          origin: "http://localhost:3000",
        },
      }
    );

    res.push(await send.json());
  }

  return new Response(JSON.stringify(res), {
    headers: { "content-type": "application/json" },
  });
}
