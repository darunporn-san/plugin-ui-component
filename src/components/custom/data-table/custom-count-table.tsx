interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize?: number;
}
export function CustomCountTable({
  currentPage,
  totalPages,
  pageSize = 10,
}: CustomPaginationProps) {
  return (
    <>
      {`${(currentPage - 1) * pageSize + 1}-${Math.min(
        currentPage * pageSize,
        totalPages * pageSize
      )}`}
    </>
  );
}
