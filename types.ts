export interface Patient {
  id: number;
  name: string;
  dob: string; // Date of Birth
  gender: 'Male' | 'Female' | 'Other';
  contact: string;
  address: string;
  medicalHistory: string;
}
