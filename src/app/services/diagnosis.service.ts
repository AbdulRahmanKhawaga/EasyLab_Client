import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
  private apiUrl = `${environment.mlApiUrl}/api/diagnose`;

  constructor(private http: HttpClient) { }

  getDiagnosis(data: CBCInput): Observable<DiagnosisResult> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<DiagnosisResult>(this.apiUrl, data, { headers });
  }
}
