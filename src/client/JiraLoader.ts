import { parse } from 'date-fns';

import { Estimation } from '../entities/Estimation';
import { Duration, Options } from '../entities/Duration';
import { Task } from '../entities/Task';
import { Project } from '../entities/Project';
import { Period } from '../entities/Period';
import { Member, MemberId } from '../entities/Member';

// Summary, Assignee, Reporter, Issue Type, Description, Priority
const loader = (CSVFile: string[][]) => {
  const project = new Project(CSVFile[0][1]);

  const tasks: Record<string, Task> = {};
  const members: Record<string, Member> = {};

  CSVFile.forEach(line => {
    const name: string = line[0];
    const estimationStr: string = line[6];
    const worklog = line[5];
    const [ description, startDateStr, user, durationStr ] = worklog.split(';');
    
    if (!(name in tasks)) {
      const estimationInSeconds = parseInt(estimationStr);
      let estimationInDuration = estimationInSeconds;
      const options: Options = {};

      const YEAR = 60 * 60 * 24 * 365;
      const MONTH = 60 * 60 * 24 * 30;
      const WEEK = 60 * 60 * 24 * 7;
      const DAY = 60 * 60 * 24;
      const HOUR = 60 * 60;
      const MINUTE = 60;

      if (estimationInDuration >= YEAR) {
        estimationInDuration = estimationInSeconds % YEAR;
        options.years = Math.ceil(estimationInSeconds / YEAR);
      }

      if (estimationInDuration >= MONTH) {
        estimationInDuration = estimationInSeconds % YEAR;
        options.months = Math.ceil(estimationInSeconds / YEAR);
      }

      if (estimationInDuration >= WEEK) {
        estimationInDuration = estimationInSeconds % WEEK;
        options.weeks = Math.ceil(estimationInSeconds / WEEK);
      }

      if (estimationInDuration >= DAY) {
        estimationInDuration = estimationInSeconds % DAY;
        options.days = Math.ceil(estimationInSeconds / DAY);
      }

      if (estimationInDuration >= HOUR) {
        estimationInDuration = estimationInSeconds % HOUR;
        options.hours = Math.ceil(estimationInSeconds / HOUR);
      }

      if (estimationInDuration >= MINUTE) {
        estimationInDuration = estimationInSeconds % MINUTE;
        options.minutes = Math.ceil(estimationInSeconds / MINUTE);
      }

      const duration = new Duration(options);
      const estimation = new Estimation({ estimation: duration });
      tasks[name] = new Task(name, estimation, {});
    }

    const startDate = parse(startDateStr, 'yyyy.MM.dd kk:mm', new Date());

    const options: Options = {};

    const YEAR = 60 * 60 * 24 * 365;
    const MONTH = 60 * 60 * 24 * 30;
    const WEEK = 60 * 60 * 24 * 7;
    const DAY = 60 * 60 * 24;
    const HOUR = 60 * 60;
    const MINUTE = 60;
    const estimationInSeconds = parseInt(durationStr);
    let estimationInDuration = estimationInSeconds;

    if (estimationInDuration >= YEAR) {
      estimationInDuration = estimationInSeconds % YEAR;
      options.years = Math.ceil(estimationInSeconds / YEAR);
    }

    if (estimationInDuration >= MONTH) {
      estimationInDuration = estimationInSeconds % YEAR;
      options.months = Math.ceil(estimationInSeconds / YEAR);
    }

    if (estimationInDuration >= WEEK) {
      estimationInDuration = estimationInSeconds % WEEK;
      options.weeks = Math.ceil(estimationInSeconds / WEEK);
    }

    if (estimationInDuration >= DAY) {
      estimationInDuration = estimationInSeconds % DAY;
      options.days = Math.ceil(estimationInSeconds / DAY);
    }

    if (estimationInDuration >= HOUR) {
      estimationInDuration = estimationInSeconds % HOUR;
      options.hours = Math.ceil(estimationInSeconds / HOUR);
    }

    if (estimationInDuration >= MINUTE) {
      estimationInDuration = estimationInSeconds % MINUTE;
      options.minutes = Math.ceil(estimationInSeconds / MINUTE);
    }

    const duration = new Duration(options);

    if (!(user in members)) {
      members[user] = new Member(user, '');
    }
      
    const period = new Period(startDate, duration, members[user].id);

    tasks[name].addWorkingPeriod(period);
  });

  project.addTasksList(Object.keys(tasks).map(id => tasks[id]));
  project.addMembers(Object.keys(members).map(id => members[id]));

  return project;
};
