"use client";

import { Lokasi, User } from "@prisma/client";
import ExcelJS from "exceljs";
import { atom, useAtom } from "jotai";
import { Download, FileSpreadsheet, PlusCircle, Trash, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";

const dataAnggotaAtom = atom<
  (User & {
    lokasi: Lokasi | null;
  })[]
>([]);
const lokasiAtom = atom<Lokasi[]>([]);

export function FilterComponent({
  filterText,
  onFilter,
}: {
  filterText: string;
  onFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [data] = useAtom(dataAnggotaAtom);
  const [lokasi, setLokasi] = useAtom(lokasiAtom);

  const [filterAsal, setFilterAsal] = useState<string>("");

  useEffect(() => {
    fetch("/api/v1/lokasi")
      .then((res) => res.json())
      .then((data) => {
        setLokasi(data);
      });
  }, [setLokasi]);

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
        href="/anggota/add"
        className="bg-green-900 hover:bg-green-800 transition text-white rounded-xl px-5 text-sm py-2 flex gap-2 items-center"
      >
        <PlusCircle size={16} />
        <span>Tambah Anggota</span>
      </Link>
      <select
        id="lokasiselect"
        className="border appearance-none bg-white border-gray-300 rounded-xl px-5 text-sm py-2"
        onChange={(e) => {
          setFilterAsal(e.target.value);
        }}
      >
        <option value="">Semua Lokasi</option>
        {lokasi.map((lokasi, i) => (
          <option key={i} value={lokasi.id}>
            {lokasi.name}
          </option>
        ))}
      </select>
      <button
        className="bg-black text-white rounded-xl px-5 text-sm py-2 flex gap-2 items-center"
        onClick={(e) => {
          e.preventDefault();

          if (!data) {
            window.alert(
              "Terjadi kesalahan saat mengambil data anggota. Mungkin data anggota kosong?"
            );
            return;
          }

          let filteredData = data;
          if (filterAsal !== "") {
            filteredData = data.filter((row) => row.lokasi?.id === filterAsal);
          }

          const spreadsheet = new ExcelJS.Workbook();

          const sheet = spreadsheet.addWorksheet("Anggota");

          const rows = filteredData.map((row, i) => {
            const { name, lokasi, statusKeanggotaan } = row;
            return [i + 1, name, lokasi?.name, statusKeanggotaan];
          });

          const firstRowCell = 6;
          const lastRowCell = firstRowCell + rows.length + 1;

          sheet.getRow(6).values = [
            "NO",
            "NAMA JAMA'AH",
            "ASAL TITIK",
            "STATUS KEANGGOTAAN",
          ];

          const dataRows = sheet.getRows(7, lastRowCell);

          dataRows?.forEach((dataRow, i) => {
            dataRow.values = rows[i];
          });

          for (let i = firstRowCell; i < lastRowCell; i++) {
            sheet.getCell(`A${i}`).border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };

            // B
            sheet.getCell(`B${i}`).border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };

            // C
            sheet.getCell(`C${i}`).border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };

            // D
            sheet.getCell(`D${i}`).border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          }

          sheet.getColumn(1).width = 5;

          sheet.getRow(1).font = {
            bold: true,
            size: 14,
          };
          sheet.getRow(1).alignment = {
            vertical: "middle",
            horizontal: "center",
          };
          sheet.getRow(2).font = {
            bold: true,
            size: 14,
          };
          sheet.getRow(2).alignment = {
            vertical: "middle",
            horizontal: "center",
          };
          sheet.getRow(4).font = {
            bold: true,
          };
          sheet.getRow(4).alignment = {
            vertical: "middle",
            horizontal: "left",
          };

          sheet.getCell("A1").value = "DAFTAR NAMA QR CODE BARU";
          sheet.getCell("A2").value = "JAMA'AH PONDOK PETA KABUPATEN KEDIRI";
          sheet.getCell("A4").value = `Asal Titik : ${
            filterAsal === ""
              ? "Semua"
              : lokasi.find((a) => a.id === filterAsal)?.name
          }`;

          sheet.getColumn(2).width = 40;
          sheet.getColumn(3).width = 30;
          sheet.getColumn(4).width = 30;

          sheet.getRow(6).font = {
            bold: true,
          };

          sheet.getRow(6).alignment = {
            vertical: "middle",
            horizontal: "center",
          };

          sheet.getRow(1).height = 20;
          sheet.getRow(2).height = 20;
          sheet.getRow(3).height = 8;
          sheet.getRow(4).height = 20;
          sheet.getRow(5).height = 8;

          sheet.mergeCells("A1:D1");
          sheet.mergeCells("A2:D2");
          sheet.mergeCells("A4:B4");

          const headerCells = ["A6", "B6", "C6", "D6"];

          headerCells.forEach((val) => {
            sheet.getCell(val).fill = {
              type: "pattern",
              pattern: "solid",
              bgColor: {
                argb: "FF000000",
              },
            };
          });

          spreadsheet.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const a = document.createElement("a");
            a.href = window.URL.createObjectURL(blob);
            a.download = `export-anggota-${new Date().toISOString()}.xlsx`;
            a.click();
          });
        }}
      >
        <FileSpreadsheet size={16} />
        <span>Export Excel</span>
      </button>
    </div>
  );
}

export default function UsersDataTable() {
  const [data, setData] = useAtom(dataAnggotaAtom);
  const [filterName, setFilterName] = useState<string>("");
  const [pending, setPending] = useState<boolean>(true);

  const [selectedRows, setSelectedRows] = useState<User[]>([]);
  const [toggleCleared, setToggleCleared] = useState(false);

  const router = useRouter();

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

      if (window.confirm("Apakah anda yakin ingin menghapus data?")) {
        await fetch(`/api/v1/users/delete`, {
          method: "POST",
          body: JSON.stringify(selectedRowsId),
        });

        setPending(true);
        setToggleCleared(!toggleCleared);
      }
    };

    const handleExportQRCard = async () => {
      const selectedRowsId = selectedRows.map((row) => row.id);

      if (window.confirm("Apakah anda yakin ingin mengexport kartu?")) {
        const data = await fetch(`/api/v1/users/card`, {
          method: "POST",
          body: JSON.stringify({
            ids: selectedRowsId,
          }),
        }).then((res) => res.blob());

        const a = document.createElement("a");
        a.href = window.URL.createObjectURL(data);
        a.download = `export-kartu-qr-${new Date().toISOString()}.zip`;
        a.click();

        setPending(true);
        setToggleCleared(!toggleCleared);
      }
    };

    return (
      <div className="flex flex-wrap gap-3 items-center">
        <button
          className="bg-black text-white rounded-xl px-5 text-sm py-2 flex gap-2 items-center"
          onClick={handleExportQRCard}
        >
          <Download size={16} />
          <span>Export Kartu QR</span>
        </button>
        <button
          className="bg-red-900 hover:bg-red-800 transition text-white rounded-xl px-5 text-sm py-2 flex gap-2 items-center"
          onClick={handleDelete}
        >
          <Trash size={16} />
          <span>Delete selected</span>
        </button>
      </div>
    );
  }, [selectedRows, toggleCleared]);

  useEffect(() => {
    fetch("/api/v1/users")
      .then((res) => res.json())
      .then(
        (
          data: (User & {
            lokasi: Lokasi | null;
          })[]
        ) => {
          setData(
            data.filter(
              (user) =>
                user.name!.toLowerCase().includes(filterName.toLowerCase()) ||
                user
                  .statusKeanggotaan!.toLowerCase()
                  .includes(filterName.toLowerCase()) ||
                user.lokasi
                  ?.name!.toLowerCase()
                  .includes(filterName.toLowerCase())
            )
          );
          setPending(false);
        }
      );
  }, [setData, filterName, toggleCleared]);

  const columns: TableColumn<
    User & {
      lokasi: Lokasi | null;
    }
  >[] = [
    {
      name: "Nama Anggota",
      selector: (row) => row.name as string,
      sortable: true,
    },
    {
      name: "Titik Lokasi",
      selector: (row) => row.lokasi?.name as string,
      sortable: true,
    },
    {
      name: "Status Keanggotaan",
      selector: (row) => row.statusKeanggotaan as string,
      sortable: true,
    },
    {
      name: "Kali Export QR",
      selector: (row) => row.trackDownloads as number,
      sortable: true,
    },
  ];

  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

  return (
    <DataTable
      title="Daftar Keanggotaan"
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
      onRowClicked={(row) => {
        router.push(`/anggota/view/${row.id}`);
      }}
    />
  );
}
