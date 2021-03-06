import { UserRoleBuilder } from '../UserRole';
import { Task } from '../Task';
import { MemberId, Member } from '../Member';
import { Duration } from '../Duration';
import { Estimate } from '../Estimation';

type UserRole = ReturnType<typeof UserRoleBuilder.prototype.getOrCreate>;

type Worker = {
  role: UserRole;
  member: Member;
};

class Project {
  #name: string;
  #taskList: Task[] = [];
  #memberList: Member[] = [];
  #relations: Worker[] = [];
  #byRoles: Record<string, Member[]> = {};

  constructor(name: string) {
    this.#name = name;
  }

  get name(): string {
    return this.#name;
  }

  get membersList(): string[] {
    return this.#memberList.map(member => member.fullName);
  }

  get taskNames(): string[] {
    return this.#taskList.map(task => task.name);
  }

  getMemberByFullName(name: string): Member {
    return this.#memberList
      .filter(member => member.fullName === name)[0] || this.#memberList[0];
  }

  getTaskByName(name: string): Task {
    return this.#taskList.find(task => task.name === name) || this.#taskList[0];
  }

  addTasksList(taskList: Task[]): void {
    this.#taskList = this.#taskList.concat(taskList);
  }

  addMembers(memberList: Member[]): void {
    this.#memberList = this.#memberList.concat(memberList);
  }

  addMemberToRoleRelation(member: Member, role: UserRole): void {
    this.#relations.push({
      role, member,
    });

    if (!(role.name in this.#byRoles)) {
      this.#byRoles[role.name] = [];
    }

    this.#byRoles[role.name].push(member);
  }

  getUnbillableTimeForProjectByMonth(month: Date = new Date()): Duration {
    const duration = new Duration();

    this.#taskList.forEach(task => {
      duration.concat(task.getUnbilledTimePerMonth(month));
    });

    return duration;
  }

  getSummaryOvertimeInMonth(month: Date = new Date()): Duration {
    const duration = new Duration();

    this.#taskList.forEach(task => {
      duration.concat(task.getOvertimedHoursInMonth(month));
    });

    return duration;
  }

  getWorkedHoursInMonth(month: Date = new Date()): Duration {
    const duration = new Duration();

    this.#taskList.forEach(task => {
      duration.concat(task.getWorkedHoursPerMonth(month));
    });

    return duration;
  }

  getWorkedTimesByRolesPerMonth(month: Date = new Date()): Record<string, Duration> {
    const roles: Record<string, Duration> = {};

    Object.keys(this.#byRoles).forEach(role => {
      roles[role] = new Duration();

      this.#byRoles[role].forEach((member) => {
        this.#taskList.forEach(task => {
          roles[role].concat(task.getWorkedHoursByMemberIdInMonth(member.id).billed);
        });
      });
    });

    return roles;
  }

  getOvertimedTimesByRolesPerMonth(month: Date = new Date()): Record<string, Duration> {
    const roles: Record<string, Duration> = {};

    Object.keys(this.#byRoles).forEach(role => {
      roles[role] = new Duration();

      this.#byRoles[role].forEach((member) => {
        this.#taskList.forEach(task => {
          roles[role].concat(task.getWorkedHoursByMemberIdInMonth(member.id, month).overtimed);
        });
      });
    });

    return roles;
  }

  getOverEstimatedTimesByRolesPerMonth(month: Date = new Date()): Record<string, Duration> {
    const roles: Record<string, Duration> = {};

    Object.keys(this.#byRoles).forEach(role => {
      roles[role] = new Duration();

      this.#byRoles[role].forEach((member) => {
        this.#taskList.forEach(task => {
          const worked = task.getWorkedHoursByMemberIdInMonth(member.id, month);

          roles[role].concat(worked.worked);
          roles[role].substitute(worked.billed);
        });
      });
    });

    return roles;
  }

  getUnBilledTimesByRolesPerMonth(month: Date = new Date()): Record<string, Duration> {
    const roles: Record<string, Duration> = {};

    Object.keys(this.#byRoles).forEach(role => {
      roles[role] = new Duration();

      this.#byRoles[role].forEach((member) => {
        this.#taskList.forEach(task => {
          roles[role].concat(task.getUnbilledTimePerUserInMonth(member.id, month));
        });
      });
    });

    return roles;
  } 
}

export {
  Project,
};
