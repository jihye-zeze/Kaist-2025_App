import type { Patient, Treatment, Staff, Appointment, PatientVisit, TreatmentOutcome } from "@shared/schema";
import { subDays, addDays, format, setHours, setMinutes } from "date-fns";

export const mockPatients: Patient[] = [
  { id: 1, name: "김민지", nationality: "KR", status: "waiting", preferredLanguage: "ko" },
  { id: 2, name: "John Smith", nationality: "US", status: "in_progress", preferredLanguage: "en" },
  { id: 3, name: "王小明", nationality: "CN", status: "completed", preferredLanguage: "zh" },
  { id: 4, name: "田中太郎", nationality: "JP", status: "waiting", preferredLanguage: "ja" },
  { id: 5, name: "이지은", nationality: "KR", status: "completed", preferredLanguage: "ko" },
  { id: 6, name: "Sarah Johnson", nationality: "US", status: "waiting", preferredLanguage: "en" },
  { id: 7, name: "李静", nationality: "CN", status: "in_progress", preferredLanguage: "zh" },
  { id: 8, name: "佐藤花子", nationality: "JP", status: "completed", preferredLanguage: "ja" },
  { id: 9, name: "박서준", nationality: "KR", status: "waiting", preferredLanguage: "ko" },
  { id: 10, name: "Michael Brown", nationality: "US", status: "completed", preferredLanguage: "en" },
  { id: 11, name: "张伟", nationality: "CN", status: "in_progress", preferredLanguage: "zh" },
  { id: 12, name: "山田隆", nationality: "JP", status: "waiting", preferredLanguage: "ja" },
  { id: 13, name: "최지원", nationality: "KR", status: "completed", preferredLanguage: "ko" },
];

// Generate random time between 09:00 and 18:00
function generateRandomTime(date: Date): Date {
  const hour = Math.floor(Math.random() * 9) + 9; // 9 AM to 17 PM
  const minute = Math.floor(Math.random() * 12) * 5; // Every 5 minutes
  return setMinutes(setHours(date, hour), minute);
}

// Generate 30 days of mock reservations
export const generateMockReservations = (baseDate: Date = new Date()) => {
  const treatments = ["침술", "부항", "한약처방", "추나요법", "뜸"];
  const statuses = ["reserved", "cancelled", "no_show"] as const;
  const paymentStatuses = ["paid", "unpaid"] as const;
  const currencies = ["KRW", "USD", "CNY", "JPY"] as const;

  const reservations = [];
  let reservationCounter = 1;

  // Generate reservations for the past 15 days and future 15 days
  for (let i = -15; i <= 15; i++) {
    const date = addDays(baseDate, i);
    const numReservations = Math.floor(Math.random() * 5) + 1; // 1-5 reservations per day

    for (let j = 0; j < numReservations; j++) {
      const patient = mockPatients[Math.floor(Math.random() * mockPatients.length)];
      const appointmentTime = generateRandomTime(date);
      const reservationNumber = `R${format(date, 'yyMMdd')}${String(reservationCounter++).padStart(3, '0')}`;

      reservations.push({
        id: reservations.length + 1,
        reservationNumber,
        patientId: patient.id,
        patient,
        treatmentCategory: treatments[Math.floor(Math.random() * treatments.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        insuranceApplied: Math.random() > 0.5,
        paymentStatus: paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)],
        createdAt: appointmentTime.toISOString(),
        currency: currencies[Math.floor(Math.random() * currencies.length)],
        amount: Math.floor(Math.random() * 500000) + 100000,
        note: null,
      });
    }
  }

  return reservations;
};

export const mockTreatments: Treatment[] = [
  { id: 1, patientId: 1, type: "다이어트", status: "completed", cost: "550000" },
  { id: 2, patientId: 2, type: "다이어트", status: "completed", cost: "550000" },
  { id: 3, patientId: 3, type: "다이어트", status: "completed", cost: "550000" },
  { id: 4, patientId: 4, type: "다이어트", status: "completed", cost: "550000" },
  { id: 5, patientId: 5, type: "다이어트", status: "completed", cost: "550000" },
  { id: 6, patientId: 6, type: "여드름", status: "in_progress", cost: "450000" },
  { id: 7, patientId: 7, type: "여드름", status: "in_progress", cost: "450000" },
  { id: 8, patientId: 8, type: "여드름", status: "in_progress", cost: "450000" },
  { id: 9, patientId: 9, type: "리프팅", status: "scheduled", cost: "750000" },
  { id: 10, patientId: 10, type: "리프팅", status: "scheduled", cost: "750000" },
];

export const mockStaff: Staff[] = [
  { id: 1, name: "이상현 원장", role: "doctor", languages: ["ko", "en"], isAvailable: true },
  { id: 2, name: "박지은", role: "interpreter", languages: ["ko", "zh", "en"], isAvailable: true },
  { id: 3, name: "김재원 원장", role: "doctor", languages: ["ko", "ja"], isAvailable: false },
];

export const mockAppointments: Appointment[] = [
  { id: 1, patientId: 1, doctorId: 1, date: new Date(), status: "scheduled" },
  { id: 2, patientId: 2, doctorId: 1, date: new Date(), status: "cancelled" },
  { id: 3, patientId: 3, doctorId: 3, date: new Date(), status: "completed" },
];

export const mockPatientVisits: PatientVisit[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  patientId: Math.floor(Math.random() * 13) + 1,
  visitDate: subDays(new Date(), Math.floor(Math.random() * 7)),
  visitType: ["initial", "follow_up", "emergency"][Math.floor(Math.random() * 3)],
  duration: Math.floor(Math.random() * 30) + 30,
}));

export const mockTreatmentOutcomes: TreatmentOutcome[] = mockTreatments.map((treatment, i) => ({
  id: i + 1,
  treatmentId: treatment.id,
  effectivenessScore: Math.floor(Math.random() * 5) + 1,
  followupNeeded: Math.random() > 0.5,
  notes: "치료 후 상태 양호",
  recordedAt: new Date(),
}));