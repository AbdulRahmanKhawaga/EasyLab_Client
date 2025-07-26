import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestService } from '../../services/test.service';
import { PatientService } from '../../services/patient.service';
import { TestOrder } from '../../models/test.model';
import { Patient } from '../../models/patient.model';
import { SidebarComponent } from '../dashboard/components/sidebar/sidebar.component';
import { NavbarComponent } from '../dashboard/components/navbar/navbar.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule,ReactiveFormsModule, SidebarComponent, NavbarComponent],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  isSidebarOpen = true;
  searchTerm: string = '';
  patientFilter: number | null = null;
  dateFilter: string = '';
  testRecords: TestOrder[] = [];
  filteredRecords: TestOrder[] = [];
  selectedRecord: TestOrder | null = null;
  patientInfo: Patient | null = null;
  patients: Patient[] = [];

  constructor(
    private testService: TestService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadCompletedTests();
    this.loadPatients();
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  loadCompletedTests(): void {
    this.testService.getTests().subscribe({
      next: (tests: TestOrder[]) => {
        this.testRecords = tests.filter((test: TestOrder) => test.status === 'completed');
        this.applyFilters();
      },
      error: (err) => console.error('Error loading test records:', err)
    });
  }

  loadPatients(): void {
    this.patientService.getPatients().subscribe({
      next: (patients) => this.patients = patients,
      error: (err) => console.error('Error loading patients:', err)
    });
  }

  getPatientName(patientId: number): string {
    const patient = this.patients.find(p => p.id === patientId);
    return patient ? `${patient.first_name} ${patient.last_name}` : 'Unknown Patient';
  }

  applyFilters(): void {
    let filtered = [...this.testRecords];

    // Filter by search term (invoice number)
    if (this.searchTerm) {
      filtered = filtered.filter(record =>
        record.invoiceNumber.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }

    // Filter by patient
    if (this.patientFilter) {
      filtered = filtered.filter(record => record.patientId === this.patientFilter);
    }

    // Filter by date
    if (this.dateFilter) {
      const filterDate = new Date(this.dateFilter).toDateString();
      filtered = filtered.filter(record => {
        if (!record.results?.completedAt) return false;
        const completedDate = new Date(record.results.completedAt).toDateString();
        return completedDate === filterDate;
      });
    }

    this.filteredRecords = filtered;
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.patientFilter = null;
    this.dateFilter = '';
    this.applyFilters();
  }

  viewReport(record: any): void {
    this.selectedRecord = record;
  console.log('Selected record for report:', record);
  console.log('Diagnosis data:', record.results?.diagnosis, record.results?.diagnosisConfidence);
  this.loadPatientDetails(record.patientId);
  }

  loadPatientDetails(patientId: number): void {
    this.patientService.getPatient(patientId).subscribe({
      next: (patient) => this.patientInfo = patient,
      error: (err) => console.error('Error loading patient details:', err)
    });
  }

  printReport(): void {
    window.print();
  }

  closeReport(): void {
    this.selectedRecord = null;
    this.patientInfo = null;
  }
}
