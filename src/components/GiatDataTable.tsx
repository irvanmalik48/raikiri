"use client";

import { Giat, Lokasi, Absensi } from "@prisma/client";
import ExcelJS from "exceljs";
import { atom, useAtom } from "jotai";
import { FileSpreadsheet, PlusCircle, Sheet, Trash, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";

const dataGiatAtom = atom<
  (Giat & {
    lokasi: Lokasi | null;
    absensi: Absensi[];
  })[]
>([]);

function getAccurateDateISO(date: Date) {
  const offset = date.getTimezoneOffset();
  const newDate = new Date(date.getTime() - offset * 60 * 1000);
  const iso = newDate.toISOString().split("T")[0];

  return iso;
}

export function FilterComponent({
  filterText,
  onFilter,
  onClear,
}: {
  filterText: string;
  onFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
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
      <button
        className="bg-red-900 hover:bg-red-800 transition text-white rounded-xl px-5 text-sm py-2 flex gap-2 items-center"
        onClick={onClear}
      >
        <X size={16} />
        <span>Clear</span>
      </button>
      <Link
        href="/kegiatan/add"
        className="bg-green-900 hover:bg-green-800 transition text-white rounded-xl px-5 text-sm py-2 flex gap-2 items-center"
      >
        <PlusCircle size={16} />
        <span>Tambah Kegiatan</span>
      </Link>
    </div>
  );
}

export default function UsersDataTable() {
  const [data, setData] = useAtom(dataGiatAtom);
  const [filterName, setFilterName] = useState<string>("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [pending, setPending] = useState<boolean>(true);

  const [selectedRows, setSelectedRows] = useState<Giat[]>([]);
  const [toggleCleared, setToggleCleared] = useState(false);

  const router = useRouter();

  const subHeaderFilterCompMemo = useMemo(() => {
    const handleClear = () => {
      if (filterName) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterName("");
      }
    };

    return (
      <FilterComponent
        onFilter={(e) => setFilterName(e.target.value)}
        onClear={handleClear}
        filterText={filterName}
      />
    );
  }, [filterName, resetPaginationToggle]);

  const headerDeleteCompMemo = useMemo(() => {
    const handleDelete = async () => {
      const selectedRowsId = selectedRows.map((row) => ({
        id: row.id,
      }));

      if (window.confirm("Apakah anda yakin ingin menghapus data?")) {
        await fetch(`/api/v1/giat/delete`, {
          method: "POST",
          body: JSON.stringify(selectedRowsId),
        });

        setPending(true);
        setToggleCleared(!toggleCleared);
      }
    };

    return (
      <button
        className="bg-red-900 hover:bg-red-800 transition text-white rounded-xl px-5 text-sm py-2 flex gap-2 items-center"
        onClick={handleDelete}
      >
        <Trash size={16} />
        <span>Delete selected</span>
      </button>
    );
  }, [selectedRows, toggleCleared]);

  useEffect(() => {
    fetch("/api/v1/giat?includeLokasi&includeAbsensi")
      .then((res) => res.json())
      .then(
        (
          data: (Giat & {
            lokasi: Lokasi | null;
            absensi: Absensi[];
          })[]
        ) => {
          setData(
            data.filter((user) =>
              user.name!.toLowerCase().includes(filterName.toLowerCase())
            )
          );
          setPending(false);
        }
      );
  }, [setData, filterName, toggleCleared]);

  const columns: TableColumn<
    Giat & {
      lokasi: Lokasi | null;
      absensi: Absensi[];
    }
  >[] = [
    {
      id: "waktu",
      name: "Tanggal Giat",
      selector: (row) =>
        getAccurateDateISO(new Date(row.waktu as Date)) as string,
      sortable: true,
    },
    {
      name: "Nama Kegiatan",
      selector: (row) => row.name as string,
      sortable: true,
    },
    {
      name: "Titik Lokasi",
      selector: (row) => row.lokasi?.name as string,
      sortable: true,
    },
    {
      name: "Jumlah Kehadiran",
      selector: (row) => row.absensi.length as number,
      sortable: true,
    },
  ];

  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

  return (
    <DataTable
      title="Daftar Kegiatan"
      columns={columns}
      data={data || []}
      pagination
      paginationPerPage={10}
      paginationResetDefaultPage={resetPaginationToggle}
      subHeader
      subHeaderComponent={subHeaderFilterCompMemo}
      highlightOnHover
      selectableRows
      defaultSortFieldId={"waktu"}
      defaultSortAsc={false}
      responsive
      contextActions={headerDeleteCompMemo}
      onSelectedRowsChange={handleRowSelected}
      clearSelectedRows={toggleCleared}
      progressPending={pending}
      onRowClicked={(row) => {
        router.push(`/kegiatan/view/${row.id}`);
      }}
    />
  );
}
