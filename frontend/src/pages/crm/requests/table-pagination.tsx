import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { generatePagination } from '@/lib/utils';
import { setPage } from '@/slices/requests-slice';
import { useAppDispatch, useAppSelector } from '@/store';

export function TablePagination({ totalPages }: { totalPages: number }) {
  const dispatch = useAppDispatch();
  const page = useAppSelector((state) => state.requests.page);
  const pagesArray = generatePagination(page, totalPages);

  return (
    <ScrollArea className="mx-auto w-full whitespace-nowrap">
      <Pagination className="py-2">
        <PaginationContent>
          <PaginationItem className="cursor-pointer">
            <PaginationPrevious
              onClick={(e) => {
                e.preventDefault();
                page > 1 && dispatch(setPage(page - 1));
              }}
            />
          </PaginationItem>
          {pagesArray.map((val, i) => {
            if (val === '...') {
              return (
                <PaginationItem key={i}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return (
              <PaginationItem key={i} className="cursor-pointer">
                <PaginationLink
                  onClick={() => {
                    console.log('Page');
                    dispatch(setPage(Number(val)));
                  }}
                  isActive={page === val}
                >
                  {val}
                </PaginationLink>
              </PaginationItem>
            );
          })}
          <PaginationItem className="cursor-pointer">
            <PaginationNext
              onClick={() => {
                page < totalPages && dispatch(setPage(page + 1));
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
