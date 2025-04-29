import {AfterViewInit, Component, Renderer2} from '@angular/core';
declare var bootstrap: any;  // Add this line to declare bootstrap

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements AfterViewInit{

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    const modal = document.getElementById('myModal');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    this.renderer.appendChild(document.body, modal); // Appending to body
    this.renderer.appendChild(document.body, modalBackdrop); // Appending the backdrop too
  }
  openModal() {
    const modal = new bootstrap.Modal(document.getElementById('myModal'));
    modal.show();
  }
}
