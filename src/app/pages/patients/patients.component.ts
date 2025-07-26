import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SidebarComponent } from '../dashboard/components/sidebar/sidebar.component';
import { NavbarComponent } from '../dashboard/components/navbar/navbar.component';
import { PatientService } from '../../services/patient.service';
import { Patient } from '../../models/patient.model';

@Component({
  selector: 'app-patients',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent, NavbarComponent],
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  Math = Math;

  isSidebarOpen = true;
  showDeleteModal = false;
  selectedPatient: Patient | null = null;
  searchTerm = '';
  dateFilter = '';
  currentPage = 1;
  itemsPerPage = 10;
  loading = false;
  error: string | null = null;
  successMessage: string | null = null;

  patients: Patient[] = [];

  constructor(
    private patientService: PatientService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadPatients();
  }

  loadPatients() {
    this.loading = true;
    this.error = null;
    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading patients:', error);
        this.error = 'Failed to load patients. Please try again.';
        this.loading = false;
      }
    });
  }

  // Navigation methods
  navigateToAddPatient() {
    this.router.navigate(['/patients/add']);
  }

  navigateToViewPatient(patient: Patient) {
    this.router.navigate(['/patients/view', patient.id]);
  }

  navigateToEditPatient(patient: Patient) {
    this.router.navigate(['/patients/edit', patient.id]);
  }

  // Delete modal methods
  openDeleteModal(patient: Patient) {
    console.log('Opening delete modal for patient:', patient); // ✅
    this.selectedPatient = patient;
    this.showDeleteModal = true;
  }

  closeDeleteModal() {
    this.showDeleteModal = false;
    this.selectedPatient = null;
  }

  deletePatient() {
    if (this.selectedPatient) {
      this.loading = true;
      console.log("Trying to delete patient ID:", this.selectedPatient.id); // ✅
      this.patientService.deletePatient(this.selectedPatient.id).subscribe({
        next: () => {
          this.patients = this.patients.filter(p => p.id !== this.selectedPatient!.id);
          this.closeDeleteModal();
          this.loading = false;
          this.successMessage = 'Patient deleted successfully!';
          setTimeout(() => this.successMessage = null, 3000);
        },
        error: (error) => {
          console.error('Error deleting patient:', error);
          this.error = 'Failed to delete patient. Please try again.';
          this.loading = false;
        }
      });
    }
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

  get filteredPatients() {
    return this.patients
      .filter(patient => {
        const fullName = this.getFullName(patient).toLowerCase();
        const matchesSearch = fullName.includes(this.searchTerm.toLowerCase()) ||
                              patient.national_id.toLowerCase().includes(this.searchTerm.toLowerCase());

        let matchesDate = true;
        if (this.dateFilter) {
          const filterDate = new Date(this.dateFilter);
          const patientDate = new Date(patient.created_at || '');
          matchesDate = patientDate.toDateString() === filterDate.toDateString();
        }

        return matchesSearch && matchesDate;
      })
      .sort((a, b) => {
        const dateA = new Date(a.created_at || '').getTime();
        const dateB = new Date(b.created_at || '').getTime();
        return dateB - dateA;
      });
  }

  get paginatedPatients() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredPatients.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.filteredPatients.length / this.itemsPerPage);
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
