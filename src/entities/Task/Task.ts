import { nanoid } from 'nanoid';

import { Flavor } from '../../types';
import { Period, Duration } from '../Period';
import { Estimation } from '../Estimation';
import { MemberId } from '../Member';

type TaskId = Flavor<string, 'TaskId'>;

type Optional = {
  billedHours?: Duration;
  isBillable?: boolean;
};

type TimeReport = {
  worked: Duration;
  billed: Duration;
  overtimed?: Duration;
};

class Task {
  #id: TaskId;
  #name: string;
  #estimation: Estimation;
  #billedHours: Duration;
  #billable: boolean = true;
  #periods: Period[] = [];

  constructor(name: string, estimation: Estimation, optional: Optional) {
    this.#id = nanoid();
    this.#name = name;
    this.#estimation = estimation;

    if (optional) {
      const { billedHours } = optional;

      this.#billedHours = billedHours ? billedHours : null;

      if ('isBillable' in optional) {
        this.#billable = optional.isBillable;
      }
    }
  }

  get id(): string {
    return this.#id;
  }

  get name(): string {
    return this.#name;
  }

  addWorkingPeriod(period: Period): void {
    this.#periods.push(period);
  }

  addWorkingPeriods(periods: Period[]): void {
    periods.forEach((period) => {
      this.#periods.push(period);
    });
  }

  // getWorkedHoursByMemberId(id: MemberId): TimeReport {
  //   const result: TimeReport = {
  //   };

  //   this.#periods.filter((period) => {
  //     return period.memberId === id;
  //   }).reduce((result, item) => {
  //     result.billed
  //   }, result);
  // }
}
