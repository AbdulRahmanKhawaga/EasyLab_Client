import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../dashboard/components/sidebar/sidebar.component';
import { NavbarComponent } from '../dashboard/components/navbar/navbar.component';

@Component({
  selector: 'app-my-account',
  standalone: true,
  imports: [CommonModule, SidebarComponent, NavbarComponent],
  templateUrl: './my-account.component.html',
  styleUrls: ['./my-account.component.css']
})
export class MyAccountComponent {
  isSidebarOpen = true;

  user = {
    name: 'Abdo',
    email: 'abdo@example.com',
    role: 'Lab Technician',
    department: 'Laboratory',
    phone: '+1234567890',
    joinDate: '2023-01-15',
    lastLogin: '2024-01-20 10:30 AM'
  };

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
