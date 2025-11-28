interface CustomCountTableProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
}

export function CustomCountTable({
  currentPage,
  totalPages,
  pageSize = 10,
  totalItems,
}: CustomCountTableProps) {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  
  return (
    <div className="text-sm text-muted-foreground">
      {totalItems === 0 ? (
        '0 items'
      ) : (
        `${startItem}-${endItem} of ${totalItems} ${totalItems === 1 ? 'item' : 'items'}`
      )}
    </div>
  );
}
