import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../dashboard/components/navbar/navbar.component';
import { SidebarComponent } from '../dashboard/components/sidebar/sidebar.component';

interface Settings {
  general: {
    labName: string;
    labAddress: string;
    labPhone: string;
    labEmail: string;
    timezone: string;
    dateFormat: string;
  };
  appearance: {
    theme: 'light' | 'dark';
    primaryColor: string;
    fontSize: 'small' | 'medium' | 'large';
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    criticalAlerts: boolean;
    reportReady: boolean;
    systemMaintenance: boolean;
  };
  security: {
    sessionTimeout: number;
    passwordExpiry: number;
    twoFactorAuth: boolean;
    loginAttempts: number;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    retentionPeriod: number;
    lastBackup: Date | null;
  };
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  // Add sidebar state management
  isSidebarOpen = true;

  settings: Settings = {
    general: {
      labName: 'Advanced Medical Laboratory',
      labAddress: '123 Medical Center Dr, Health City, HC 12345',
      labPhone: '+1 (555) 123-4567',
      labEmail: 'info@advancedlab.com',
      timezone: 'America/New_York',
      dateFormat: 'MM/dd/yyyy'
    },
    appearance: {
      theme: 'light',
      primaryColor: '#007bff',
      fontSize: 'medium'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      criticalAlerts: true,
      reportReady: true,
      systemMaintenance: true
    },
    security: {
      sessionTimeout: 30,
      passwordExpiry: 90,
      twoFactorAuth: false,
      loginAttempts: 3
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionPeriod: 30,
      lastBackup: new Date('2024-01-15T02:00:00')
    }
  };

  activeTab: string = 'general';
  isSaving: boolean = false;

  timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'UTC', label: 'UTC' }
  ];

  dateFormats = [
    { value: 'MM/dd/yyyy', label: 'MM/dd/yyyy (US)' },
    { value: 'dd/MM/yyyy', label: 'dd/MM/yyyy (EU)' },
    { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd (ISO)' }
  ];

  themes = [
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Theme' }
  ];

  fontSizes = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' }
  ];

  backupFrequencies = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' }
  ];

  ngOnInit() {
    this.loadSettings();
  }

  loadSettings() {
    // Load settings from localStorage or API
    const savedSettings = localStorage.getItem('labSettings');
    if (savedSettings) {
      this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
    }
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  saveSettings() {
    this.isSaving = true;

    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('labSettings', JSON.stringify(this.settings));
      console.log('Settings saved:', this.settings);
      this.isSaving = false;

      // Apply theme changes
      this.applyTheme();
    }, 1000);
  }

  applyTheme() {
    document.body.className = this.settings.appearance.theme;
    document.documentElement.style.setProperty('--primary-color', this.settings.appearance.primaryColor);
    document.documentElement.style.setProperty('--font-size-base',
      this.settings.appearance.fontSize === 'small' ? '14px' :
      this.settings.appearance.fontSize === 'large' ? '18px' : '16px'
    );
  }

  resetToDefaults() {
    if (confirm('Are you sure you want to reset all settings to default values?')) {
      this.settings = {
        general: {
          labName: 'Advanced Medical Laboratory',
          labAddress: '123 Medical Center Dr, Health City, HC 12345',
          labPhone: '+1 (555) 123-4567',
          labEmail: 'info@advancedlab.com',
          timezone: 'America/New_York',
          dateFormat: 'MM/dd/yyyy'
        },
        appearance: {
          theme: 'light',
          primaryColor: '#007bff',
          fontSize: 'medium'
        },
        notifications: {
          emailNotifications: true,
          smsNotifications: false,
          criticalAlerts: true,
          reportReady: true,
          systemMaintenance: true
        },
        security: {
          sessionTimeout: 30,
          passwordExpiry: 90,
          twoFactorAuth: false,
          loginAttempts: 3
        },
        backup: {
          autoBackup: true,
          backupFrequency: 'daily',
          retentionPeriod: 30,
          lastBackup: new Date()
        }
      };
    }
  }

  runBackupNow() {
    console.log('Running manual backup...');
    this.settings.backup.lastBackup = new Date();
    // Simulate backup process
    alert('Backup completed successfully!');
  }

  exportSettings() {
    const dataStr = JSON.stringify(this.settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'lab-settings.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  importSettings(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target?.result as string);
          this.settings = { ...this.settings, ...importedSettings };
          alert('Settings imported successfully!');
        } catch (error) {
          alert('Error importing settings. Please check the file format.');
        }
      };
      reader.readAsText(file);
    }
  }

  // Add toggle sidebar method
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
