/* -------------------------------------- */

export class RoutesHeaderEntity {
  transport_id: number;
  origin_id: number;
  destination_id: number;
  zone_id: number;
  time_started: Date;
  time_end: Date;
  routesDetails: RoutesDetailsEntity[];

  constructor(
    transport_id: number,
    origin_id: number,
    destination_id: number,
    zone_id: number,
    routesDetails: RoutesDetailsEntity[],
  ) {
    this.transport_id = transport_id;
    this.origin_id = origin_id;
    this.destination_id = destination_id;
    this.zone_id = zone_id;
    this.routesDetails = routesDetails;
  }
}

/* ------------ */

export class RoutesDetailsEntity {
  order_id: number;

  constructor(order_id: number) {
    this.order_id = order_id;
  }
}

/* ------------ */