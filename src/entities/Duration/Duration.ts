type Options = {
  years?: number;
  months?: number;
  weeks?: number;
  days?: number;
  hours?: number;
  minutes?: number;
};

class Duration {
  #years?: number;
  #months?: number;
  #weeks?: number;
  #days?: number;
  #hours?: number;
  #minutes?: number;

  constructor(options?: Options) {
    this.#years = options && options.years ? options.years : 0;
    this.#months = options && options.months ? options.months : 0;
    this.#weeks = options && options.weeks ? options.weeks : 0;
    this.#days = options && options.days ? options.days : 0;
    this.#hours = options && options.hours ? options.hours : 0;
    this.#minutes = options && options.minutes ? options.minutes : 0;
  }

  isEmpty(): boolean {
    if (!this.#years && !this.#months && !this.#weeks && !this.#days && !this.#hours && !this.#minutes) {
      return true;
    }

    return false;
  }

  concat(another: Duration): void {
    this.#years += another.years;
    this.#months += another.months;
    this.#weeks += another.weeks;
    this.#days += another.days;
    this.#hours += another.hours;
    this.#minutes += another.minutes;
  }

  substitute(another: Duration): void {
    this.#years = this.#years - another.years > 0 ? this.#years - another.years : 0;
    this.#months = this.#months - another.months > 0 ? this.#months - another.months : 0;
    this.#weeks = this.#weeks - another.weeks > 0 ? this.#weeks - another.weeks : 0;
    this.#days = this.#days - another.days > 0 ? this.#days - another.days : 0;
    this.#hours = this.#hours - another.hours > 0 ? this.#hours - another.hours : 0;
    this.#minutes = this.#minutes - another.minutes > 0 ? this.#minutes - another.minutes : 0;
  }

  get years(): number {
    return this.#years;
  }

  get months(): number {
    return this.#months;
  }

  get weeks(): number {
    return this.#weeks;
  }

  get days(): number {
    return this.#days;
  }

  get hours(): number {
    return this.#hours;
  }

  get minutes(): number {
    return this.#minutes;
  }

  toString(): string {
    let result: string = '';

    if (this.#years) {
      result += `${this.#years} лет`;
    }

    if (this.#months) {
      result += `${this.#months} месяцев`;
    }

    if (this.#weeks) {
      result += `${this.#weeks} недель`;
    }

    if (this.#hours) {
      result += `${this.#hours} часов`;
    }

    if (this.#minutes) {
      result += `${this.#minutes} минут`;
    }

    return result;
  }
}

export {
  Duration,
  Options,
}
