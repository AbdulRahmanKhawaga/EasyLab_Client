import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../../dashboard/components/sidebar/sidebar.component';
import { NavbarComponent } from '../../dashboard/components/navbar/navbar.component';
import { PatientService } from '../../../services/patient.service';
import { Patient } from '../../../models/patient.model';
import { ToastrService } from 'ngx-toastr'; // ✅ Added

@Component({
  selector: 'app-edit-patient',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SidebarComponent, NavbarComponent],
  template:
  `<div class="dashboard-container">
  <app-sidebar [isOpen]="isSidebarOpen"></app-sidebar>

  <main class="main-content">
    <app-navbar (toggleSidebar)="toggleSidebar()"></app-navbar>

    <div class="page-content">
      <div class="page-header">
        <div class="header-left">
          <button class="btn btn-secondary" (click)="goBack()">
            <i class="fas fa-arrow-left"></i> Back
          </button>
          <h1>Edit Patient</h1>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="loading && !patient" class="loading-message">
        <i class="fas fa-spinner fa-spin"></i> Loading patient data...
      </div>

      <!-- Error Message -->
      <div *ngIf="error" class="error-message">
        <i class="fas fa-exclamation-triangle"></i> {{error}}
      </div>

      <!-- Form -->
      <div class="form-container" *ngIf="patient">
        <form [formGroup]="patientForm" (ngSubmit)="onSubmit()">
          <div class="form-section">
            <h3>Personal Information</h3>

            <div class="form-row">
              <div class="form-group">
                <label>First Name *</label>
                <input
                  type="text"
                  formControlName="first_name"
                  class="form-control"
                  [class.is-invalid]="patientForm.get('first_name')?.invalid && patientForm.get('first_name')?.touched"
                >
                <div *ngIf="patientForm.get('first_name')?.invalid && patientForm.get('first_name')?.touched" class="error-feedback">
                  First name is required
                </div>
              </div>

              <div class="form-group">
                <label>Last Name *</label>
                <input
                  type="text"
                  formControlName="last_name"
                  class="form-control"
                  [class.is-invalid]="patientForm.get('last_name')?.invalid && patientForm.get('last_name')?.touched"
                >
                <div *ngIf="patientForm.get('last_name')?.invalid && patientForm.get('last_name')?.touched" class="error-feedback">
                  Last name is required
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  formControlName="date_of_birth"
                  class="form-control"
                  [class.is-invalid]="patientForm.get('date_of_birth')?.invalid && patientForm.get('date_of_birth')?.touched"
                >
                <div *ngIf="patientForm.get('date_of_birth')?.invalid && patientForm.get('date_of_birth')?.touched" class="error-feedback">
                  Date of birth is required
                </div>
              </div>

              <div class="form-group">
                <label>Gender *</label>
                <select
                  formControlName="gender"
                  class="form-control"
                  [class.is-invalid]="patientForm.get('gender')?.invalid && patientForm.get('gender')?.touched"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
                <div *ngIf="patientForm.get('gender')?.invalid && patientForm.get('gender')?.touched" class="error-feedback">
                  Gender is required
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>National ID *</label>
              <input
                type="text"
                formControlName="national_id"
                class="form-control"
                [class.is-invalid]="patientForm.get('national_id')?.invalid && patientForm.get('national_id')?.touched"
              >
              <div *ngIf="patientForm.get('national_id')?.invalid && patientForm.get('national_id')?.touched" class="error-feedback">
                National ID is required
              </div>
            </div>
          </div>

          <div class="form-section">
            <h3>Contact Information</h3>

            <div class="form-row">
              <div class="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  formControlName="phone"
                  class="form-control"
                  [class.is-invalid]="patientForm.get('phone')?.invalid && patientForm.get('phone')?.touched"
                >
                <div *ngIf="patientForm.get('phone')?.invalid && patientForm.get('phone')?.touched" class="error-feedback">
                  Phone number is required
                </div>
              </div>

              <div class="form-group">
                <label>Email</label>
                <input
                  type="email"
                  formControlName="email"
                  class="form-control"
                  [class.is-invalid]="patientForm.get('email')?.invalid && patientForm.get('email')?.touched"
                >
                <div *ngIf="patientForm.get('email')?.invalid && patientForm.get('email')?.touched" class="error-feedback">
                  Please enter a valid email
                </div>
              </div>
            </div>

            <div class="form-group">
              <label>Address *</label>
              <textarea
                formControlName="address"
                class="form-control"
                rows="3"
                [class.is-invalid]="patientForm.get('address')?.invalid && patientForm.get('address')?.touched"
              ></textarea>
              <div *ngIf="patientForm.get('address')?.invalid && patientForm.get('address')?.touched" class="error-feedback">
                Address is required
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn btn-secondary" (click)="goBack()">Cancel</button>
            <button type="submit" class="btn btn-primary" [disabled]="!patientForm.valid || loading">
              <i *ngIf="loading" class="fas fa-spinner fa-spin"></i>
              Update Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  </main>
</div>
`,
  styleUrls: ['../patients.component.css', '../add-patient/add-patient.component.css']
})
export class EditPatientComponent implements OnInit {
  isSidebarOpen = true;
  patientForm: FormGroup;
  loading = false;
  error: string | null = null;
  patient: Patient | null = null;
  patientId: number;

  constructor(
    private fb: FormBuilder,
    private patientService: PatientService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService // ✅ Injected ToastrService
  ) {
    this.patientForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      date_of_birth: ['', Validators.required],
      gender: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.email]],
      address: ['', Validators.required],
      national_id: ['', Validators.required]
    });

    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit() {
    this.loadPatient();
  }

  loadPatient() {
    this.loading = true;
    this.error = null;

    this.patientService.getPatient(this.patientId).subscribe({
      next: (patient) => {
        this.patient = patient;
        this.populateForm();
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error loading patient:', error);
        this.error = 'Patient not found or failed to load.';
        this.toastr.error('Patient not found or failed to load.', 'Error'); // ✅ toast on load error
        this.loading = false;
      }
    });
  }

  populateForm() {
    if (this.patient) {
      this.patientForm.patchValue({
        first_name: this.patient.first_name,
        last_name: this.patient.last_name,
        date_of_birth: this.patient.date_of_birth,
        gender: this.patient.gender,
        phone: this.patient.phone,
        email: this.patient.email || '',
        address: this.patient.address,
        national_id: this.patient.national_id
      });
    }
  }

  onSubmit() {
    if (this.patientForm.valid && this.patient) {
      this.loading = true;
      this.error = null;

      const formData = this.patientForm.value;

      this.patientService.updatePatient(this.patient.id, formData).subscribe({
        next: (updatedPatient) => {
          this.loading = false;
          this.toastr.success('Patient updated successfully!', 'Success'); // ✅ toast success
          this.router.navigate(['/patients']);
        },
        error: (error) => {
          console.error('Error updating patient:', error);
          this.error = 'Failed to update patient. Please try again.';
          this.toastr.error('Failed to update patient. Please try again.', 'Error'); // ✅ toast error
          this.loading = false;
        }
      });
    } else {
      Object.keys(this.patientForm.controls).forEach(key => {
        this.patientForm.get(key)?.markAsTouched();
      });
    }
  }

  goBack() {
    this.router.navigate(['/patients']);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
