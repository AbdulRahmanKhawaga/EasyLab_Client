import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CBCInput {
  hgb: number;
  mcv: number;
  mchc: number;
  wbc: number;
  rbc: number;
  platelets: number;
  hct: number;
  mch: number;
}

export interface DiagnosisResult {
  diagnosis: string;
  confidence: number;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DiagnosisService {
  private apiUrl = 'http://127.0.0.1:8000/api/diagnose';

  constructor(private http: HttpClient) { }

  getDiagnosis(data: CBCInput): Observable<DiagnosisResult> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<DiagnosisResult>(this.apiUrl, data, { headers });
  }
}
