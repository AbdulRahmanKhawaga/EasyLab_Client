import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  showUserDropdown = false;

  constructor(private router: Router) {}

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

  logout() {
    this.router.navigate(['/login']);
  }

  goToMyAccount() {
    this.showUserDropdown = false;
    this.router.navigate(['/my-account']);
  }
}
