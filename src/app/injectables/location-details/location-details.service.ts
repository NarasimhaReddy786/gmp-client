import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Location } from 'src/app/store-location/location.model';
import { Location as LocationWithId} from '../destination/destination.model';
import { LocationDetailsConverter } from './location-details.converter';

@Injectable({
  providedIn: 'root'
})
export class LocationDetailsService {

  readonly baseUrl: string = 'https://gmp-be.herokuapp.com';
  readonly storeLocationDetailsUri = '/store_location';
  readonly readLocationNamesUri = '/get_location_names';

  constructor(private httpClient: HttpClient) { }

  storeLocationDetails(location: Location): Promise<void> {
    return new Promise<void>((resolve, reject) => {

      this.httpClient.post<any>(this.baseUrl + this.storeLocationDetailsUri, location).toPromise().then(response => {
        resolve(response);
      }, error => {
        reject("seviceError");
      });

    });
  }

  readLocationNames(): Promise<LocationWithId[]> {
    return new Promise<LocationWithId[]>((resolve, reject) => {
      this.httpClient.get<any>(this.baseUrl + this.readLocationNamesUri).toPromise().then(response => {
        resolve(LocationDetailsConverter.convertLocationDetailsWsToModel(response));
      }, error => {
        reject("seviceError");
      });
    });
  }
}
