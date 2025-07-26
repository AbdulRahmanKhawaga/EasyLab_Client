import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Patient } from '../models/patient.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private apiUrl = `${environment.apiUrl}/api/patients`;

  constructor(private http: HttpClient) {}

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl);
  }

  getPatient(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  addPatient(patient: Partial<Patient>): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient);
  }

  // updatePatient(id: number, patient: Partial<Patient>): Observable<Patient> {
  //   return this.http.put<Patient>(`${this.apiUrl}/${id}`, patient);
  // }
  updatePatient(id: number, patient: Partial<Patient>): Observable<Patient> {
    return this.http.patch<Patient>(`${this.apiUrl}/${id}`, patient);  // ✅
  }
  
  deletePatient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
