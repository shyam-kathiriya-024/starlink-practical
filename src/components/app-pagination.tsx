import { useAppointments } from "@/contexts/AppointmentContext";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, } from "./ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "./ui/select";

interface AppPaginationProps {
  total: number
}

const AppPagination = ({ total }: AppPaginationProps) => {
  const { state, dispatch } = useAppointments();

  const totalPages = Math.ceil(total / state.pagination.limit)

  const handlePageClick = (p: number) => {
    if (p !== state.pagination.page) {
      dispatch({ type: 'SET_PAGINATION', payload: { ...state.pagination, page: p } })
    }
  }

  const onLimitChange = (limit: number) => {
    dispatch({ type: 'SET_PAGINATION', payload: { ...state.pagination, limit } })
  }

  return (
    <div className="flex justify-between p-2 border-t items-center">
      {/* Items Per Page Selector */}
      <div className="flex gap-3 items-center">
        <p>Items</p>
        <Select
          value={state.pagination.limit.toString()}
          onValueChange={(value) => onLimitChange(Number(value))}
        >
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Page Navigation */}
      <div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (state.pagination.page > 1)
                    handlePageClick(state.pagination.page - 1)
                }}
              />
            </PaginationItem>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  isActive={pageNumber === state.pagination.page}
                  onClick={(e) => {
                    e.preventDefault()
                    handlePageClick(pageNumber)
                  }}
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault()
                  if (state.pagination.page < totalPages)
                    handlePageClick(state.pagination.page + 1)
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default AppPagination
