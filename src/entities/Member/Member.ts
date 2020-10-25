import { uniqueId } from '../utils/uniqueId';
import { Flavor } from '../../types'

type MemberId = Flavor<string, 'MemberId'>;

class Member {
  #id: MemberId;
  #firstName: string;
  #secondName: string;

  constructor(firstName: string, secondName: string) {
    this.#id = uniqueId();
    this.#firstName = firstName;
    this.#secondName = secondName;
  }

  get id(): MemberId {
    return this.#id;
  }

  get fullName(): string {
    return `${this.#firstName} ${this.#secondName}`;
  }

  getOverTimed(): void {}
}

const DefaultMember = new Member('', '');

export {
  MemberId,
  DefaultMember,
  Member,
};
