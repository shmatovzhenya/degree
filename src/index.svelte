<script lang="ts">
  import { loader } from './client/JiraLoader';
  import { Project } from './entities/Project';
  import { UserRoleBuilder } from './entities/UserRole';

  const builder = new UserRoleBuilder();
  let isBillableDialogVisible = false;
  let project: Project;
  let taskNames = [];
  let unBilled = [];
  let membersList = [];
  let rolesGroup = [];
  let attachedRoles = [];
  let isSubmitted = false;
  let result = {};
  let formattedResult = [];

  let roles = [{
    label: '',
    value: '',
  }, {
    label: builder.getOrCreate('Backend').name,
    value: builder.getOrCreate('Backend').name,
  }, {
    label: builder.getOrCreate('Front-end').name,
    value: builder.getOrCreate('Front-end').name,
  }, {
    label: builder.getOrCreate('QA').name,
    value: builder.getOrCreate('QA').name,
  }, {
    label: builder.getOrCreate('Manager').name,
    value: builder.getOrCreate('Manager').name,
  }];

  const onFileLoad = (event) => {
    const reader = new FileReader();
    const CSVData: string[][] = [];

    reader.onload = function (file) {
      reader.result.toString().split('\n').forEach(line => {
        const items = line.split(',');

        if (items.length > 1) {
          CSVData.push(items);
        }
      });

      project = loader(CSVData);
      taskNames = project.taskNames;
      membersList = project.membersList;
      isBillableDialogVisible = true;
      attachedRoles.length = membersList.length;
    };

    reader.readAsText(event.target.files[0]);
  };

  const onSubmit = () => {
    unBilled.forEach(taskName => {
      project.getTaskByName(taskName).billable = false;
    });

    attachedRoles.forEach((role, index) => {
      const roleObject = builder.getOrCreate(role);
      const member = project.getMemberByFullName(membersList[index]);

      project.addMemberToRoleRelation(member, roleObject);
    });

    const overtimed1 = project.getOvertimedTimesByRolesPerMonth(new Date());
    const unBilled1 = project.getUnBilledTimesByRolesPerMonth(new Date());
    const worked1 = project.getWorkedTimesByRolesPerMonth(new Date());
    console.log({ worked1, overtimed1, unBilled1 });

    result = {
      overtimed: Object.keys(overtimed1).map(role => ([ role, overtimed1[role].toString() ])),
      unBilled: Object.keys(unBilled1).map(role => ([ role, unBilled1[role].toString() ])),
      worked: Object.keys(worked1).map(role => ([ role, worked1[role].toString() ])),
    };

    console.log(result);
    isSubmitted = true;
  };
</script>
<style lang="postcss">
</style>
<form on:submit|preventDefault={onSubmit}>
  <input type="file" on:change={onFileLoad} name="files" accept=".csv">
  {#if isBillableDialogVisible}
    <p>Не оплачиваемые задачи</p>
    {#each taskNames as task, index}
      <label>
        <input type="checkbox" name="billable" value={task} bind:group={unBilled}>
        {task}
      </label>
    {/each}
    <p>Установите роли для пользователей</p>
    {#each membersList as member, memeberIndex}
      <label>
        <select bind:value={attachedRoles[memeberIndex]}>
          {#each roles as role, index}
            <option value={role.value}>
              {role.label}
            </option>
          {/each}
        </select>
        {member}
      </label>
    {/each}
  {/if}
  <input type="submit" value="Загрузить CSV">
</form>
{#if isSubmitted}
  <section>
    <h2>Отработано</h2>
    {#each result.worked as roleAndHours}
      <p>{roleAndHours[0]}, {roleAndHours[1]}</p>
    {/each}
  </section>
  <section>
    <h2>Переработано</h2>
    {#each result.overtimed as roleAndHours}
      <p>{roleAndHours[0]}, {roleAndHours[1]}</p>
    {/each}
  </section>
  <section>
    <h2>Неоплачено</h2>
    {#each result.unBilled as roleAndHours}
      <p>{roleAndHours[0]}, {roleAndHours[1]}</p>
    {/each}
  </section>
{/if}
