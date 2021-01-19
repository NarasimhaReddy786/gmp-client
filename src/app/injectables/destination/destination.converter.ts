import { DestinationDetails, Location, Position } from './destination.model';
import * as _ from 'lodash';

export class DestinationsConverter {

    static convertDestinationsWsToModel(destinationsWs: any): DestinationDetails {
        if (_.isNil(destinationsWs)) {
            return null;
        }

        let destinationDetails = new DestinationDetails();

        if (!_.isNil(destinationsWs.location)) {
            let location = new Location(destinationsWs.location.locationId, destinationsWs.location.locationName);
            destinationDetails.location = location;
        }
        
        if (!_.isNil(destinationsWs.source)) {
            let source = new Position(destinationsWs.source.positionId, destinationsWs.source.positionName);
            destinationDetails.source = source;
        }
        
        if (!_.isNil(destinationsWs.detinations) && !_.isEmpty(destinationsWs.detinations)) {
            let destinations = new Array as Position[];
            for (let destination of destinationsWs.detinations) {
                let destinationModel = new Position(destination.positionId, destination.positionName);
                destinations.push(destinationModel);
            }
            destinationDetails.destinationList = destinations;
        }

        if (!_.isNil(destinationsWs.amenities) && !_.isEmpty(destinationsWs.amenities)) {
            let amenities = new Array as Position[];
            for (let amenity of destinationsWs.amenities) {
                let amenityModel = new Position(amenity.positionId, amenity.positionName);
                amenities.push(amenityModel);
            }
            destinationDetails.amenitiesList = amenities;
        }

        return destinationDetails;
    }
}