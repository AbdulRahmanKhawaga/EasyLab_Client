import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PatientService } from '../../services/patient.service';
import { TestService } from '../../services/test.service';
import { Patient } from '../../models/patient.model';
import { TestOrder, Test } from '../../models/test.model';
import { NavbarComponent } from '../dashboard/components/navbar/navbar.component';
import { SidebarComponent } from '../dashboard/components/sidebar/sidebar.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tests',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SidebarComponent, NavbarComponent, RouterModule],
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.css']
})
export class TestsComponent implements OnInit {
  isSidebarOpen = true;
  searchTerm: string = '';
  searchResults: Patient[] = [];
  selectedPatient: Patient | null = null;
  showNewPatientForm: boolean = false;
  newPatient: Patient = {
    id: 0,
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: 'Male',
    phone: '',
    email: '',
    address: '',
    national_id: ''
  };
  availableTests: Test[] = [
    { name: 'CBC', price: 50 },
    { name: 'Liver Function', price: 75 },
    { name: 'Kidney Function', price: 80 },
    { name: 'Lipid Profile', price: 65 },
    { name: 'Blood Glucose', price: 40 }
  ];
  selectedTests: Test[] = [];
  currentOrder: TestOrder | null = null;

  constructor(
    private patientService: PatientService,
    private testService: TestService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {}

  searchPatients(): void {
    if (!this.searchTerm.trim()) return;

    this.patientService.getPatients().subscribe({
      next: (patients) => {
        this.searchResults = patients.filter(patient =>
          patient.national_id.includes(this.searchTerm) ||
          `${patient.first_name} ${patient.last_name}`.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      },
      error: (err) => {
        console.error('Error searching patients:', err);
        this.toastr.error('Failed to search patients');
      }
    });
  }

  selectPatient(patient: Patient): void {
    this.selectedPatient = patient;
    this.searchResults = [];
    this.searchTerm = '';
    this.selectedTests = [];
    this.showNewPatientForm = false;
    this.toastr.success('Patient selected');
  }

  showAddNewPatient(): void {
    this.showNewPatientForm = true;
    this.selectedPatient = null;
    this.searchResults = [];
  }

  addNewPatient(): void {
    if (!this.newPatient.first_name || !this.newPatient.last_name || !this.newPatient.national_id) {
      this.toastr.warning('Please fill in all required fields');
      return;
    }

    this.patientService.addPatient(this.newPatient).subscribe({
      next: (patient) => {
        this.selectedPatient = patient;
        this.showNewPatientForm = false;
        this.newPatient = {
          id: 0,
          first_name: '',
          last_name: '',
          date_of_birth: '',
          gender: 'Male',
          phone: '',
          email: '',
          address: '',
          national_id: ''
        };
        this.toastr.success('New patient added successfully');
      },
      error: (err) => {
        console.error('Error adding patient:', err);
        this.toastr.error('Failed to add new patient');
      }
    });
  }

  toggleTestSelection(test: Test): void {
    const index = this.selectedTests.findIndex(t => t.name === test.name);
    if (index === -1) {
      this.selectedTests.push(test);
      this.toastr.info(`${test.name} test selected`);
    } else {
      this.selectedTests.splice(index, 1);
      this.toastr.warning(`${test.name} test removed`);
    }
  }

  isTestSelected(test: Test): boolean {
    return this.selectedTests.some(t => t.name === test.name);
  }

  createTestOrder(): void {
    if (!this.selectedPatient || this.selectedTests.length === 0) {
      this.toastr.warning('Please select a patient and at least one test');
      return;
    }

    const order: TestOrder = {
      id: this.generateId(),
      patientId: this.selectedPatient.id,
      invoiceNumber: `INV-${Date.now()}`,
      status: 'pending',
      tests: this.selectedTests,
      orderedAt: new Date().toISOString(),
      orderedBy: 'Receptionist'
    };

    this.testService.createTest(order).subscribe({
      next: (createdOrder) => {
        this.currentOrder = createdOrder;
        this.toastr.success(`Test order created. Invoice #: ${createdOrder.invoiceNumber}`);
        this.resetForm();
      },
      error: (err) => {
        console.error('Error creating test order:', err);
        this.toastr.error('Failed to create test order');
      }
    });
  }

  resetForm(): void {
    this.selectedPatient = null;
    this.selectedTests = [];
    this.showNewPatientForm = false;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  getTotalPrice(): number {
    return this.selectedTests.reduce((sum, test) => sum + (test.price || 0), 0);
  }
}
