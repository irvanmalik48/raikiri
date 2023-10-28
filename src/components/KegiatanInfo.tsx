"use client";

import { Absensi, Giat, Lokasi, User } from "@prisma/client";
import ExcelJS from "exceljs";
import { atom, useAtom } from "jotai";
import { CheckCheck, FileSpreadsheet, Pencil, Trash, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";

const dataKegiatanAtom = atom<
  | (Giat & {
      lokasi: Lokasi | null;
      absensi: Absensi[];
    })
  | null
>(null);
const dataUserAtom = atom<
  (User & {
    lokasi: Lokasi | null;
  })[]
>([]);

export function FilterComponent({
  filterText,
  onFilter,
  onClear,
}: {
  filterText: string;
  onFilter: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}) {
  const [data] = useAtom(dataUserAtom);
  const [dataKegiatan] = useAtom(dataKegiatanAtom);

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

          // sort data again by whether they are HADIR or TIDAK HADIR
          let filteredData = data
            .sort((a, b) => {
              const aCheck = dataKegiatan?.absensi.find(
                (absensi) => absensi.userId === a.id
              );
              const bCheck = dataKegiatan?.absensi.find(
                (absensi) => absensi.userId === b.id
              );

              if (!aCheck && bCheck) return 1;
              if (aCheck && !bCheck) return -1;
              return 0;
            })
            .sort((a, b) => {
              const aCheck = dataKegiatan?.absensi.find(
                (absensi) => absensi.userId === a.id
              );
              const bCheck = dataKegiatan?.absensi.find(
                (absensi) => absensi.userId === b.id
              );

              if (aCheck && bCheck) {
                return -(
                  new Date(aCheck.createdAt).getTime() -
                  new Date(bCheck.createdAt).getTime()
                );
              }

              return 0;
            });

          const spreadsheet = new ExcelJS.Workbook();

          const sheet = spreadsheet.addWorksheet("Anggota");

          const rows = filteredData.map((row, i) => {
            const dateChecks = isNaN(
              new Date(
                dataKegiatan?.absensi.find(
                  (absensi) => absensi.userId === row.id
                )?.createdAt as Date
              ).getTime()
            );

            const date = new Date(
              dataKegiatan?.absensi.find((absensi) => absensi.userId === row.id)
                ?.createdAt as Date
            ).toLocaleDateString("id-ID");

            const { name, lokasi, statusKeanggotaan } = row;
            return [
              i + 1,
              dateChecks ? "-" : date,
              name,
              lokasi?.name,
              statusKeanggotaan,
              dataKegiatan?.absensi?.find(
                (absensi) => absensi.userId === row.id
              )
                ? "HADIR"
                : "TIDAK HADIR",
            ];
          });

          const table = sheet.addTable({
            name: "Anggota",
            ref: "A7",
            headerRow: true,
            columns: [
              { name: "No", filterButton: true },
              { name: "Waktu", filterButton: true },
              { name: "Nama Anggota", filterButton: true },
              { name: "Titik Lokasi", filterButton: true },
              { name: "Status Keanggotaan", filterButton: true },
              { name: "Kehadiran", filterButton: true },
            ],
            rows: rows,
          });

          sheet.getColumn(1).width = 5;

          const firstRowCell = 7;
          const lastRowCell = firstRowCell + rows.length + 1;

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

            // E
            sheet.getCell(`E${i}`).border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };

            // F
            sheet.getCell(`F${i}`).border = {
              top: { style: "thin" },
              left: { style: "thin" },
              bottom: { style: "thin" },
              right: { style: "thin" },
            };
          }

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

          sheet.getRow(5).font = {
            bold: true,
          };
          sheet.getRow(5).alignment = {
            vertical: "middle",
            horizontal: "left",
          };

          sheet.getCell("A1").value = "ABSENSI SELAPANAN";
          sheet.getCell("A2").value =
            "JAMA&apos;AH PONDOK PETA KABUPATEN KEDIRI";
          sheet.getCell("A4").value = `Lokasi: ${
            dataKegiatan?.lokasi?.name ?? "-"
          }`;
          sheet.getCell("A5").value = `Tanggal: ${
            new Date(dataKegiatan?.waktu ?? "").toLocaleDateString() ?? "-"
          }`;

          sheet.getColumn(2).width = 20;
          sheet.getColumn(3).width = 40;
          sheet.getColumn(4).width = 30;
          sheet.getColumn(5).width = 30;
          sheet.getColumn(6).width = 30;

          sheet.getRow(7).font = {
            bold: true,
          };

          sheet.getRow(7).alignment = {
            vertical: "middle",
            horizontal: "center",
          };

          sheet.getRow(1).height = 20;
          sheet.getRow(2).height = 20;
          sheet.getRow(3).height = 10;
          sheet.getRow(4).height = 20;
          sheet.getRow(5).height = 20;
          sheet.getRow(6).height = 10;

          sheet.mergeCells("A1:F1");
          sheet.mergeCells("A2:F2");
          sheet.mergeCells("A4:C4");
          sheet.mergeCells("A5:C5");

          const headerCells = ["A7", "B7", "C7", "D7", "E7", "F7"];

          headerCells.forEach((val) => {
            sheet.getCell(val).fill = {
              type: "pattern",
              pattern: "solid",
              bgColor: {
                argb: "FF000000",
              },
            };

            sheet.getCell(val).font = {
              color: {
                argb: "FFFFFFFF",
              },
              bold: true,
            };
          });

          table.commit();

          spreadsheet.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const a = document.createElement("a");
            a.href = window.URL.createObjectURL(blob);
            a.download = `export-absensi-${dataKegiatan?.name}.xlsx`;
            a.click();
          });
        }}
      >
        <FileSpreadsheet size={16} />
        <span>Export Exrcel</span>
      </button>
    </div>
  );
}

export default function UsersDataTable({ cuid }: { cuid: string }) {
  const [data, setData] = useAtom(dataUserAtom);
  const [filterName, setFilterName] = useState<string>("");
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const [pending, setPending] = useState<boolean>(true);

  const [selectedRows, setSelectedRows] = useState<User[]>([]);
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

  const [dataKegiatan, setDataKegiatan] = useAtom(dataKegiatanAtom);

  useEffect(() => {
    fetch(`/api/v1/giat?cuid=${cuid}&includeAbsensi&includeLokasi`)
      .then((res) => res.json())
      .then((data) => {
        setDataKegiatan(data);
      });

    fetch("/api/v1/users")
      .then((res) => res.json())
      .then(
        (
          data: (User & {
            lokasi: Lokasi | null;
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
  }, [cuid, setData, setDataKegiatan, filterName, toggleCleared]);

  const headerUpdateCompMemo = useMemo(() => {
    const handleDelete = async () => {
      const selectedRowsId = selectedRows.map((row) => ({
        userId: row.id,
        giatId: dataKegiatan?.id,
      }));

      if (window.confirm("Apakah anda yakin ingin menghapus kehadiran?")) {
        await fetch(`/api/v1/absensi/delete`, {
          method: "POST",
          body: JSON.stringify(selectedRowsId),
        });

        setPending(true);
        setToggleCleared(!toggleCleared);
        window.alert("Berhasil menghapus kehadiran!");
      }
    };

    const handleUpdate = async () => {
      console.log(selectedRows);
      const selectedRowsId = selectedRows.map((row) => ({
        userId: row.id,
        giatId: dataKegiatan?.id,
        status: "HADIR",
      }));

      if (window.confirm("Apakah anda yakin ingin mengubah status?")) {
        const data = selectedRowsId.map((row) => ({
          userId: row.userId as string,
          giatId: row.giatId as string,
          status: row.status as string,
        }));

        const form = new FormData();

        form.append("data", JSON.stringify(data));

        await fetch(`/api/v1/absensi/create`, {
          method: "POST",
          body: form,
        });

        setPending(true);
        setToggleCleared(!toggleCleared);
        window.alert("Berhasil mengubah status!");
      }
    };

    return (
      <div className="flex gap-3 items-center flex-wrap">
        <button
          className="bg-black text-white rounded-xl px-5 text-sm py-2 flex gap-2 items-center"
          onClick={handleUpdate}
        >
          <CheckCheck size={16} />
          <span>Jama&apos;ah Hadir</span>
        </button>
        <button
          className="bg-red-900 hover:bg-red-800 transition text-white rounded-xl px-5 text-sm py-2 flex gap-2 items-center"
          onClick={handleDelete}
        >
          <Trash size={16} />
          <span>Hapus Kehadiran</span>
        </button>
      </div>
    );
  }, [dataKegiatan?.id, selectedRows, toggleCleared]);

  const checkDate = (row: any) =>
    isNaN(
      new Date(
        dataKegiatan?.absensi.find((absensi) => absensi.userId === row.id)
          ?.createdAt as Date
      ).getTime()
    );

  const date = (row: any) =>
    new Date(
      dataKegiatan?.absensi.find((absensi) => absensi.userId === row.id)
        ?.createdAt as Date
    ).toLocaleString("id-ID") as string;

  const columns: TableColumn<
    User & {
      lokasi: Lokasi | null;
    }
  >[] = [
    {
      name: "Waktu".toUpperCase(),
      selector: (row) => (checkDate(row) ? "-" : date(row)),
      sortable: true,
    },
    {
      name: "Nama Anggota".toUpperCase(),
      selector: (row) => row.name as string,
      sortable: true,
    },
    {
      name: "Titik Lokasi".toUpperCase(),
      selector: (row) => row.lokasi?.name as string,
      sortable: true,
    },
    {
      name: "Status Keanggotaan".toUpperCase(),
      selector: (row) => row.statusKeanggotaan as string,
      sortable: true,
    },
    {
      name: "Kehadiran".toUpperCase(),
      selector: (row) =>
        dataKegiatan?.absensi?.find((absensi) => absensi.userId === row.id)
          ? "HADIR"
          : "TIDAK HADIR",
      sortable: true,
    },
  ];

  const handleRowSelected = useCallback((state: any) => {
    setSelectedRows(state.selectedRows);
  }, []);

  return (
    <>
      <div className="flex flex-col w-full pb-5">
        <h2 className="w-full text-lg font-bold">Informasi Kegiatan</h2>
        <div className="max-w-lg w-full px-5 py-2 rounded-xl mt-3 bg-neutral-100">
          <p>
            <span className="font-semibold">Nama Kegiatan:</span>{" "}
            {dataKegiatan?.name ?? "-"}
          </p>
          <p>
            <span className="font-semibold">Tanggal:</span>{" "}
            {new Date(dataKegiatan?.waktu ?? "").toLocaleDateString() ?? "-"}
          </p>
          <p>
            <span className="font-semibold">Titik Lokasi:</span>{" "}
            {dataKegiatan?.lokasi?.name ?? "-"}
          </p>
          <p>
            <span className="font-semibold">Jumlah Kehadiran:</span>{" "}
            {dataKegiatan?.absensi.length ?? "-"}
          </p>
        </div>
        <div className="max-w-lg w-full mt-3 grid grid-cols-1 lg:grid-cols-2 gap-3">
          <Link
            href={`/kegiatan/edit/${cuid}`}
            className="bg-black text-white rounded-xl px-5 text-sm py-2 flex gap-2 items-center justify-center"
          >
            <Pencil size={16} />
            <span>Edit Kegiatan</span>
          </Link>
          <button
            className="bg-red-900 hover:bg-red-800 transition text-white rounded-xl px-5 text-sm py-2 flex gap-2 items-center justify-center"
            onClick={() => {
              if (!dataKegiatan) {
                window.alert(
                  "Terjadi kesalahan saat mengambil data kegiatan. Mungkin data kegiatan kosong?"
                );
                return;
              }

              if (
                window.confirm("Apakah anda yakin ingin menghapus kegiatan?")
              ) {
                const json = JSON.stringify([{ id: dataKegiatan.id }]);

                fetch(`/api/v1/giat/delete`, {
                  method: "POST",
                  body: json,
                  headers: {
                    "Content-Type": "application/json",
                  },
                });

                router.push("/kegiatan");
              }
            }}
          >
            <Trash size={16} />
            <span>Hapus Kegiatan</span>
          </button>
        </div>
      </div>
      <DataTable
        title="Daftar Kehadiran"
        columns={columns}
        data={
          data
            .sort((a, b) => {
              const aCheck = dataKegiatan?.absensi.find(
                (absensi) => absensi.userId === a.id
              );
              const bCheck = dataKegiatan?.absensi.find(
                (absensi) => absensi.userId === b.id
              );

              if (!aCheck && bCheck) return 1;
              if (aCheck && !bCheck) return -1;
              return 0;
            })
            .sort((a, b) => {
              const aCheck = dataKegiatan?.absensi.find(
                (absensi) => absensi.userId === a.id
              );
              const bCheck = dataKegiatan?.absensi.find(
                (absensi) => absensi.userId === b.id
              );

              if (aCheck && bCheck) {
                return -(
                  new Date(aCheck.createdAt).getTime() -
                  new Date(bCheck.createdAt).getTime()
                );
              }

              return 0;
            }) ?? []
        }
        pagination
        paginationPerPage={10}
        paginationResetDefaultPage={resetPaginationToggle}
        subHeader
        subHeaderComponent={subHeaderFilterCompMemo}
        highlightOnHover
        contextActions={headerUpdateCompMemo}
        selectableRows
        responsive
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleCleared}
        progressPending={pending}
        onRowClicked={(row) => {
          router.push(`/anggota/view/${row.id}`);
        }}
      />
    </>
  );
}
