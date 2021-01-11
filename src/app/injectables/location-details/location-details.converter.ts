import { Location } from '../destination/destination.model';
import * as _ from 'lodash';

export class LocationDetailsConverter {

    static convertLocationDetailsWsToModel(locationsWs: any): Location[] {
        if (_.isNil(locationsWs)) {
            return null;
        }

        let locationsModel = new Array() as Location[];
        for (let locationWs of locationsWs.locations) {
            let locationModel = new Location(locationWs.location_id, locationWs.location_name);
            locationsModel.push(locationModel);
        }

        return locationsModel;
    }
}