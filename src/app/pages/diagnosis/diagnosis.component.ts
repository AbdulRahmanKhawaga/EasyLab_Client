import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DiagnosisService, CBCInput, DiagnosisResult } from '../../services/diagnosis.service';
import { FormsModule } from '@angular/forms';
import { SidebarComponent } from '../dashboard/components/sidebar/sidebar.component';
import { NavbarComponent } from '../dashboard/components/navbar/navbar.component';

@Component({
  selector: 'app-diagnosis',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent, NavbarComponent],
  templateUrl: './diagnosis.component.html',
  styleUrls: ['./diagnosis.component.css']
})
export class DiagnosisComponent {
  isSidebarOpen = true;
  loading = false;
  error: string | null = null;
  result: DiagnosisResult | null = null;

  inputData: CBCInput = {
    hgb: 13,
    mcv: 85,
    mchc: 32,
    wbc: 6,
    rbc: 4.5,
    platelets: 250,
    hct: 40,
    mch: 28
  };

  constructor(private diagnosisService: DiagnosisService) {}

  submit() {
    this.loading = true;
    this.error = null;
    this.result = null;
    this.diagnosisService.getDiagnosis(this.inputData).subscribe({
      next: res => {
        this.result = res;
        this.loading = false;
      },
      error: err => {
        console.error('Diagnosis error:', err);
        this.error = 'Failed to get diagnosis. Please check the input values and try again.';
        this.loading = false;
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
