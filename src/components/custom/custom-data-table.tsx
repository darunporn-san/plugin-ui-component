import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { CustomPagination } from "./data-table/custom-pagination";
import { CustomCountTable } from "./data-table/custom-count-table";
import { CustomSelect } from "./custom-select";

const countryOptions = [
  { value: "th", label: "Thailand" },
  { value: "us", label: "United States" },
  { value: "uk", label: "United Kingdom" },
  { value: "jp", label: "Japan" },
  { value: "kr", label: "South Korea" },
];

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

type Position = "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  pageSize?: number;
  className?: string;
  headerClassName?: string;
  rowClassName?: string;
  cellClassName?: string;
  onRowClick?: (row: T) => void;
  isPagination?: boolean;
  countPosition?: Position;
  paginationPosition?: Position;
  pageSizePosition?: Position;
  rowKey?: keyof T | ((row: T) => React.Key);
}

export function DataTable<T>({
  columns,
  data,
  pageSize = 10,
  className = "",
  headerClassName = "",
  rowClassName = "",
  cellClassName = "",
  onRowClick,
  isPagination = true,
  countPosition = "bottomLeft",
  paginationPosition = "bottomRight",
  pageSizePosition = "topLeft",
  rowKey = "id" as keyof T,
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const totalPages = Math.ceil(data.length / pageSize);

  const currentData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return data.slice(startIndex, startIndex + pageSize);
  }, [data, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderCell = (row: T, column: Column<T>) => {
    if (typeof column.accessor === "function") {
      return column.accessor(row);
    }
    return String(row[column.accessor as keyof T] ?? "");
  };

  const renderControl = (type: "count" | "pagination" | "pageSize") => {
    const Component =
      type === "count" ? (
        <CustomCountTable
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
        />
      ) : type === "pagination" ? (
        <CustomPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      ) : (
        <CustomSelect options={countryOptions} />
      );
    return <div className="flex-1">{Component}</div>;
  };

  const renderControls = (position: Position) => {
    const showCount = isPagination && countPosition === position;
    const showPagination = isPagination && paginationPosition === position;
    const showPageSize = isPagination && pageSizePosition === position;

    if (!showCount && !showPagination && !showPageSize) return null;

    return (
      <div
        className={`flex-1 ${position.includes("Right") ? "flex justify-end" : "flex justify-start"}`}
      >
        <div className="flex items-center gap-2">
          {showCount && renderControl("count")}
          {showPagination && renderControl("pagination")}
          {showPageSize && renderControl("pageSize")}
        </div>
      </div>
    );
  };

  const hasTopControls =
    isPagination &&
    (countPosition.startsWith("top") || paginationPosition.startsWith("top") || pageSizePosition.startsWith("top"));

  const hasBottomControls =
    isPagination &&
    (countPosition.startsWith("bottom") ||
      paginationPosition.startsWith("bottom") ||
      pageSizePosition.startsWith("bottom"));


  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex w-full items-center justify-between mb-4">
        {hasTopControls && (
          <div className="flex">
            {renderControls("topLeft")}
            {renderControls("topRight")}
          </div>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader className={headerClassName}>
            <TableRow>
              {columns.map((column, index) => (
                <TableHead key={index} className={column.className}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((row, rowIndex) => {
                const key: React.Key =
                  typeof rowKey === "function"
                    ? rowKey(row)
                    : ((row[rowKey] as React.Key) ?? rowIndex);

                return (
                  <TableRow
                    key={key}
                    className={`${rowClassName} ${
                      onRowClick ? "cursor-pointer hover:bg-muted/50" : ""
                    }`}
                    onClick={() => onRowClick?.(row)}
                  >
                    {columns.map((column, colIndex) => (
                      <TableCell
                        key={`${key}-${colIndex}`}
                        className={cellClassName}
                      >
                        {renderCell(row, column)}
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {hasBottomControls && (
        <div className="flex w-full">
          {renderControls("bottomLeft")}
          {renderControls("bottomRight")}
        </div>
      )}
    </div>
  );
}

export default DataTable;
