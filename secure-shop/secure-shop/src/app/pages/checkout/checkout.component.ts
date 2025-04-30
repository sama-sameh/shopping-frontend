import {Component, OnInit} from '@angular/core';
import {CartDetailDTO} from "../../DTO/CartDetailDTO";
import {AuthService} from "@core/auth/auth.service";
import {Router} from "@angular/router";
import {CartService} from "../../Service/CartService";
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {CheckoutService} from "../../Service/CheckoutService";
import {CreditCardService} from "../../Service/CreditCardService";
import {EncryptionService} from "../../Service/encry_decry.service";

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent {
  cartItems!: CartDetailDTO[];
  totalPrice!: number;
  hasExistingCard: boolean = false;
  decryptedCardNumber: string | null = null;

  paymentForm!: FormGroup;

  constructor(private cartService: CartService, private fb: FormBuilder, private creditcardService: CreditCardService, private decrytion: EncryptionService,private checkoutService: CheckoutService,private router:Router) {
    this.initializeForm();
    this.getCardNumber();
  }
  initializeForm() {
    this.paymentForm = this.fb.group({
      cardNumber: [
        {value: '', disabled: false},
        [Validators.required, this.validateCardNumber]
      ],
      expiryDate: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3}$/)]]
    });
  }

  getCardNumber() {
    this.creditcardService.getCardNumber().subscribe({
      next: (cardnumber) => {
        console.log("EncryptedCardNumber", cardnumber);
        this.decryptedCardNumber = this.decrytion.decrypt(cardnumber);
        console.log(this.decryptedCardNumber);
        if (this.decryptedCardNumber) {
          this.hasExistingCard = true;
          this.paymentForm.patchValue({
            cardNumber: this.decryptedCardNumber
          });
          this.paymentForm.get('cardNumber')?.disable();
        } else {
          this.hasExistingCard = false;
          this.paymentForm.get('cardNumber')?.enable();
        }
      },
      error: (err) => {
        console.error('Error getting card number:', err);
        this.hasExistingCard = false;
        this.paymentForm.get('cardNumber')?.enable();
      }
    });
  }
  get cardNumber() {
    return this.paymentForm.get('cardNumber');
  }

  get expiryDate() {
    return this.paymentForm.get('expiryDate');
  }

  get cvv() {
    return this.paymentForm.get('cvv');
  }

  validateCardNumber(control: AbstractControl) {
    const value = control.value?.replace(/\s+/g, ''); // Remove all spaces
    if (!value) return null;

    return value.length === 16 && /^\d+$/.test(value)
      ? null
      : {invalidCardNumber: true};
  }

  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (value.length > 16) {
      value = value.substr(0, 16);
    }
    let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
    this.cardNumber?.setValue(formattedValue, {emitEvent: false});
  }

  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 4) {
      value = value.substr(0, 4);
    }
    if (value.length > 2) {
      value = value.replace(/^(\d{2})/, '$1/');
    }
    this.expiryDate?.setValue(value, {emitEvent: false});
  }

  placeOrder() {
    if (this.paymentForm.valid) {
      if(!this.hasExistingCard){
        this.creditcardService.addCard({cvv:this.paymentForm.get('cvv')?.value,encryptedCardNumber:this.paymentForm.get('cardNumber')?.value}).subscribe({
          next:(data)=>{
             console.log("Card Details Saved");
          },
            error: (cardError) => {
              console.error('Error saving card details:', cardError);
            }
        }
        )
      }
      this.checkoutService.placeOrder().subscribe({
        next: (orderResponse) => {
          if(orderResponse){
            console.log('Order placed successfully');
            this.paymentForm.reset();
            this.router.navigate(['/order-success'], {
              state: { orderDetails: orderResponse }
            });
          }
          else{
            console.error('Error in placing order:');
          }
        },
        error: (orderError) => {
          console.error('Error in placing order:', orderError);
        }
      });
    }
    else {
      this.paymentForm.markAllAsTouched();
    }
  }

  ngOnInit(): void {
    this.loadCart();

  }

  loadCart(): void {
    this.cartService.getCart().subscribe({
      next: (data) => {
        this.cartItems = data;
        this.calculateTotalPrice();
      },
      error: (err) => {
        console.error('Error loading cart:', err);
      }
    });
  }

  calculateTotalPrice(): void {
    this.totalPrice = this.cartItems.reduce(
      (total, item) => total + item.price,
      0
    );
    this.totalPrice = parseFloat(this.totalPrice.toFixed(2));
  }

  // placeOrder(): void {
  //   // if (this.paymentForm.invalid) {
  //   //   this.paymentForm.markAllAsTouched();
  //   //   return;
  //   // }
  //   //
  //   // this.isSubmitting = true;
  //   // this.paymentError = null;
  //
  //   // Prepare card details
  //   const cardDetails = {
  //     cardHolderName: this.paymentForm.value.cardHolderName,
  //     cardNumber: this.paymentForm.value.cardNumber.replace(/\s/g, ''), // Remove spaces
  //     expiryDate: this.paymentForm.value.expiryDate,
  //     cvv: this.paymentForm.value.cvv
  //   };
  //
  //   // First save the card details
  //   this.cardService.addCard({cvv:cardDetails.cvv,encryptedCardNumber:cardDetails.cardNumber}).subscribe({
  //     next: (cardResponse) => {
  //       // Then place the order
  //       this.checkoutService.placeOrder().subscribe({
  //         next: (orderResponse) => {
  //           if(orderResponse){
  //             this.isSubmitting = false;
  //             this.paymentSuccess = true;
  //             console.log('Order placed successfully');
  //             // Optionally reset the form
  //             this.paymentForm.reset();
  //             this.router.navigate(['/order-success'], {
  //               state: { orderDetails: orderResponse }
  //             });
  //           }
  //           else{
  //             this.isSubmitting = false;
  //             this.paymentError = 'Failed to place order';
  //             console.error('Error in placing order:');
  //           }
  //         },
  //         error: (orderError) => {
  //           // this.isSubmitting = false;
  //           // this.paymentError = 'Failed to place order';
  //           // console.error('Error in placing order:', orderError);
  //         }
  //       });
  //     },
  //     error: (cardError) => {
  //       this.isSubmitting = false;
  //       this.paymentError = 'Failed to save card details';
  //       console.error('Error saving card details:', cardError);
  //     }
  //   });
  // }

}
