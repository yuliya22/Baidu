export class QueryRouteTruck {//origin,destination,waypoints
    origin: {
      lat: string|number,
      lng: string|number,
    };
    waypoints:[any];
    destination: {
      lat: string|number,
      lng: string|number,
    };
}
