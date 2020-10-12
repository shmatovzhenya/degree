import { MemberId, DefaultMember } from '../Member';
import { UserRoleBuilder } from '../UserRole';

type Estimate = {
  member: MemberId;
  estimation: Date;
};

type Options = {
  estimation?: Date;
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
}
