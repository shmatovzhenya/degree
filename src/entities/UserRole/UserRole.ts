class UserRole {
  #roleName: string;

  constructor(role: string) {
    this.#roleName = role;
  }

  get name(): string {
    return this.#roleName;
  }
}

export {
  UserRole,
};
