import {Injectable} from "@angular/core";
import {environment} from "@environments/environment";
import {HttpClient} from "@angular/common/http";
import {CreditCard} from "../Model/CreditCard";
import {EncryptionService} from "./encry_decry.service";
import {catchError, map, Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class CreditCardService {
  private apiUrl = environment.apiUrl + '/user/cards';

  constructor(private http: HttpClient,private encryption :EncryptionService) {
  }
  addCard(card:CreditCard) {
   card.cvv = this.encryption.encrypt(card.cvv)
    card.encryptedCardNumber = this.encryption.encrypt(card.encryptedCardNumber);
    return this.http.post<Boolean>(`${this.apiUrl}/addcard`,card ).pipe();
  }
  getCardNumber(): Observable<string> {
    return this.http.get(`${this.apiUrl}/getCardNumber`, {
      responseType: 'text'  // Explicitly set response type
    }).pipe(
      map(response => {
        // Add response validation if needed
        if (!response) {
          throw new Error('Empty response received');
        }
        return response;
      }),
      catchError(error => {
        console.error('Error fetching card:', error);
        // Return a default value or rethrow
        return of(''); // or throwError(error) to propagate
      })
    );
  }
}
