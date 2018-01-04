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
  temperature: number;

  constructor(obj?: any) {
    Object.keys(obj).forEach(key => {
      this[key] = obj[key]
    });
  }
}