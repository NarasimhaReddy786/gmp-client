import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Location, Position, PositionCoordinates, PositionRelations } from './location.model';
import * as _ from 'lodash';
import { LocationDetailsService } from '../injectables/location-details/location-details.service';

@Component({
  selector: 'app-store-location',
  templateUrl: './store-location.component.html',
  styleUrls: ['./store-location.component.css']
})
export class StoreLocationComponent implements OnInit {

  lodash = _;

  files: any;
  imagePath: any;
  imgURL: any;
  message: string;

  locationDetailsFormGroup: FormGroup;
  positionDetailsFormGroup: FormGroup;

  isShowPositionDetailsForm: boolean;
  isShowStartPositionRelationsButton: boolean;
  isFetchPositionRelations: boolean;

  positionDetails: Position[] = new Array() as Position[];
  position: Position;
  positionId: number = 0;


  constructor(private formBuilder: FormBuilder,
    private locationDetailsService: LocationDetailsService) { 
    this.locationDetailsFormGroup = formBuilder.group({
      fcLocationNameInputBox: [null]
    });
    this.positionDetailsFormGroup = formBuilder.group({
      fcPositionNameInputBox: [null],
      fcIsDestinationDropDown: [null]
    });
  }


  ngOnInit() {

  }


  fetchPositionDetails(event: MouseEvent) {
    let positionCoordinates = new PositionCoordinates(event.offsetX, event.offsetY);
    let position = new Position();
    position.position_id = ++this.positionId;
    position.position_coordinates = positionCoordinates;
    this.position = position;
    this.isShowPositionDetailsForm = true;
    this.isShowStartPositionRelationsButton = false;

    var canvas = <HTMLCanvasElement> document.getElementById('myCanvas');
    var ctx = canvas.getContext("2d");
    ctx.font = "30px Arial";
    ctx.fillText(String(this.positionId), event.offsetX, event.offsetY);
  }


  public previewImage(files: any) {
    if (files.length === 0) {
      return;
    }
 
    let mimeType = files[0].type;
    if (mimeType.match(/image\/*/) == null) {
      this.message = "Only images are supported.";
      return;
    }
 
    this.files = files;
    let reader = new FileReader();
    this.imagePath = files;
    reader.readAsDataURL(files[0]); 
    reader.onload = (_event) => { 
      this.imgURL = reader.result; 

      var canvas = <HTMLCanvasElement> document.getElementById('myCanvas');
      var ctx = canvas.getContext("2d");
      var img = new Image();

      img.onload = function(){
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
      };

      img.src = URL.createObjectURL(files[0]);
    }
  }


  public addPosition() {
    if (_.isNil(this.fcPositionNameInputBox.value) || this.fcPositionNameInputBox.value == "" 
        || _.isNil(this.fcIsDestinationDropDown.value) || this.fcIsDestinationDropDown.value == "") {
      this.positionDetailsFormGroup.markAllAsTouched();
      return;
    }
    this.position.position_name = this.fcPositionNameInputBox.value;
    this.position.destination = this.fcIsDestinationDropDown.value === "Yes" ? "Y" : "N";
    this.positionDetails.push(this.position);

    this.fcPositionNameInputBox.patchValue(null);
    this.fcIsDestinationDropDown.patchValue(null);
    this.positionDetailsFormGroup.markAsUntouched();
    this.isShowPositionDetailsForm = false;
    this.isShowStartPositionRelationsButton = true;
  }


  public fetchPositionRelations() {
    this.isShowStartPositionRelationsButton = false;
    this.isFetchPositionRelations = true;
  }


  public savePositionDetails() {
    let location = new Location();
    location.location_name = this.fcLocationNameInputBox.value;
    location.positions = this.positionDetails;
    location.map = this.imgURL;

    this.constructRelatedPosition(location);
    this.performCoordinateCorrections(location);
  
    this.storeLocationDetails(location);
  }


  private constructRelatedPosition(location: Location): void {
    for (let position of location.positions) {
      let relatedPositionString: string = position.position_relations_array;
      let relatedPositionArray: string[] = relatedPositionString.split(' ');
      let position_relations = new Array() as PositionRelations[];
      for (let relatedPositionId of relatedPositionArray) {
        let position_relation = new PositionRelations();
        position_relation.related_position_id = +relatedPositionId;
        position_relations.push(position_relation);
      }
      position.position_relations = position_relations;
    }
  }


  private performCoordinateCorrections(location: Location): void {
    for (let position of location.positions) {

      if (!_.isNil(position.horizontal_to) && position.horizontal_to > 0) {
        for (let positionToFetchCoordinateFrom of location.positions) {
          if (position.horizontal_to === positionToFetchCoordinateFrom.position_id) {
            position.position_coordinates.y = positionToFetchCoordinateFrom.position_coordinates.y;
          }
        }
      }

      if (!_.isNil(position.vertical_to) && position.vertical_to > 0) {
        for (let positionToFetchCoordinateFrom of location.positions) {
          if (position.vertical_to === positionToFetchCoordinateFrom.position_id) {
            position.position_coordinates.x = positionToFetchCoordinateFrom.position_coordinates.x;
          }
        }
      }

    }
  }


  private storeLocationDetails(location: Location): void {
    this.locationDetailsService.storeLocationDetails(location).then(destinationListResponse => {
      console.log(destinationListResponse);
    }, error => {
      console.log('StoreLocationComponent : Error while performing LocationDetailsService storeLocationDetails operation', error);
    });
  }


  get fcLocationNameInputBox(): FormControl {
    return this.locationDetailsFormGroup.get('fcLocationNameInputBox') as FormControl;
  }
  get fcPositionNameInputBox(): FormControl {
    return this.positionDetailsFormGroup.get('fcPositionNameInputBox') as FormControl;
  }
  get fcIsDestinationDropDown(): FormControl {
    return this.positionDetailsFormGroup.get('fcIsDestinationDropDown') as FormControl;
  }

}
