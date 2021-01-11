import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DestinationDetails } from '../injectables/destination/destination.model';
import { DestinationService } from '../injectables/destination/destination.service';
import { RouteMapService } from '../injectables/route-map/route-map.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-path-search',
  templateUrl: './path-search.component.html',
  styleUrls: ['./path-search.component.css']
})
export class PathSearchComponent implements OnInit {

  urlPath: string;

  destinationDetails: DestinationDetails;

  routeMap: any;  

  pathSearchFormGroup: FormGroup;

  readonly FETCH_SUCCESS = 'FETCH_SUCCESS';
  readonly FETCH_FAILURE = 'FETCH_FAILURE';

  destinationListFetchStatus: string = null;
  routeMapFetchAllStatus: string = null;
  routeMapFetchStatus: string = null;


  constructor(private router: Router,
    private destinationService: DestinationService,
    private routeMapService: RouteMapService,
    private formBuilder: FormBuilder) {
      this.pathSearchFormGroup = formBuilder.group({
        fcDestinationDropDown: [null]
      });
    }


  ngOnInit() {
    this.urlPath = this.router.url;

    let urlArray: string[] = this.urlPath.split('/');

    this.fetchDestinationList(urlArray[2], urlArray[3]);
  }


  /** Fetches the Destinations */
  private fetchDestinationList(locationId: string, positionId: string): void {
    this.destinationService.destinationList(locationId, positionId).then(destinationListResponse => {
      this.destinationDetails = destinationListResponse;
      this.destinationListFetchStatus = this.FETCH_SUCCESS;
    }, error => {
      console.log('PathSearchComponent : Error while performing DestinationService destinationList operation', error);
      this.destinationListFetchStatus = this.FETCH_FAILURE;
    });
  }


  /** Fetches the Route Map */
  public fetchRouteMap(pathType: string): void {

    this.routeMap = null;
    this.routeMapFetchAllStatus = null;
    this.routeMapFetchStatus = null;

    if (_.isNil(this.destinationDetails) || _.isNil(this.destinationDetails.location) || _.isNil(this.destinationDetails.location.locationId)
        || _.isNil(this.destinationDetails.source) || _.isNil(this.destinationDetails.source.positionId)
        || _.isNil(this.fcDestinationDropDown.value)) {
      return;
    }

    this.routeMapService.routeMapFetch(this.destinationDetails.location.locationId, this.destinationDetails.source.positionId, this.fcDestinationDropDown.value, pathType).subscribe(data => {
      this.createRouteMapImageFromBlob(data);
      pathType === 'A' ? this.routeMapFetchAllStatus = this.FETCH_SUCCESS : this.routeMapFetchStatus = this.FETCH_SUCCESS;
    }, error => {
      console.log('PathSearchComponent : Error while performing RouteMapService routeMapFetch operation', error);
      pathType === 'A' ? this.routeMapFetchAllStatus = this.FETCH_FAILURE : this.routeMapFetchStatus = this.FETCH_FAILURE;
    });
  }


  /** Convers Blob to Image */
  private createRouteMapImageFromBlob(image: Blob): void {
    let fileReader = new FileReader();
    fileReader.addEventListener("load", () => { this.routeMap = fileReader.result; }, false);
    if (image) {
       fileReader.readAsDataURL(image);
    }
  }


  get fcDestinationDropDown(): FormControl {
    return this.pathSearchFormGroup.get('fcDestinationDropDown') as FormControl;
  }
}
