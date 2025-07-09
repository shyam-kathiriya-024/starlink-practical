export const statusOptions = ['pending', 'confirmed', 'cancelled'];

export const departmentOptions = [
  'Pediatrics',
  'Emergency',
  'General Medicine',
  'Cardiology',
  'Orthopedics',
  'Dermatology',
  'Neurology',
  'Ophthalmology'
]

export const doctorOptions = [
  'Dr. Emily White',
  'Dr. Alex Green',
  'Dr. Sarah Davis',
  'Dr. Michael Lee',
  'Dr. Robert King',
  'Dr. Linda Chen',
  'Dr. Sophia Rodriguez',
  'Dr. David Kim'
]

export const typeOptions = ['emergency', 'home_visit', 'check_up'];

export const typeLable: Record<string, string> = {
  emergency: 'Emergency',
  home_visit: 'Home Visit',
  check_up: 'Check Up'
} 

export const statusLable: Record<string, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled'
}