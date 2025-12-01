import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationFirst,
  PaginationLast,
} from "@/components/ui/pagination";

interface CustomPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize?: number;

  onPageChange: (page: number) => void;
}

export function CustomPagination({
  currentPage,
  totalPages,
  pageSize = 10,
  onPageChange,
}: CustomPaginationProps) {

  const getPageNumbers = (currentPage: number, totalPages: number): Array<number | string> => {
    // If 4 or fewer pages, show all pages
    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = new Set<number>();
    
    // Always add first page
    pages.add(1);

    // Add pages around current page
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.add(i);
    }

    // Add last page
    if (totalPages > 1) {
      pages.add(totalPages);
    }

    // Convert to array and sort
    const result = Array.from(pages).sort((a: number, b: number) => a - b);
    
    // Add ellipsis where needed
    const finalPages: Array<number | string> = [];
    
    for (let i = 0; i < result.length; i++) {
      const current = result[i];
      const next = result[i + 1];
      
      finalPages.push(current);
      
      if (next && next > current + 1) {
        if (next === totalPages && current < totalPages - 2) {
          finalPages.push("ellipsis-right");
        } else if (current === 1 && next > 2) {
          finalPages.push("ellipsis-left");
        } else if (next > current + 2) {
          finalPages.push("ellipsis");
        }
      }
    }

    return finalPages;
  };
  const pagesToShow = getPageNumbers(currentPage, totalPages);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationFirst
            onClick={() => onPageChange(1)}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(currentPage - 1)}
            className={
              currentPage === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {/* {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={page === currentPage}
              onClick={() => onPageChange(page)}
              className={`cursor-pointer rounded-full ${page === currentPage ? 'bg-primary text-white hover:bg-primary hover:text-white' : 'bg-transparent text-black'}`}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))} */}
      {pagesToShow.map((p, index) => {
  if (p === "ellipsis-left" || p === "ellipsis-right") {
    return (
      <PaginationItem key={`${p}-${index}`}>
        <span className="px-2">...</span>
      </PaginationItem>
    );
  }

  return (
    <PaginationItem key={`page-${p}`}>
      <PaginationLink
        isActive={p === currentPage}
        onClick={() => typeof p === 'number' && onPageChange(p)}
        className={`cursor-pointer rounded-full ${
          p === currentPage
            ? "bg-primary text-white hover:bg-primary hover:text-white"
            : "bg-transparent text-black"
        }`}
      >
        {p}
      </PaginationLink>
    </PaginationItem>
  );
})}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(currentPage + 1)}
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLast
            onClick={() => onPageChange(totalPages)}
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
