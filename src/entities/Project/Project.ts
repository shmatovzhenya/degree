import { UserRoleBuilder } from '../UserRole';
import { Task } from '../Task';
import { MemberId, Member } from '../Member';
import { Duration } from '../Duration';

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

  addTasksList(taskList: Task[]): void {
    this.#taskList.concat(taskList);
  }

  addMembers(memberList: Member[]): void {
    this.#memberList.concat(memberList);
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
          roles[role].concat(task.getWorkedHoursByMemberIdInMonth(member.id).overtimed);
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
          roles[role].concat(task.getUnbilledTimePerUserInMonth(member.id));
        });
      });
    });

    return roles;
  } 
}

export {
  Project,
};
