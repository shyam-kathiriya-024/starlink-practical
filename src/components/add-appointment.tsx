"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppointments, type Appointment } from "@/contexts/AppointmentContext";
import { v4 as uuid } from 'uuid';
import { departmentOptions, doctorOptions, statusLable, statusOptions, typeLable, typeOptions } from "@/constants";

interface AddAppointmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function AddAppointmentModal({ open, onOpenChange }: AddAppointmentModalProps) {
  const { dispatch } = useAppointments()
  const [formData, setFormData] = useState({
    date: "",
    appointmentId: "",
    patientName: "",
    appointmentType: "",
    department: "",
    doctorName: "",
    status: "pending",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newAppointment: Appointment = {
      id: uuid(),
      date: formData.date,
      appointmentId: formData.appointmentId,
      patientName: formData.patientName,
      appointmentType: formData.appointmentType as Appointment["appointmentType"],
      department: formData.department,
      doctorName: formData.doctorName,
      status: formData.status as Appointment["status"],
    }

    console.log(newAppointment,'newAppointment')

    dispatch({ type: "ADD_APPOINTMENT", payload: newAppointment })
    onOpenChange(false)
    setFormData({
      date: "",
      appointmentId: "",
      patientName: "",
      appointmentType: "",
      department: "",
      doctorName: "",
      status: "pending",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Appointment</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="date">Date & Time</Label>
            <Input
              id="date"
              type="datetime-local"
              className="w-full"
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="appointmentId">Appointment ID</Label>
            <Input
              id="appointmentId"
              value={formData.appointmentId}
              onChange={(e) => handleInputChange("appointmentId", e.target.value)}
              placeholder="e.g., 24A-12345"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="patientName">Patient Name</Label>
            <Input
              id="patientName"
              value={formData.patientName}
              onChange={(e) => handleInputChange("patientName", e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="appointmentType">Appointment Type</Label>
              <Select
                value={formData.appointmentType}
                onValueChange={(value) => handleInputChange("appointmentType", value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                {typeOptions.map((option: string) => <SelectItem value={option}>{typeLable[option]}</SelectItem>)}
                </SelectContent>
              </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="department">Department</Label>
            <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departmentOptions.map(option => <SelectItem value={option}>{option}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="doctorName">Doctor Name</Label>
            <Select value={formData.doctorName} onValueChange={(value) => handleInputChange("doctorName", value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select doctor" />
              </SelectTrigger>
              <SelectContent>
                {doctorOptions.map(option => <SelectItem value={option}>{option}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => <SelectItem value={option}>{statusLable[option]}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Appointment</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
