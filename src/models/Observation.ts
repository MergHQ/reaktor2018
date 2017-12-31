export enum Location {
  Tokyo,
  Helsinki,
  NY,
  Amsterdam,
  Dubai
}

export class Observation {
  id: string;
  location: number;
  locationStr?: string;
  temperature: number;

  constructor(obj?: any) {
    Object.keys(obj).forEach(key => {
      this[key] = obj[key]
    });

    this.locationStr = Location[this.location];
  }
}