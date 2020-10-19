import {  } from '../UserRole';
import { Task } from '../Task';
import { MemberId, Member } from '../Member';
import { Duration } from '../Duration';

type Worker = {};

class Project {
  #name: string;
  #taskLis: Task[] = [];
  #memberList: Member[] = [];

  constructor(name: string) {
    this.#name = name;
  }

  addTasksList(taskList: Task[]): void {
    this.#taskLis.concat(taskList);
  }

  addMembers(memberList: Member[]): void {
    this.#memberList.concat(memberList);
  }

  getUnbillableTimeForProjectByMonth(month: Date = new Date()): Duration {
    const duration = new Duration();

    this.#taskLis.forEach(task => {
      duration.concat(task.getUnbilledTimePerMonth(month));
    });

    return duration;
  }

  // getSummaryOvertimeInMonth(): Duration {}
}
