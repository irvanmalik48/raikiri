import { NextRequest } from "next/server";
import prisma from "@/server/prisma";

import { html } from "satori-html";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import QRCode from "qrcode";
import fs from "fs/promises";
import { ReactNode } from "react";

export async function POST(req: NextRequest) {
  const form = await req.formData();

  const data = {
    name: form.get("name") as string,
    lokasi: form.get("lokasi") as string,
    statusName: form.get("statusName") as string,
  };

  const getLokasi = await prisma.lokasi.findFirst({
    where: {
      name: data.lokasi.toUpperCase(),
    },
  });

  const user = await prisma.user.create({
    data: {
      name: data.name,
      lokasi: {
        connectOrCreate: {
          where: {
            id: getLokasi?.id ?? "",
          },
          create: {
            name: data.lokasi.toUpperCase(),
          },
        },
      },
      statusKeanggotaan: data.statusName,
    },
    include: {
      lokasi: true,
    },
  });

  const qrCode = await QRCode.toDataURL(user.id, { errorCorrectionLevel: "H" });

  const templateFront = html(`<div
  style="
    width: 638px;
    height: 1011px;
    position: relative;
    background: radial-gradient(
      100% 100% at 50% 50%,
      #00970f 0%,
      #044b0c 100%
    );
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  "
>
  <div
    style="
      width: 150px;
      height: 150px;
      left: 0px;
      bottom: 0px;
      position: absolute;
      color: #f5ab1b;
      display: flex;
    "
  >
    <svg
      width="150"
      height="150"
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Union">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0 0H14.1176V91.7647H44.1176V61.7647H81.1765V38.8235H88.2353V61.7647H111.176V68.8235H88.2353V105.882H58.2353V135.882H150V150H44.1176V105.882H0V0ZM81.1765 68.8235H58.2353V91.7647H81.1765V68.8235Z"
          fill="#F5AB1B"
        />
        <path
          d="M31.7647 118.235H14.1176V135.882H31.7647V118.235Z"
          fill="#F5AB1B"
        />
      </g>
    </svg>
  </div>
  <div
    style="
      width: 150px;
      height: 150px;
      right: 0px;
      bottom: 0px;
      position: absolute;
      color: #f5ab1b;
      display: flex;
    "
  >
    <svg
      width="150"
      height="150"
      viewBox="0 0 150 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="Union">
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M150 0H135.882V91.7647H105.882V61.7647H68.8235V38.8235H61.7647V61.7647H38.8235V68.8235H61.7647V105.882H91.7647V135.882H0V150H105.882V105.882H150V0ZM68.8235 68.8235H91.7647V91.7647H68.8235V68.8235Z"
          fill="#F5AB1B"
        />
        <path
          d="M118.235 118.235H135.882V135.882H118.235V118.235Z"
          fill="#F5AB1B"
        />
      </g>
    </svg>
  </div>
  <div
    style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 412px;
      position: absolute;
      top: 177.5px;
      box-sizing: border-box;
      display: flex;
    "
  >
    <div
      style="
        width: auto;
        height: auto;
        padding: 6px;
        background: #f5ab1b;
        justify-content: center;
        align-items: center;
        display: flex;
        box-sizing: border-box;
        margin: auto;
        overflow: hidden;
        display: flex;
      "
    >
      <img
        width="400"
        height="400"
        style="object-fit: cover"
        src="${qrCode}"
      />
    </div>
  </div>
  <div
    style="
      position: absolute;
      width: 100%;
      top: 0;
      padding: 28px 16px;
      background: #002304;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
    "
  >
    <p
      style="
        width: 100%;
        padding: 0;
        margin: 0;
        text-align: center;
        color: white;
        font-size: 24px;
        font-family: Inter;
        font-weight: 500;
        word-wrap: break-word;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      "
    >
      JAMA&apos;AH PONDOK PETA<br />KABUPATEN KEDIRI
    </p>
  </div>
  <div
    style="
      position: absolute;
      width: 100%;
      bottom: 180px;
      padding: 40px 16px 80px;
      background: #002304;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    "
  >
    <svg
      width="114"
      height="57"
      viewBox="0 0 114 57"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style="
        position: absolute;
        bottom: -28.5px;
        left: 262px;
      "
    >
      <path
        d="M14.1421 42.2842L28.071 28.3553L56.2843 56.5685L84.5685 28.2843L56.2843 6.10352e-05L28.2133 28.071L14.1421 13.9999L0 28.1421L14.1421 42.2842Z"
        fill="#F5AB1B"
      />
      <path
        d="M99.1421 13.9999L85 28.1421L99.1421 42.2842L113.284 28.1421L99.1421 13.9999Z"
        fill="#F5AB1B"
      />
    </svg>
    <div
      style="
        width: 100%;
        padding: 0;
        margin: auto;
        text-align: center;
        color: #f5ab1b;
        font-size: 34px;
        font-family: Inter;
        font-weight: 600;
        word-wrap: break-word;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      ${data.name.toUpperCase()}
    </div>
    <div
      style="
        width: 100%;
        padding: 0;
        margin: auto;
        text-align: center;
        color: white;
        font-size: 28px;
        font-family: Inter;
        font-weight: 500;
        word-wrap: break-word;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        justify-content: center;
      "
    >
      ${data.lokasi.toUpperCase()}
    </div>
  </div>
</div>`);

  const allFonts = [
    {
      name: "Inter",
      data: await fs.readFile(
        `${process.cwd()}/public/fonts/Inter-Regular.ttf`
      ),
      style: "normal",
      weight: 400,
    },
    {
      name: "Inter",
      data: await fs.readFile(`${process.cwd()}/public/fonts/Inter-Bold.ttf`),
      style: "normal",
      weight: 700,
    },
    {
      name: "Inter",
      data: await fs.readFile(`${process.cwd()}/public/fonts/Inter-Medium.ttf`),
      style: "normal",
      weight: 500,
    },
    {
      name: "Inter",
      data: await fs.readFile(
        `${process.cwd()}/public/fonts/Inter-SemiBold.ttf`
      ),
      style: "normal",
      weight: 600,
    },
  ];

  const svgFront = await satori(templateFront as ReactNode, {
    width: 638,
    height: 1011,
    fonts: allFonts as any,
  });

  const front = new Resvg(svgFront).render();

  const frontPng = front.asPng();

  const renewedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      cardFront: frontPng,
    },
    include: {
      lokasi: true,
    },
  });

  const returnData = {
    id: renewedUser.id,
    name: renewedUser.name,
    lokasi: renewedUser.lokasi,
    statusKeanggotaan: renewedUser.statusKeanggotaan,
    qrCode: qrCode,
  };

  return new Response(JSON.stringify(returnData), {
    headers: { "content-type": "application/json" },
  });
}
