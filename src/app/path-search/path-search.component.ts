import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { DestinationDetails, Position } from '../injectables/destination/destination.model';
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

  allPositions: Position[] = [];

  routeMap: any;  

  pathSearchFormGroup: FormGroup;

  readonly FETCH_SUCCESS = 'FETCH_SUCCESS';
  readonly FETCH_FAILURE = 'FETCH_FAILURE';

  destinationListFetchStatus: string = null;
  routeMapFetchAllStatus: string = null;
  routeMapFetchStatus: string = null;

  pathType: string;


  constructor(private router: Router,
    private destinationService: DestinationService,
    private routeMapService: RouteMapService,
    private formBuilder: FormBuilder) {
      this.pathSearchFormGroup = formBuilder.group({
        fcSourceDropDown: [null, [this.sourceAndDestinationValidator()]],
        fcDestinationDropDown: [null, [this.sourceAndDestinationValidator()]]
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

      this.allPositions.push(this.destinationDetails.source);
      this.allPositions = this.allPositions.concat(this.destinationDetails.destinationList);

      this.fcSourceDropDown.patchValue(this.destinationDetails.source.positionId);

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

    this.pathSearchFormGroup.markAllAsTouched();

    if (_.isNil(this.destinationDetails) || _.isNil(this.destinationDetails.location) || _.isNil(this.destinationDetails.location.locationId)
        || _.isNil(this.fcSourceDropDown.value)
        || _.isNil(this.fcDestinationDropDown.value)
        || this.fcSourceDropDown.value === this.fcDestinationDropDown.value) {
      return;
    }

    this.fcSourceDropDown.setErrors(null);
    this.fcDestinationDropDown.setErrors(null);

    this.routeMapService.routeMapFetch(this.destinationDetails.location.locationId, this.fcSourceDropDown.value, this.fcDestinationDropDown.value, pathType).subscribe(data => {
      this.createRouteMapImageFromBlob(data);
      pathType === 'A' ? this.routeMapFetchAllStatus = this.FETCH_SUCCESS : this.routeMapFetchStatus = this.FETCH_SUCCESS;
      this.pathType = pathType;
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


  public goToAmenity(position: Position): void {
    this.fcDestinationDropDown.patchValue(position.positionId);
    this.fetchRouteMap('S');
  }


  sourceAndDestinationValidator(): ValidatorFn {  
    return (control: AbstractControl): { [key: string]: any } | null =>  {
      if (!_.isNil(control.value) && !_.isNil(this.fcSourceDropDown) && !_.isNil(this.fcSourceDropDown.value) && !_.isNil(this.fcDestinationDropDown) && this.fcDestinationDropDown.value) {
        if (this.fcSourceDropDown.value === this.fcDestinationDropDown.value)
          return { sourceAndDestinationAreSame: true }
      }
      return null;
    }
  }


  get fcSourceDropDown(): FormControl {
    return this.pathSearchFormGroup.get('fcSourceDropDown') as FormControl;
  }
  get fcDestinationDropDown(): FormControl {
    return this.pathSearchFormGroup.get('fcDestinationDropDown') as FormControl;
  }
}
