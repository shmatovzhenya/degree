import { UserRole } from './UserRole';

type Role = Record<string, UserRole>
const defaultRole = new UserRole('DEFAULT');

class Builder {
  #roles: Role = {};

  getOrCreate(name: string): UserRole {
    if (!(name in this.#roles)) {
      this.#roles[name] = new UserRole(name);
    }

    return this.#roles[name];
  }

  getDefaultRole(): UserRole {
    return defaultRole;
  }
}

export {
  Builder,
};
