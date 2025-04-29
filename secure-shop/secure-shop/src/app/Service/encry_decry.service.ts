import { Injectable } from "@angular/core";
import * as CryptoJs from "crypto-js";

@Injectable({
    providedIn: 'root' ,
})

export class EncryptionService{
    private readonly EncryptionKey = 'Your_Encrypted_data';

    constructor(){}

    encrypt(data: string) : string {
        try {
            return CryptoJs.AES.encrypt(data, this.EncryptionKey).toString();
        } catch(error){
            console.error('Encryption failed  : ' , error);
            return '';
        }
    }

    decrypt(encrypted_data: string) : string {
        try {
            const bytes =  CryptoJs.AES.decrypt(encrypted_data, this.EncryptionKey);
            return bytes.toString(CryptoJs.enc.Utf8);
        } catch(error){
            console.error('Decryption failed  : ' , error);
            return '';
        }
    }
}