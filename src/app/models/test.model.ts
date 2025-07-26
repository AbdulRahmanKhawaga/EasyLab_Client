// src/app/models/test.model.ts

export interface Test {
  name: string;
  price?: number;
}

export interface CBCData {
  hgb: number;  // Hemoglobin
  mcv: number;  // Mean Corpuscular Volume
  mchc: number; // Mean Corpuscular Hemoglobin Concentration
  wbc: number;  // White Blood Cell count
  rbc: number;  // Red Blood Cell count
  platelets: number;
  hct: number;  // Hematocrit
  mch: number;  // Mean Corpuscular Hemoglobin
}

export interface TestResult {
  completedAt: string;
  completedBy: string;
  cbcData?: CBCData;
  diagnosis?: string;
  diagnosisConfidence?: number;
}

export interface TestOrder {
  id: string;
  patientId: number;
  invoiceNumber: string;
  status: 'pending' | 'in-progress' | 'completed';
  tests: Test[];
  orderedAt?: string;
  orderedBy?: string;
  results?: TestResult;
}
