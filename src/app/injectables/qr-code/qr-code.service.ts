import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {

  readonly baseUrl: string = 'https://gmp-be.herokuapp.com';
  readonly generateQrCodesUri = '/get_qr_codes';


  constructor(private httpClient: HttpClient) { }


  generateQrCodes(locationId: number) {
    return this.httpClient.get(this.baseUrl + this.generateQrCodesUri + '/' + locationId, {
      responseType: 'arraybuffer'
    });
  }
  
}
