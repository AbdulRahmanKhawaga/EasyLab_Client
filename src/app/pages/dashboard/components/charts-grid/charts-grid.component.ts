import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-charts-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './charts-grid.component.html',
  styleUrl: './charts-grid.component.css'
})
export class ChartsGridComponent {
  legendItems = [
    { color: 'red', label: 'Unpaid Invoices' },
    { color: 'green', label: 'Paid Invoices' },
    { color: 'orange', label: 'Partially Paid Invoices' }
  ];

  getColorCode(color: string): string {
    const colorMap: { [key: string]: string } = {
      'red': 'ef4444',
      'green': '22c55e',
      'orange': 'f97316'
    };
    return colorMap[color] || 'ef4444';
  }

  getRandomHeight(): number {
    return Math.floor(Math.random() * 60) + 40; // Returns a number between 40 and 100
  }
}
