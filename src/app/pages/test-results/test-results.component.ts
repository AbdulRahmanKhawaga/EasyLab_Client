import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TestService } from '../../services/test.service';
import { DiagnosisService } from '../../services/diagnosis.service';
import { PatientService } from '../../services/patient.service';
import { TestOrder, CBCData } from '../../models/test.model';
import { Patient } from '../../models/patient.model';
import { SidebarComponent } from '../dashboard/components/sidebar/sidebar.component';
import { NavbarComponent } from '../dashboard/components/navbar/navbar.component';

// Add this import at the top if not already present
import { trigger, state, style, animate, transition } from '@angular/animations';

// You can add animations to the @Component decorator if you want to use Angular animations
@Component({
  selector: 'app-test-results',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent, NavbarComponent],
  templateUrl: './test-results.component.html',
  styleUrls: ['./test-results.component.css'],
  animations: [
    trigger('fadeIn', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(20px)'
      })),
      transition(':enter', [
        animate('1s ease-out', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))
      ])
    ])
  ]
})
export class TestResultsComponent implements OnInit {
  // All pending tests
  isSidebarOpen = true;
  pendingTests: TestOrder[] = [];
  selectedTest: TestOrder | null = null;
  patientInfo: Patient | null = null;
  cbcData: CBCData = {
    hgb: 14,
    mcv: 85,
    mchc: 33,
    wbc: 7.5,
    rbc: 5,
    platelets: 250,
    hct: 42,
    mch: 30
  };
  diagnosisResult: string = '';
  diagnosisConfidence: number = 0;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private testService: TestService,
    private diagnosisService: DiagnosisService,
    private patientService: PatientService
  ) {}

  ngOnInit(): void {
    this.loadPendingTests();
  }

  loadPendingTests(): void {
    this.testService.getTests().subscribe({
      next: (tests) => {
        this.pendingTests = tests.filter(test => test.status === 'pending');

        // If no pending tests are found, create some mock data
        if (this.pendingTests.length === 0) {
          console.log('No pending tests found, would create mock data in a real app');
        }
      },
      error: (err) => console.error('Error loading pending tests:', err)
    });
  }

  // Computed property to filter tests that have CBC test type
  get filteredPendingTests(): TestOrder[] {
    return this.pendingTests.filter(test =>
      test.tests.some(t => t.name === 'CBC')
    );
  }

  selectTest(test: TestOrder) {
    this.selectedTest = test;
    this.loadPatientInfo(test.patientId);
    this.resetResults();
  }

  loadPatientInfo(patientId: number): void {
    this.patientService.getPatient(patientId).subscribe({
      next: (patient) => this.patientInfo = patient,
      error: (err) => console.error('Error loading patient info:', err)
    });
  }

  resetResults(): void {
    this.diagnosisResult = '';
    this.diagnosisConfidence = 0;
    this.errorMessage = '';
    // Reset CBC data to normal values
    this.cbcData = {
      hgb: 14,
      mcv: 85,
      mchc: 33,
      wbc: 7.5,
      rbc: 5,
      platelets: 250,
      hct: 42,
      mch: 30
    };
  }

  getPrediction(): void {
    if (!this.selectedTest) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.diagnosisService.getDiagnosis(this.cbcData).subscribe({
      next: (result) => {
        this.isLoading = false;
        if (result.error) {
          this.errorMessage = result.error;
          return;
        }
        this.diagnosisResult = result.diagnosis;
        this.diagnosisConfidence = result.confidence * 100; // Multiply by 100 to convert to percentage
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Error getting diagnosis. Using mock data instead.';
        console.error('Diagnosis error:', err);

        // Mock response if API fails
        this.mockDiagnosis();
      }
    });
  }

  mockDiagnosis(): void {
    // Simple mock logic based on CBC values
    if (this.cbcData.hgb < 12) {
      this.diagnosisResult = 'Anemia';
      this.diagnosisConfidence = 0.85 * 100; // Convert to percentage
    } else if (this.cbcData.wbc > 11) {
      this.diagnosisResult = 'Infection';
      this.diagnosisConfidence = 0.78 * 100;
    } else if (this.cbcData.platelets < 150) {
      this.diagnosisResult = 'Thrombocytopenia';
      this.diagnosisConfidence = 0.82 * 100;
    } else {
      this.diagnosisResult = 'Normal';
      this.diagnosisConfidence = 0.95 * 100;
    }
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  saveResults(): void {
    if (!this.selectedTest) return;

    const results = {
      completedAt: new Date().toISOString(),
      completedBy: 'Doctor', // In a real app, this would be the logged-in user
      cbcData: this.cbcData,
      diagnosis: this.diagnosisResult,
      diagnosisConfidence: this.diagnosisConfidence
    };
    console.log('Saving test results with diagnosis:', results);
    this.testService.updateTestResults(this.selectedTest.id, results).subscribe({
      next: (updatedTest) => {
        // Also update the status to completed
        this.testService.updateTest(updatedTest.id, { status: 'completed' }).subscribe({
          next: () => {
            alert('Test results saved successfully');
            this.loadPendingTests();
            this.selectedTest = null;
            this.patientInfo = null;
          },
          error: (err) => console.error('Error updating test status:', err)
        });
      },
      error: (err) => console.error('Error saving test results:', err)
    });
  }
}
