export class Location {
    location_name: string;
    positions: Position[];
    map: any;
}

export class Position {
    position_id: number;
    position_name: string;
    position_coordinates: PositionCoordinates;
    destination: string;
    position_relations: PositionRelations[];
    position_relations_array: any;
    horizontal_to: number;
    vertical_to: number;
}

export class PositionCoordinates {
    x: number;
    y: number;
    constructor(xParam?: number, yParam?: number) {
        this.x = xParam;
        this.y = yParam;
    }
}

export class PositionRelations {
    related_position_id: number;
}