import {AfterViewInit, Component, Renderer2} from '@angular/core';
import {DatePipe, NgIf} from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from "@angular/forms";
import {RegisterDTO} from "../../DTO/RegisterDTO";
import {UserService} from "../../Service/UserService";
import {DashBoard} from "../../DTO/DashBoard";
import {AdminService} from "../../Service/AdminService";
import {Router} from "@angular/router";
import {Order} from "../../Model/orders";
import {Product} from "../../Model/product.model";
import {ProductService} from "../../Service/ProductService";
declare var bootstrap: any;  // Add this line to declare bootstrap

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    DatePipe,
    FormsModule,
    // AddUserFormComponent // <-- if you have this one too
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent{
  dashBoard:DashBoard = {
    no_of_users:'',
    no_of_orders:'',
    no_of_products:''
  }
  orders !:Order[];
  constructor(private renderer: Renderer2,private fb: NonNullableFormBuilder,private userservice:UserService,private adminService:AdminService,private router:Router,private productService:ProductService) {

    this.DashBoard();
    this.getOrders();
  }
  showAddProductForm: boolean = false;
  showAddUserForm: boolean = false;
  productForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: ['', [Validators.required, Validators.min(0)]],
  });
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;
  userForm = this.fb.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    role: ['', Validators.required],
  });

  showCard(event: Event) {
    event.preventDefault();  // Prevent the default anchor behavior
    this.showAddProductForm = true;

    // Manually scroll to the form
    const formElement = document.getElementById('addProductForm');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  hideCard() {
    this.showAddProductForm = false;
  }
  showUserCard(event: Event) {
    event.preventDefault();  // Prevent the default anchor behavior
    this.showAddUserForm = true;

    // Manually scroll to the form
    const formElement = document.getElementById('addUserForm');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  }
  hideUserCard() {
    this.showAddUserForm = false;
  }
  onSubmitUser() {
    if (this.userForm.valid) {
      const user:RegisterDTO = {
        'email': this.userForm.get('email')!.value,
        'password': this.userForm.get('password')!.value,
        'role': this.userForm.get('role')!.value,
        'username': this.userForm.get('username')!.value,
      }
      this.userservice.addUser(user);
      this.userForm.reset();
    }
  }
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (this.productForm.valid&&this.selectedFile) {
      const formData = new FormData();
      formData.append('productName', this.productForm.get('name')!.value);
      formData.append('description', this.productForm.get('description')!.value);
      formData.append('productPrice', this.productForm.get('price')!.value);
      formData.append('image', this.selectedFile!);
      console.log(formData)
      this.productService.addProduct(formData)
        .subscribe({
          next: (data) => {
            console.log('Product saved successfully');
            console.log(data);
          }, error: (err) => {
            if (err.status === 200) {
              console.log('Product saved successfully');
              // You might want to update your UI here anyway
            } else {
              console.error('Real error occurred', err);
            }
          }
        })
    }
  }
  DashBoard(){
    this.adminService.getDashBoard().subscribe({
      next: (response) => {
        this.dashBoard = response;
      }
    })
  }
  getOrders(){
    this.adminService.getAllOrders().subscribe({
      next: (response) => {
        this.orders = response;
      }
    })
  }
}
