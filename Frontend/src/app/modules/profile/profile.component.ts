import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { UsersService, User } from '../../shared/services/users.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  // Common
  currentUser: User | null = null;
  isAdmin = false;
  
  // User view
  profileForm: FormGroup;
  isLoading = false;
  successMessage = '';
  errorMessage = '';

  // Admin view
  users: User[] = [];
  isLoadingUsers = false;
  selectedUser: User | null = null;
  editForm: FormGroup;
  showOffCanvas = false;
  isEditLoading = false;
  editSuccessMessage = '';
  editErrorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.editForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      role: ['', [Validators.required]],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.pipe(take(1)).subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.isAdmin = user.role === 'Administrator';
        
        if (this.isAdmin) {
          this.loadAllUsers();
        } else {
          this.loadUserProfile();
        }
      }
    });
  }

  // User view methods
  loadUserProfile(): void {
    this.isLoading = true;
    this.usersService.getMe().subscribe({
      next: (user) => {
        this.currentUser = user;
        this.profileForm.patchValue({
          name: user.name || '',
          email: user.email || ''
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid || !this.currentUser) {
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const payload = {
      name: this.profileForm.value.name,
      email: this.profileForm.value.email
    };

    this.usersService.updateUser(this.currentUser.id, payload).subscribe({
      next: (updatedUser) => {
        this.isLoading = false;
        this.successMessage = 'Perfil atualizado com sucesso!';
        this.currentUser = updatedUser;
        this.authService.refreshMe().subscribe();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Erro ao atualizar perfil. Tente novamente.';
        console.error(err);
      }
    });
  }

  onCancel(): void {
    if (this.currentUser) {
      this.profileForm.patchValue({
        name: this.currentUser.name || '',
        email: this.currentUser.email || ''
      });
    }
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Admin view methods
  loadAllUsers(): void {
    this.isLoadingUsers = true;
    this.usersService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoadingUsers = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoadingUsers = false;
      }
    });
  }

  openEditPanel(user: User): void {
    this.selectedUser = user;
    this.editForm.patchValue({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'User',
      isActive: user.isActive ?? true
    });
    this.showOffCanvas = true;
    this.editSuccessMessage = '';
    this.editErrorMessage = '';
  }

  closeEditPanel(): void {
    this.showOffCanvas = false;
    this.selectedUser = null;
    this.editSuccessMessage = '';
    this.editErrorMessage = '';
  }

  onEditSubmit(): void {
    if (this.editForm.invalid || !this.selectedUser) {
      return;
    }

    this.isEditLoading = true;
    this.editSuccessMessage = '';
    this.editErrorMessage = '';

    const payload = {
      name: this.editForm.value.name,
      email: this.editForm.value.email,
      role: this.editForm.value.role,
      isActive: this.editForm.value.isActive
    };

    this.usersService.updateUser(this.selectedUser.id, payload).subscribe({
      next: (updatedUser) => {
        this.isEditLoading = false;
        this.editSuccessMessage = 'Usuário atualizado com sucesso!';
        
        // Update user in the list
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }

        setTimeout(() => {
          this.closeEditPanel();
        }, 1500);
      },
      error: (err) => {
        this.isEditLoading = false;
        this.editErrorMessage = 'Erro ao atualizar usuário. Tente novamente.';
        console.error(err);
      }
    });
  }

  onEditCancel(): void {
    if (this.selectedUser) {
      this.editForm.patchValue({
        name: this.selectedUser.name || '',
        email: this.selectedUser.email || '',
        role: this.selectedUser.role || 'User',
        isActive: this.selectedUser.isActive ?? true
      });
    }
    this.editSuccessMessage = '';
    this.editErrorMessage = '';
  }
}

