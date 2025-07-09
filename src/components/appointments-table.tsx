import { ArrowUpDown, Trash2Icon } from "lucide-react";
import { Button } from "./ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Appointment, useAppointments } from "@/contexts/AppointmentContext";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { format, isWithinInterval, parseISO, startOfDay } from "date-fns";
import { Badge } from "./ui/badge";
import { useMemo } from "react";
import AppPagination from "./app-pagination";
import { statusLable, typeLable } from "@/constants";

const AppointmentsTable = () => {

  const { state, dispatch } = useAppointments();

  const handleSort = (field: keyof Appointment) => {
    const direction = state.sortField === field && state.sortDirection === "asc" ? "desc" : "asc";
    dispatch({ type: "SET_SORT", payload: { field, direction } });
  }

  const filteredAndSortedAppointments = useMemo(() => {
    let filtered = [...state.appointments];

    if (state.searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.patientName.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
          apt.appointmentType.toLowerCase().includes(state.searchTerm.toLowerCase()),
      );
    }

    if (state.filters.status?.length) {
      filtered = filtered.filter((apt) => state.filters.status!.includes(apt.status));
    }
    if (state.filters.department?.length) {
      filtered = filtered.filter((apt) => state.filters.department!.includes(apt.department));
    }
    if (state.filters.doctor?.length) {
      filtered = filtered.filter((apt) => state.filters.doctor!.includes(apt.doctorName));
    }
    if (state.filters.appointmentType?.length) {
      filtered = filtered.filter((apt) => state.filters.appointmentType!.includes(apt.appointmentType));
    }
    if (state.filters.dateRange?.from && state.filters.dateRange?.to) {
      filtered = filtered.filter((apt) => {
        const aptDate = startOfDay(parseISO(apt.date));
        const start = startOfDay(parseISO(state.filters.dateRange!.from));
        const end = startOfDay(parseISO(state.filters.dateRange!.to));
        return isWithinInterval(aptDate, { start, end });
      });
    }

    if (state.sortField) {
      filtered.sort((a, b) => {
        const aValue = a[state.sortField!];
        const bValue = b[state.sortField!];

        if (aValue < bValue) return state.sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return state.sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }

    return filtered
  }, [state.appointments, state.searchTerm, state.filters, state.sortField, state.sortDirection])

  const paginatedData: Appointment[] = useMemo(() => {
    const page = state.pagination.page;
    const limit = state.pagination.limit;
    const start = (page - 1) * limit;
    const end = start + limit;
    return filteredAndSortedAppointments.slice(start, end);
  }, [filteredAndSortedAppointments, state.pagination.page, state.pagination.limit])


  const getStatusColor = (status: string) => {
    switch (status) {
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "done":
        return "bg-blue-100 text-blue-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "emergency":
        return "bg-red-100 text-red-800"
      case "home_visit":
        return "bg-blue-100 text-blue-800"
      case "check_up":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return <div className="border rounded-lg">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort("date")} className="h-auto p-0 cursor-pointer font-medium">
              Date <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort("appointmentId")} className="h-auto p-0 cursor-pointer font-medium">
              Token ID <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort("patientName")} className="h-auto p-0 cursor-pointer font-medium">
              Patient <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort("appointmentType")} className="h-auto p-0 cursor-pointer font-medium">
              Type <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort("department")} className="h-auto p-0 cursor-pointer font-medium">
              Department <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort("doctorName")} className="h-auto p-0 cursor-pointer font-medium">
              Doctor <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead>
            <Button variant="ghost" onClick={() => handleSort("status")} className="h-auto p-0 cursor-pointer font-medium">
              Status <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </TableHead>
          <TableHead className="w-[50px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginatedData.map((appointment) => (
          <TableRow key={appointment.id}>
            <TableCell>{format(new Date(appointment.date), "dd MMM yyyy")}</TableCell>
            <TableCell className="font-mono text-sm">{appointment.appointmentId}</TableCell>
            <TableCell>
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {appointment.patientName.split(" ").map((n) => n[0]).splice(0, 2).join("")}
                  </AvatarFallback>
                </Avatar>
                <span>{appointment.patientName}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className={getTypeColor(appointment.appointmentType)}>
                {typeLable[appointment.appointmentType]}
              </Badge>
            </TableCell>
            <TableCell>{appointment.department}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">
                    {appointment.doctorName.split(" ").map((n) => n[0]).splice(1, 2).join("")}
                  </AvatarFallback>
                </Avatar>
                <span>{appointment.doctorName}</span>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary" className={getStatusColor(appointment.status)}>
                {statusLable[appointment.status]}
              </Badge>
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" className="cursor-pointer" onClick={() => { dispatch({ type: 'DELETE_APPOINTMENT', payload: appointment.id }) }}>
                <Trash2Icon className="h-4 w-4 text-red-600" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>

    {paginatedData.length == 0 && <div className="text-center py-8 text-gray-500">No appointments found.</div>}

    <AppPagination total={filteredAndSortedAppointments.length} />
  </div>
}

export default AppointmentsTable;