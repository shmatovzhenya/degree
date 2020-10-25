import { MemberId, DefaultMember } from '../Member';
import { Duration } from '../Duration';

type Estimate = {
  member: MemberId;
  estimation: Duration;
};

type Options = {
  estimation?: Duration;
  estimationList?: Estimate[];
};

class Estimation {
  #list: Estimate[] = [];

  constructor(options: Options) {
    if (options.estimation) {
      this.#list = [{
        member: DefaultMember.id,
        estimation: options.estimation,
      }];
    }

    if (options.estimationList) {
      this.#list = options.estimationList;
    }
  }

  get report(): Estimate[] {
    return this.#list;
  }
}

export {
  Estimation,
  Estimate,
}
