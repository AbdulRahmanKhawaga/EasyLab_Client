import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../../dashboard/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../dashboard/components/navbar/navbar.component';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../models/patient.model';

@Component({
  selector: 'app-view-patient',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NavbarComponent],
  template: `
    <div class="dashboard-container">
      <app-sidebar [isOpen]="isSidebarOpen"></app-sidebar>

      <main class="main-content">
        <app-navbar (toggleSidebar)="toggleSidebar()"></app-navbar>

        <div class="page-content">
          <div class="page-header">
            <div class="header-left">
              <button class="btn btn-secondary" (click)="goBack()">
                <i class="fas fa-arrow-left"></i> Back
              </button>
              <h1>Patient Details</h1>
            </div>
            <div class="header-actions" *ngIf="patient">
              <button class="btn btn-primary" (click)="editPatient()">
                <i class="fas fa-edit"></i> Edit Patient
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div *ngIf="loading" class="loading-message">
            <i class="fas fa-spinner fa-spin"></i> Loading patient data...
          </div>

          <!-- Error Message -->
          <div *ngIf="error" class="error-message">
            <i class="fas fa-exclamation-triangle"></i> {{error}}
          </div>

          <!-- Patient Details -->
          <div class="patient-details-container" *ngIf="patient">
            <div class="patient-header">
              <div class="patient-avatar">
                <i class="fas fa-user-circle"></i>
              </div>
              <div class="patient-info">
                <h2>{{getFullName(patient)}}</h2>
                <div class="patient-meta">
                  <span class="patient-id">ID: {{patient.id}}</span>
                  <span class="patient-age">{{calculateAge(patient.date_of_birth)}} years old</span>
                </div>
              </div>
            </div>

            <div class="details-sections">
              <div class="details-section">
                <h3>Personal Information</h3>
                <div class="details-grid">
                  <div class="detail-item">
                    <div class="detail-label">First Name</div>
                    <div class="detail-value">{{patient.first_name}}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Last Name</div>
                    <div class="detail-value">{{patient.last_name}}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Date of Birth</div>
                    <div class="detail-value">{{patient.date_of_birth | date:'mediumDate'}}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Age</div>
                    <div class="detail-value">{{calculateAge(patient.date_of_birth)}} years</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Gender</div>
                    <div class="detail-value">{{patient.gender}}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">National ID</div>
                    <div class="detail-value">{{patient.national_id}}</div>
                  </div>
                </div>
              </div>

              <div class="details-section">
                <h3>Contact Information</h3>
                <div class="details-grid">
                  <div class="detail-item">
                    <div class="detail-label">Phone</div>
                    <div class="detail-value">{{patient.phone}}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Email</div>
                    <div class="detail-value">{{patient.email || 'Not provided'}}</div>
                  </div>
                  <div class="detail-item full-width">
                    <div class="detail-label">Address</div>
                    <div class="detail-value">{{patient.address}}</div>
                  </div>
                </div>
              </div>

              <div class="details-section">
                <h3>Registration Information</h3>
                <div class="details-grid">
                  <div class="detail-item">
                    <div class="detail-label">Registration Date</div>
                    <div class="detail-value">{{patient.created_at | date:'medium'}}</div>
                  </div>
                  <div class="detail-item">
                    <div class="detail-label">Last Updated</div>
                    <div class="detail-value">{{patient.updated_at | date:'medium'}}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styleUrls: ['../patients.component.css', './view-patient.component.css']
})
export class ViewPatientComponent implements OnInit {
  isSidebarOpen = true;
  loading = false;
  error: string | null = null;
  patient: Patient | null = null;
  patientId: number;

  constructor(
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    this.loadPatient();
  }

  loadPatient() {
    this.loading = true;
    this.error = null;

    // Since we don't have a getPatient by ID method, we'll get all patients and find the one we need
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.patient = patients.find(p => p.id === this.patientId) || null;
        if (!this.patient) {
          this.error = 'Patient not found.';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patient:', error);
        this.error = 'Failed to load patient data. Please try again.';
        this.loading = false;
      }
    });
  }

  calculateAge(dateOfBirth: string): number {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getFullName(patient: Patient): string {
    return `${patient.first_name} ${patient.last_name}`;
  }

  editPatient() {
    if (this.patient) {
      this.router.navigate(['/patients/edit', this.patient.id]);
    }
  }

  goBack() {
    this.router.navigate(['/patients']);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
