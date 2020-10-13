import { nanoid } from 'nanoid';
import { isSameMonth } from 'date-fns';

import { Flavor } from '../../types';
import { Duration } from '../Duration';
import { Period } from '../Period';
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
    const dump: TimeReport = this.getWorkedHoursByMemberIdInMonth(id, month);

    return dump.overtimed;
  }

  hasUserOvertimedInMonth(id: MemberId, month?: Date): boolean {
    const dump: TimeReport = this.getWorkedHoursByMemberIdInMonth(id, month);
    
    return dump.overtimed.isEmpty();
  }
}
