import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() isOpen = true;

  menuItems = [
    { icon: 'fas fa-chart-pie', label: 'Dashboard', route: '/dashboard', active: false },
    { icon: 'fas fa-users', label: 'Patients', route: '/patients', active: false },
    { icon: 'fas fa-vial', label: 'Tests', route: '/tests', active: false },
    { icon: 'fas fa-file-medical', label: 'Results', route: '/test-results', active: false },
    { icon: 'fas fa-chart-bar', label: 'Reports', route: '/reports', active: false },
    { icon: 'fas fa-user-md', label: 'Users', route: '/users', active: false }
    // { icon: 'fas fa-cog', label: 'Settings', route: '/settings', active: false },
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Set active menu item based on current route when component initializes
    this.setActiveMenuItem(this.router.url);

    // Subscribe to router events to update active state when route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.setActiveMenuItem(event.url);
      });
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
    this.setActiveMenuItem(route);
  }

  setActiveMenuItem(currentRoute: string): void {
    // Update active state for all menu items
    this.menuItems.forEach(item => {
      // Check if the current route starts with the menu item route
      // This handles nested routes (e.g., /patients/1 should activate the Patients link)
      item.active = currentRoute.startsWith(item.route);
    });
  }
}
