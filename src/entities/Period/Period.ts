import { nanoid } from 'nanoid';

import { Flavor } from '../../types';
import { MemberId } from '../Member';
import { Duration } from '../Duration';

type PeriodId = Flavor<string, 'PeriodId'>;

type Optional = {
  comment?: string;
  billedHours?: Duration;
  overTimedHours?: Duration;
};

class Period {
  #id: PeriodId;
  #startDate: Date;
  #workedHours: Duration;
  #billedHours: Duration;
  #overTime: Duration;
  #comment: string;
  #memberId: MemberId;

  constructor(startDate: Date, workedHours: Duration, memberId: MemberId, optional?: Optional) {
    this.#id = nanoid();
    this.#startDate = startDate;
    this.#workedHours = workedHours;
    this.#memberId = memberId;

    if (optional) {
      const { billedHours, comment, overTimedHours } = optional;

      this.#comment = comment ? comment : '';
      this.#billedHours = billedHours ? billedHours : workedHours;
      this.#overTime = overTimedHours ? overTimedHours : null;
    }
  }

  get id(): PeriodId {
    return this.#id;
  }

  get memberId(): string {
    return this.#memberId;
  }

  get startDate(): Date {
    return this.#startDate;
  }

  get workedHours(): Duration {
    return this.#workedHours;
  }

  get comment(): string {
    return this.#comment;
  }

  get overTime(): Duration {
    return this.#overTime;
  }

  get billedHours(): Duration {
    return this.#billedHours;
  }

  get hasOvertime(): boolean {
    return !!this.#overTime;
  }
}

export {
  Period,
};
