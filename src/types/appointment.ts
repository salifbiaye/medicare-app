export interface Appointment {
  id: string
  patientId: string
  doctorId: string
  date: Date
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
  createdAt: Date
  updatedAt: Date
  patient: {
    user: {
      name: string
      id: string
      email: string
      birthDate: Date | null
      profileCompleted: boolean
      phone: string | null
      address: string | null
      gender: 'male' | 'female' | 'other'
      role: 'patient' | 'doctor' | 'nurse' | 'admin'
      emailVerified: boolean
      image: string | null
    }
  }
}
