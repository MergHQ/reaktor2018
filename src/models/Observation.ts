export enum Location {
  Tokyo,
  Helsinki,
  NY,
  Amsterdam,
  Dubai
}


export class Observation {
  id: number;
  location: number;
  locationStr?: string;
  temperature: number;
  ip: string;
  timestamp: Date;

  constructor(obj?: any) {
    Object.keys(obj).forEach(key => {
      this[key] = obj[key]
    });
  }

  locationToString(): string {
    return this.location.toString();
  }
}