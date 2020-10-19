import { nanoid } from 'nanoid';
import { isSameMonth } from 'date-fns';

import { Flavor } from '../../types';
import { Duration } from '../Duration';
import { Period } from '../Period';
import { Estimation } from '../Estimation';
import { MemberId } from '../Member';
import { th } from 'date-fns/locale';

type TaskId = Flavor<string, 'TaskId'>;

type Optional = {
  billedHours?: Duration;
  isBillable?: boolean;
};

type TimeReport = {
  worked: Duration;
  billed: Duration;
  overtimed: Duration;
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

  get estimation(): Estimation {
    return this.#estimation;
  }

  get billedHours(): Duration {
    return this.#billedHours;
  }

  get name(): string {
    return this.#name;
  }

  set billable(isBillable: boolean) {
    this.#billable = isBillable;
  }

  addWorkingPeriod(period: Period): void {
    this.#periods.push(period);
  }

  addWorkingPeriods(periods: Period[]): void {
    periods.forEach((period) => {
      this.#periods.push(period);
    });
  }

  getWorkedHoursByMemberIdInMonth(id: MemberId, month?: Date): TimeReport {
    const date = month ? month : new Date();
    const source: TimeReport = {
      worked: new Duration(),
      billed: new Duration(),
      overtimed: new Duration(),
    };

    const result: TimeReport = this.#periods.filter((period) => {
      return period.memberId === id && isSameMonth(period.startDate, date);
    }).reduce((result: TimeReport, item: Period): TimeReport => {
      result.billed.concat(item.billedHours);
      result.worked.concat(item.workedHours);
      result.overtimed.concat(item.overTime);

      return result;
    }, source);

    return result;
  }

  getUnbilledTimePerMonth(month?: Date): Duration {
    const result = new Duration();

    if (this.#billable) {
      this.#periods.reduce((result, item): Duration => {
        const duration = new Duration(item.workedHours);
        
        duration.substitute(item.billedHours);
        result.concat(duration);

        return result;
      }, result);
    } else {
      this.#periods.reduce((result, item): Duration => {
        const duration = new Duration(item.workedHours);
        
        result.concat(duration);

        return result;
      }, result);
    }

    return result;
  }

  getOvertimedHoursInMonth(month: Date = new Date()): Duration {
    if (!this.#billable) {
      return new Duration();
    }

    const result = new Duration();

    this.#periods.forEach(period => {
      result.concat(period.overTime);
    });

    return result;
  }

  getUnbilledTimePerUserInMonth(id: MemberId, month?: Date): Duration {
    const dump: TimeReport = this.getWorkedHoursByMemberIdInMonth(id, month);

    if (!this.#billable) {
      return dump.worked;
    }

    const nextDump = new Duration(dump.worked);
    nextDump.substitute(dump.billed);

    return nextDump;
  }

  getOvertimedPerUserInMonth(id: MemberId, month?: Date): Duration {
    if (!this.#billable) {
      return new Duration();
    }

    const dump: TimeReport = this.getWorkedHoursByMemberIdInMonth(id, month);

    return dump.overtimed;
  }

  hasUserOvertimedInMonth(id: MemberId, month?: Date): boolean {
    const dump: TimeReport = this.getWorkedHoursByMemberIdInMonth(id, month);
    
    return dump.overtimed.isEmpty();
  }
}

export {
  Task, TimeReport,
};
