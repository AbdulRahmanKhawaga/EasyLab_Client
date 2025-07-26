import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-stats-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stats-grid.component.html',
  styleUrl: './stats-grid.component.css'
})
export class StatsGridComponent {
  stats = [
    {
      title: 'Total Customers',
      value: '783,675',
      change: '+12%',
      icon: 'fas fa-users',
      color: 'orange'
    },
    {
      title: 'Total Tests',
      value: '563,275',
      change: '+8%',
      icon: 'fas fa-vial',
      color: 'green'
    },
    {
      title: 'Unpaid Invoices',
      value: '0.00',
      change: '0%',
      icon: 'fas fa-file-invoice-dollar',
      color: 'pink'
    },
    {
      title: 'Total Revenue',
      value: '0.00',
      change: '+15%',
      icon: 'fas fa-chart-line',
      color: 'blue'
    }
  ];
}
