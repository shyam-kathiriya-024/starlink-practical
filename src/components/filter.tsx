/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAppointments } from "@/contexts/AppointmentContext";
import { departmentOptions, doctorOptions, statusLable, statusOptions, typeLable, typeOptions } from "@/constants";

interface FilterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function FilterModal({ open, onOpenChange }: FilterModalProps) {
  const { state, dispatch } = useAppointments()
  const [localFilters, setLocalFilters] = useState(state.filters)

  const handleFilterChange = (filterType: string, value: string, checked: boolean) => {
    setLocalFilters((prev) => ({
      ...prev,
      [filterType]: checked
        ? [...((prev[filterType as keyof typeof prev] as string[]) || []), value]
        : ((prev[filterType as keyof typeof prev] as string[]) || []).filter((item) => item !== value),
    }));
  }

  const handleDateRangeChange = (field: "from" | "to", value: string) => {
    setLocalFilters((prev: any) => ({
      ...prev,
      dateRange: {
        ...prev.dateRange,
        [field]: value,
      },
    }));
  }

  const applyFilters = () => {
    dispatch({ type: "SET_FILTERS", payload: localFilters });
    onOpenChange(false);
  }

  const clearFilters = () => {
    setLocalFilters({});
    dispatch({ type: "CLEAR_FILTERS" });
    onOpenChange(false);
  }

  const FilterSection = ({ title, options, filterKey, labels }: { title: string; options: string[]; filterKey: string, labels?: Record<string, string> }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{title}</Label>
      <div className="space-y-2 max-h-36 overflow-y-auto">
        {options.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <Checkbox
              id={`${filterKey}-${option}`}
              checked={((localFilters[filterKey as keyof typeof localFilters] as string[]) || []).includes(option)}
              onCheckedChange={(checked) => handleFilterChange(filterKey, option, checked as boolean)}
            />
            <Label htmlFor={`${filterKey}-${option}`} className="text-sm">
              {labels ? labels[option] : option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl ">
        <DialogHeader>
          <DialogTitle>Filter Appointments</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Date Range</Label>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">From</Label>
                <Input
                  type="datetime-local"
                  value={localFilters.dateRange?.from || ""}
                  onChange={(e) => handleDateRangeChange("from", e.target.value)}
                />
                <Label className="text-xs text-gray-500">To</Label>
                <Input
                  type="datetime-local"
                  value={localFilters.dateRange?.to || ""}
                  onChange={(e) => handleDateRangeChange("to", e.target.value)}
                />
              </div>
            </div>

            <FilterSection title="Status" options={statusOptions} filterKey="status" labels={statusLable} />
            <FilterSection title="Department" options={departmentOptions} filterKey="department" />
          </div>

          <div className="space-y-6">
            <FilterSection title="Doctor" options={doctorOptions} filterKey="doctor" />
            <FilterSection title="Appointment Type" options={typeOptions} filterKey="appointmentType" labels={typeLable} />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={clearFilters}>
            Clear All
          </Button>
          <Button onClick={applyFilters}>Apply Filters</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
