export class DestinationDetails {
    location: Location;
    source: Position;
    destinationList: Position[];
}

export class Location {
    locationId: number;
    locationName: string;
    constructor(locationId?: number, locationName?: string) {
        this.locationId = locationId;
        this.locationName = locationName;
    }
}

export class Position {
    positionId: number;
    positionName: string;
    constructor(positionId?: number, positionName?: string) {
        this.positionId = positionId;
        this.positionName = positionName;
    }
}