import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DestinationsConverter } from './destination.converter';
import { DestinationDetails } from './destination.model';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {

  readonly baseUrl: string = 'https://gmp-be.herokuapp.com';
  readonly destinationListUri = '/destination_list';

  constructor(private httpClient: HttpClient) { }

  destinationList(locationId: string, positionId: string): Promise<DestinationDetails> {
    return new Promise<DestinationDetails>((resolve, reject) => {

      this.httpClient.get<any>(this.baseUrl + this.destinationListUri + '/' + locationId + '/' + positionId).toPromise().then(response => {
        resolve(DestinationsConverter.convertDestinationsWsToModel(response));
      }, error => {
        reject("seviceError");
      });

    });
  }
}
