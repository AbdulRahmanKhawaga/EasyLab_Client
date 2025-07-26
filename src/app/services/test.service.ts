// src/app/services/test.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TestOrder, TestResult } from '../models/test.model';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private mockTests: TestOrder[] = [];

  constructor() {
    this.loadFromLocalStorage();

    if (this.mockTests.length === 0) {
      this.mockTests = [
        {
          id: this.generateId(),
          patientId: 1,
          invoiceNumber: 'INV-001',
          status: 'pending',
          tests: [{ name: 'CBC' }]
        },
        {
          id: this.generateId(),
          patientId: 2,
          invoiceNumber: 'INV-002',
          status: 'pending',
          tests: [{ name: 'CBC' }]
        }
      ];
      this.saveToLocalStorage();
    }
  }

  getTests(): Observable<TestOrder[]> {
    return of(this.mockTests);
  }

  updateTest(id: string, updates: Partial<TestOrder>): Observable<TestOrder> {
    const index = this.mockTests.findIndex(test => test.id === id);
    if (index !== -1) {
      this.mockTests[index] = { ...this.mockTests[index], ...updates };
      this.saveToLocalStorage();
    }
    return of(this.mockTests[index]);
  }

  updateTestResults(id: string, results: TestResult): Observable<TestOrder> {
    const index = this.mockTests.findIndex(test => test.id === id);
    if (index !== -1) {
      this.mockTests[index].results = results;
      this.saveToLocalStorage();
    }
    return of(this.mockTests[index]);
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  private saveToLocalStorage() {
    localStorage.setItem('mockTests', JSON.stringify(this.mockTests));
  }

  private loadFromLocalStorage() {
    const data = localStorage.getItem('mockTests');
    if (data) {
      this.mockTests = JSON.parse(data);
    }
  }
  createTest(order: TestOrder): Observable<TestOrder> {
    this.mockTests.push(order);
    this.saveToLocalStorage();
    return of(order);
  }
  getTestsByPatientId(patientId: number): Observable<TestOrder[]> {
    const filteredTests = this.mockTests.filter(test => test.patientId === patientId);
    return of(filteredTests);
  }
}
