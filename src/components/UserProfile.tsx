"use client";

import { Edit, Trash } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function UserProfile({ userId }: { userId: string }) {
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/v1/users?cuid=${userId}&includeLokasi`)
      .then((res) => res.json())
      .then((data) => {
        setProfileData(data);
      });
  }, [userId]);

  return (
    <div className="flex lg:justify-end flex-row lg:flex-row-reverse gap-10 flex-wrap py-5">
      <div className="flex flex-col gap-5 lg:items-start w-full items-center max-w-lg">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold w-full text-center md:text-left">
            ID
          </span>
          <span className="w-full text-center md:text-left">
            {profileData?.id}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold w-full text-center md:text-left">
            Nama Lengkap
          </span>
          <span className="w-full text-center md:text-left">
            {profileData?.name}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold w-full text-center md:text-left">
            Asal Titik
          </span>
          <span className="w-full text-center md:text-left">
            {profileData?.lokasi?.name}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold w-full text-center md:text-left">
            Status Keanggotaan
          </span>
          <span className="w-full text-center md:text-left">
            {profileData?.statusKeanggotaan}
          </span>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link
            className="bg-black text-white rounded-xl px-5 text-sm py-2 flex gap-2 items-center"
            href={`/anggota/edit/${profileData?.id}`}
          >
            <Edit size={16} />
            <span>Edit</span>
          </Link>
          <Link
            className="bg-red-900 hover:bg-red-800 transition text-white rounded-xl px-5 text-sm py-2 flex gap-2 items-center"
            href={`/anggota/delete/${profileData?.id}`}
          >
            <Trash size={16} />
            <span>Hapus</span>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-1 w-full md:w-fit items-center md:items-start">
        <span className="text-sm font-semibold w-full text-center md:text-left">
          Kartu Jama&apos;ah
        </span>
        <Image
          width={638}
          height={1011}
          className="max-w-[400px]"
          src={`/api/v1/get-image?path=${encodeURIComponent(
            profileData?.cardUrl
          )}`}
          alt="Kartu Jama'ah"
        />
      </div>
    </div>
  );
}
