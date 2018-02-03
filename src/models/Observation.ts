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
  createdAt: Date;

  constructor(obj?: any) {
    Object.keys(obj).forEach(key => {
      this[key] = obj[key]
    });
    if (obj.createdAt) {
      this.createdAt = new Date(obj.createdAt);
    }
  }
}

export class LocationObservations {
  location: number;
  maxTemp: number;
  minTemp: number;

  /**
   * As I write this constructor, I really regret that I didn't
   * use a SQL database. Sorting all this stuff here is really painful
   * and the time it will take to process this will increase quite alot when
   * the data increases since O(n^2).
   * @param rawObservations 
   */
  constructor(rawObservations: Observation[]) {
    rawObservations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    this.location = rawObservations.length ? rawObservations[0].location : 0;
    rawObservations.sort((a, b) => b.temperature - a.temperature);
    this.maxTemp = rawObservations.length ? rawObservations[0].temperature : 0;
    this.minTemp = rawObservations.length ? rawObservations[rawObservations.length - 1].temperature : 0;
  }
}