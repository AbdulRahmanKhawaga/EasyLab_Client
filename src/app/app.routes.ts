import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { PatientsComponent } from './pages/patients/patients.component';
import { TestsComponent } from './pages/tests/tests.component';
import { TestResultsComponent } from './pages/test-results/test-results.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { UsersComponent } from './pages/users/users.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { DiagnosisComponent } from './pages/diagnosis/diagnosis.component';
import { MyAccountComponent } from './pages/my-account/my-account.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  // { path: 'patients', component: PatientsComponent },
  { path: 'patients', loadComponent: () => import('./pages/patients/patients.component').then(m => m.PatientsComponent) },
  { path: 'patients/add', loadComponent: () => import('./pages/patients/add-patient/add-patient.component').then(m => m.AddPatientComponent) },
  { path: 'patients/edit/:id', loadComponent: () => import('./pages/patients/edit-patient/edit-patient.component').then(m => m.EditPatientComponent) },
  { path: 'patients/view/:id', loadComponent: () => import('./pages/patients/view-patient/view-patient.component').then(m => m.ViewPatientComponent) },
  { path: 'tests', component: TestsComponent },
  { path: 'test-results', component: TestResultsComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'users', component: UsersComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'diagnosis', component: DiagnosisComponent },
  { path: 'my-account', component: MyAccountComponent },
];
