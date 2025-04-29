import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Employee } from './employee.model'; 
import { EmployeeService } from './employee.service'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
loading: any;
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  employees: Employee[] = [];
  employeeForm: FormGroup;
  showPopup = false;
  isEditing = false;
  selectedEmployee: Employee | null = null;

  constructor(private employeeService: EmployeeService, private fb: FormBuilder) {
    this.employeeForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.pattern('^[A-Za-z ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      department: ['', [Validators.required, Validators.pattern('HR|IT|Finance|Operations')]]
    });
  }

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService.getAllEmployees().subscribe((data: Employee[]) => {
      this.employees = data;
    });
  }

  openAddPopup(): void {
    this.isEditing = false;
    this.employeeForm.reset();
    this.showPopup = true;
  }

  openEditPopup(employee: Employee): void {
    this.isEditing = true;
    this.selectedEmployee = employee;
    this.employeeForm.setValue({
      id: employee.id,
      name: employee.name,
      email: employee.email,
      department: employee.department
    });
    this.showPopup = true;
  }

  closePopup(): void {
    this.showPopup = false;
  }

  addEmployee(): void {
    if (this.employeeForm.valid) {
      this.employeeService.addEmployee(this.employeeForm.value).subscribe(() => {
        this.loadEmployees();
        this.closePopup();
      });
    }
  }

  updateEmployee(): void {
    if (this.employeeForm.valid) {
      this.employeeService.updateEmployee(this.employeeForm.value).subscribe(() => {
        this.loadEmployees();
        this.closePopup();
      });
    }
  }

  deleteEmployee(id: number): void {
    this.employeeService.deleteEmployee(id).subscribe(() => {
      this.loadEmployees();
    });
  }

searchId: number | null = null;
searchedEmployee: Employee | null = null;
searchError: string | null = null;

searchEmployeeById(): void {
  if (this.searchId !== null && !isNaN(this.searchId)) {
    this.employeeService.getEmployeeById(this.searchId).subscribe({
      next: (employee) => {
        this.searchedEmployee = employee;
        this.searchError = null;
      },
      error: () => {
        this.searchedEmployee = null;
        this.searchError = 'Employee not found';
      }
    });
  } else {
    this.searchError = 'Please enter a valid ID';
    this.searchedEmployee = null;
  }
}

}
