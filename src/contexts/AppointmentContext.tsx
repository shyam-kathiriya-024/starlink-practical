import React, { createContext, ReactNode, useContext, useReducer } from 'react';

import { appointments } from '@/data/appointments';

export interface Appointment {
  id: string;
  date: string;
  appointmentId: string;
  patientName: string;
  appointmentType: "emergency" | "home_visit" | "check_up";
  department: string;
  doctorName: string;
  status: "pending" | "confirmed" | "cancelled";
}

export interface AppointmentState {
  appointments: Appointment[]
  searchTerm: string
  sortField: keyof Appointment | null
  sortDirection: "asc" | "desc"
  filters: {
    status?: string[]
    department?: string[]
    doctor?: string[]
    appointmentType?: string[]
    dateRange?: { from: string; to: string }
  },
  pagination: {
    page: number;
    limit: number;
  }
}

type AppointmentAction =
  | { type: "ADD_APPOINTMENT"; payload: Appointment }
  | { type: "UPDATE_APPOINTMENT"; payload: Appointment }
  | { type: "DELETE_APPOINTMENT"; payload: string }
  | { type: "SET_SEARCH_TERM"; payload: string }
  | { type: "SET_SORT"; payload: { field: keyof Appointment; direction: "asc" | "desc" } }
  | { type: "SET_FILTERS"; payload: AppointmentState["filters"] }
  | { type: "SET_PAGINATION"; payload: AppointmentState["pagination"] }
  | { type: "CLEAR_FILTERS" }


const AppointmentContext = createContext<{
  state: AppointmentState
  dispatch: React.Dispatch<AppointmentAction>
} | null>(null)

const initialState: AppointmentState = {
  appointments: appointments,
  searchTerm: "",
  sortField: null,
  sortDirection: "asc",
  filters: {},
  pagination: {
    page: 1,
    limit: 10
  }
}

function appointmentReducer(state: AppointmentState, action: AppointmentAction): AppointmentState {
  switch (action.type) {
    case "ADD_APPOINTMENT":
      return {
        ...state,
        appointments: [...state.appointments, action.payload],
      }
    case "UPDATE_APPOINTMENT":
      return {
        ...state,
        appointments: state.appointments.map((apt) => (apt.id === action.payload.id ? action.payload : apt)),
      }
    case "DELETE_APPOINTMENT":
      return {
        ...state,
        appointments: state.appointments.filter((apt) => apt.id !== action.payload),
      }
    case "SET_SEARCH_TERM":
      return {
        ...state,
        searchTerm: action.payload,
      }
    case "SET_SORT":
      return {
        ...state,
        sortField: action.payload.field,
        sortDirection: action.payload.direction,
      }
    case "SET_FILTERS":
      return {
        ...state,
        filters: action.payload,
      }
    case "SET_PAGINATION":
      return {
        ...state,
        pagination: action.payload,
      }
    case "CLEAR_FILTERS":
      return {
        ...state,
        filters: {},
      }
    default:
      return state
  }
}

export function AppointmentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appointmentReducer, initialState)
  
  return <AppointmentContext.Provider value={{ state, dispatch }}>{children}</AppointmentContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppointments() {
  const context = useContext(AppointmentContext)
  if (!context) {
    throw new Error("useAppointments must be used within an AppointmentProvider")
  }
  return context
}
