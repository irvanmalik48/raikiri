"use client";

import { Lokasi, User } from "@prisma/client";
import { atom, useAtom } from "jotai";
import { Pen, PlusCircle, Trash, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";

const dataAnggotaAtom = atom<
  (User & {
    lokasi: Lokasi | null;
  })[]
>([]);
const lokasiAtom = atom<(Lokasi & { users: User[] })[]>([]);

export function FilterComponent({
  filterText,
  onFilter,
}: {
  filterText: string;
  onFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="flex gap-3 flex-wrap">
      <input
        id="search"
        className="border border-gray-300 rounded-xl px-5 text-sm py-2"
        type="text"
        placeholder="Filter by name"
        aria-label="Search Input"
        value={filterText}
        onChange={onFilter}
      />
      <Link
        href="/lokasi/add"
        className="bg-green-900 hover:bg-green-800 transition text-white rounded-xl px-5 text-sm py-2 flex gap-2 items-center"
      >
        <PlusCircle size={16} />
        <span>Tambah Asal Titik</span>
      </Link>
    </div>
  );
}

export default function UsersDataTable() {
  const [data, setData] = useAtom(lokasiAtom);
  const [filterName, setFilterName] = useState<string>("");
  const [pending, setPending] = useState<boolean>(true);

  const [selectedRows, setSelectedRows] = useState<User[]>([]);
  const [toggleCleared, setToggleCleared] = useState(false);

  const subHeaderFilterCompMemo = useMemo(() => {
    return (
      <FilterComponent
        onFilter={(e) => setFilterName(e.target.value)}
        filterText={filterName}
      />
    );
  }, [filterName]);

  const headerDeleteCompMemo = useMemo(() => {
    const handleDelete = async () => {
      const selectedRowsId = selectedRows.map((row) => ({
        id: row.id,
      }));

      if (
        window.confirm(
          "Apakah anda yakin ingin menghapus data? Seluruh data jama'ah dan kegiatan yang terdapat dalam asal titik ini akan ikut terhapus! Jika anda yakin, klik OK."
        )
      ) {
        await fetch(`/api/v1/lokasi/delete`, {
          method: "POST",
          body: JSON.stringify(selectedRowsId),
        });

        setPending(true);
        setToggleCleared(!toggleCleared);
      }
    };

    return (
      <div className="flex gap-3 items-center flex-wrap">
        <button
          className="bg-red-900 hover:bg-red-800 transition text-white rounded-xl px-5 text-sm py-2 flex gap-2 items-center"
          onClick={handleDelete}
        >
          <Trash size={16} />
          <span>Delete selected</span>
        </button>
        {selectedRows.length === 1 && (
          <Link
            className="bg-black text-white rounded-xl px-5 text-sm py-2 flex gap-2 items-center"
            href={`/lokasi/edit/${selectedRows[0].id}`}
          >
            <Pen size={16} />
            <span>Edit Lokasi</span>
          </Link>
        )}
      </div>
    );
  }, [selectedRows, toggleCleared]);

  useEffect(() => {
    fetch("/api/v1/lokasi?includeUsers")
      .then((res) => res.json())
      .then(
        (
          data: (Lokasi & {
            users: User[];
          })[]
        ) => {
          setData(data.filter((lokasi) => lokasi.name?.includes(filterName)));
          setPending(false);
        }
      );
  }, [setData, filterName, toggleCleared]);

  const columns: TableColumn<
    Lokasi & {
      users: User[];
    }
  >[] = [
    {
      name: "Asal Titik",
      selector: (row) => row.name as string,
      sortable: true,
    },
    {
      name: "Jumlah Jama'ah",
      selector: (row) => row.users.length as number,
      sortable: true,
    },
  ];

  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

  return (
    <DataTable
      title="Daftar Lokasi"
      columns={columns}
      data={data || []}
      pagination
      paginationPerPage={10}
      subHeader
      subHeaderComponent={subHeaderFilterCompMemo}
      highlightOnHover
      selectableRows
      responsive
      contextActions={headerDeleteCompMemo}
      onSelectedRowsChange={handleRowSelected}
      clearSelectedRows={toggleCleared}
      progressPending={pending}
    />
  );
}
