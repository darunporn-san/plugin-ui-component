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

const pageSizeOptions = [
  { value: "5", label: "5 / page" },
  { value: "10", label: "10 / page" },
  { value: "20", label: "20 / page" },
  { value: "50", label: "50 / page" },
  { value: "100", label: "100 / page" },
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
  children?: React.ReactNode;
  customContent?: {
    [key in Position]?: React.ReactNode;
  };
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
  children,
  customContent = {},
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [selectedPageSize, setSelectedPageSize] = React.useState(pageSize);
  const totalPages = Math.ceil(data.length / selectedPageSize);

  const currentData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * selectedPageSize;
    return data.slice(startIndex, startIndex + selectedPageSize);
  }, [data, currentPage, selectedPageSize]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value, 10);
    setSelectedPageSize(newPageSize);
    // Reset to first page when page size changes
    setCurrentPage(1);
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
          pageSize={selectedPageSize}
          totalItems={data.length}
        />
      ) : type === "pagination" ? (
        <CustomPagination
          currentPage={currentPage}
          pageSize={selectedPageSize}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      ) : (
        <CustomSelect 
          options={pageSizeOptions}
          value={selectedPageSize.toString()}
          onValueChange={handlePageSizeChange}
          className="w-[120px]"
          isClearable={false}
        />
      );
    return <div className="flex-1">{Component}</div>;
  };

  const renderControls = (position: Position) => {
    const showCount = isPagination && countPosition === position;
    const showPagination = isPagination && paginationPosition === position;
    const showPageSize = isPagination && pageSizePosition === position;
    const hasCustomContent = customContent && customContent[position];

    if (!showCount && !showPagination && !showPageSize && !hasCustomContent) return null;

    return (
      <div
        className={`flex-1 ${position.includes("Right") ? "flex justify-end" : "flex justify-start"}`}
      >
        <div className="flex items-center gap-2">
          {hasCustomContent ? (
            customContent[position]
          ) : (
            <>
              {showCount && renderControl("count")}
              {showPagination && renderControl("pagination")}
              {showPageSize && renderControl("pageSize")}
            </>
          )}
        </div>
      </div>
    );
  };

  const hasTopControls =
    isPagination &&
    (countPosition.startsWith("top") || 
     paginationPosition.startsWith("top") || 
     pageSizePosition.startsWith("top") ||
     (customContent && (customContent.topLeft || customContent.topRight)));

  const hasBottomControls =
    isPagination &&
    (countPosition.startsWith("bottom") ||
     paginationPosition.startsWith("bottom") ||
     pageSizePosition.startsWith("bottom") ||
     (customContent && (customContent.bottomLeft || customContent.bottomRight)));


  return (
    <div className={`flex flex-col ${className}`}>
      {children}
      <div className="flex w-full items-center justify-between mb-4">
        {hasTopControls && (
          <div className="flex w-full">
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
        <div className="flex w-full ">
          {renderControls("bottomLeft")}
          {renderControls("bottomRight")}
        </div>
      )}
    </div>
  );
}

export default DataTable;
