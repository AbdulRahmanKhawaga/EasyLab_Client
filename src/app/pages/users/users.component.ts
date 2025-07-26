import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../dashboard/components/navbar/navbar.component';
import { SidebarComponent } from '../dashboard/components/sidebar/sidebar.component';
import { UserService, User } from '../../services/users.service' ;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  isSidebarOpen = true;
  users: User[] = [];
  filteredUsers: User[] = [];
  searchTerm: string = '';
  selectedRole: string = '';
  selectedStatus: string = '';

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

  showAddModal: boolean = false;
  showEditModal: boolean = false;
  showDeleteModal: boolean = false;
  selectedUser: User | null = null;

  newUser: Partial<User & { status?: string; createdAt?: Date; lastLogin?: Date }> = {
    username: '',
    email: '',
    role: 'technician',
    is_active: true,
    status: 'active'
  };

  roles = [
    { value: 'admin', label: 'Administrator' },
    { value: 'technician', label: 'Lab Technician' },
    { value: 'doctor', label: 'Doctor' }
  ];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users.map(user => ({
          ...user,
          status: user.is_active ? 'active' : 'inactive',
          lastLogin: new Date(user.last_login),
          createdAt: new Date(user.created_at)
        }));
        this.applyFilters();
      },
      error: (err) => {
        console.error('❌ Failed to load users:', err);
      }
    });
  }

  applyFilters() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      const matchesStatus = !this.selectedStatus || (user as any).status === this.selectedStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    this.currentPage = 1;
  }

  get paginatedUsers() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredUsers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  onSearch() { this.applyFilters(); }
  onRoleFilter() { this.applyFilters(); }
  onStatusFilter() { this.applyFilters(); }

  openAddModal() {
    this.newUser = { username: '', email: '', role: 'technician', is_active: true, status: 'active' };
    this.showAddModal = true;
  }

  openEditModal(user: User) {
    this.selectedUser = { ...user };
    this.showEditModal = true;
  }

  openDeleteModal(user: User) {
    this.selectedUser = user;
    this.showDeleteModal = true;
  }

  closeModals() {
    this.showAddModal = false;
    this.showEditModal = false;
    this.showDeleteModal = false;
    this.selectedUser = null;
  }

  addUser() {
    const payload = {
      username: this.newUser.username,
      email: this.newUser.email,
      role: this.newUser.role,
      is_active: this.newUser.status === 'active',
    };

    this.userService.createUser(payload).subscribe({
      next: () => {
        this.loadUsers();
        this.closeModals();
      },
      error: err => {
        console.error('❌ Failed to create user:', err);
      },
    });
  }

  updateUser() {
    if (!this.selectedUser) return;

    const payload = {
      username: this.selectedUser.username,
      email: this.selectedUser.email,
      role: this.selectedUser.role,
      is_active: this.newUser.status === 'active',
    };

    this.userService.updateUser(this.selectedUser.id, payload).subscribe({
      next: () => {
        this.loadUsers();
        this.closeModals();
      },
      error: err => {
        console.error('❌ Failed to update user:', err);
      },
    });
  }

  deleteUser() {
    if (!this.selectedUser) return;

    this.userService.deleteUser(this.selectedUser.id).subscribe({
      next: () => {
        this.loadUsers();
        this.closeModals();
      },
      error: err => {
        console.error('❌ Failed to delete user:', err);
      },
    });
  }


  previousPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.currentPage++;
  }

  getRoleLabel(role: string): string {
    const roleObj = this.roles.find(r => r.value === role);
    return roleObj ? roleObj.label : role;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
