import { Component, OnInit } from '@angular/core';
import { LocationDetailsService } from '../injectables/location-details/location-details.service';
import { Location as LocationWithId } from '../injectables/destination/destination.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { QrCodeService } from '../injectables/qr-code/qr-code.service';

@Component({
  selector: 'app-qr-code-generator',
  templateUrl: './qr-code-generator.component.html',
  styleUrls: ['./qr-code-generator.component.css']
})
export class QrCodeGeneratorComponent implements OnInit {

  existingLocationsArray: LocationWithId[];

  locationFormGroup: FormGroup;

  qrCodeGenerationStatus: string = null;

  readonly SUCCESS = 'SUCCESS';
  readonly FAILURE = 'FAILURE';


  constructor(private locationDetailsService: LocationDetailsService,
    private qrCodeService: QrCodeService,
    private formBuilder: FormBuilder) {
    this.locationFormGroup = formBuilder.group({
      fcLocationNameDropDown: [null]
    }); 
  }


  ngOnInit() {
    this.locationDetailsService.readLocationNames().then(locationNamesResponse => {
      this.existingLocationsArray = locationNamesResponse;
    }, error => {
      console.log('QrCodeGeneratorComponent : Error while performing LocationDetailsService readLocationNames operation', error);
    });
  }


  public generateQrCode(): void {
    this.qrCodeService.generateQrCodes(this.fcLocationNameDropDown.value).subscribe(data => {
      const blob = new Blob([data], {
        type: 'application/zip'
      });
      const url = window.URL.createObjectURL(blob);
      window.open(url);
      this.qrCodeGenerationStatus = this.SUCCESS;
    }, error => {
      this.qrCodeGenerationStatus = this.FAILURE;
    });
  }


  get fcLocationNameDropDown(): FormControl {
    return this.locationFormGroup.get('fcLocationNameDropDown') as FormControl;
  }

}
