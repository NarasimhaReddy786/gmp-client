import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from 'src/app/store-location/location.model';

@Injectable({
  providedIn: 'root'
})
export class LocationDetailsService {

  readonly baseUrl: string = 'http://127.0.0.1:5000';
  readonly storeLocationDetailsUri = '/store_location';

  constructor(private httpClient: HttpClient) { }

  storeLocationDetails(location: Location): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      this.httpClient.post<any>(this.baseUrl + this.storeLocationDetailsUri, location).toPromise().then(response => {
        console.log(response);
      }, error => {
        reject("seviceError");
      });

    });
  }
}
