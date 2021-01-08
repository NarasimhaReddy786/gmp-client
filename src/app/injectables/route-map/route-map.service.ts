import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class RouteMapService {

  readonly baseUrl: string = 'https://gmp-be.herokuapp.com';
  readonly routeMapFetchUri = '/shortest_path';


  constructor(private httpClient: HttpClient) { }


  routeMapFetch(locationId: number, sourcePositionId: number, destinationPositionId: number, pathType: string): Observable<Blob> {
    return this.httpClient.get(this.baseUrl + this.routeMapFetchUri + '/' + locationId.toString() + '/' + sourcePositionId.toString() + '/' + destinationPositionId.toString() + '/' + pathType
      + '/' + Math.random().toString(), { responseType: 'blob' });
  }

}
