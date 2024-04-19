/* eslint-disable no-console */

import UpgradableActions from 'data/UpgradableActions.json';
import { localizeKeys } from 'lib/utils/i18n.mjs';

import type { ClassJobProps } from 'types/ClassJob';
import type { ActionProps } from 'types/Action';

const baseUrl = 'https://xivapi.com';
const columns = [
  'ID',
  'Icon',
  'IconHD',
  'Url',
  'UrlType',
  ...localizeKeys('Name'),
  ...localizeKeys('Description')
].join(',');

export async function listJobActions(job:ClassJobProps, pvp?:boolean) {
  const isPvP = pvp ? 1 : 0;
  const filters = ['DOM', 'DOW'].includes(job.Discipline) ? `IsPvP=${isPvP},` : '';
  const endpoint = `search?indexes=Action,CraftAction&columns=${columns}&filters=${filters}ClassJobTargetID`;
  const actions = await fetch(`${baseUrl}/${endpoint}=${job.ID}`)
    .then((res) => res.json())
    .then(async (actionsRes) => {
      const { Results } = actionsRes;
      const names = Results.map((act: ActionProps) => act.Name);

      const uniqNames = (current: ActionProps, index: number) => names.indexOf(current.Name) === index;

      const filteredActions = Results
        .filter(uniqNames)
        .map((action: ActionProps) => (job.Abbr === 'BLU'
          ? { ...action, Command: 'blueaction' }
          : action));

      let classJobActions = [];
      if (job.ClassID !== null) {
        const reqUrl = `${baseUrl}/${endpoint}=${job.ClassID}`;
        classJobActions = await fetch(reqUrl)
          .then((res) => res.json())
          .then((json) => json.Results);

        if (job.ClassActionAllowlist) {
          classJobActions = classJobActions
            .filter(({ Name }: { Name: string }) => job.ClassActionAllowlist?.includes(Name));
        }
      }

      // Are actions upgradable (not usable at max level)
      const jobKey = job.Abbr as keyof typeof UpgradableActions;
      const upgradableActions = UpgradableActions[jobKey] ?? [];
      const actionsWithUpgradedInfo = [...classJobActions, ...filteredActions]
        .map((action) => ({ ...action, upgradable: upgradableActions.includes(action.Name) }));

      return actionsWithUpgradedInfo;
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
  return actions;
}

export async function listRoleActions(job: ClassJobProps, pvp?: boolean) {
  // Construct filters params if PvP or PvE
  const filters = pvp
    ? 'ClassJobCategoryTargetID=85,IsPlayerAction=1'
    : `ClassJobCategory.${job.Abbr}=1,IsRoleAction=1`;

  const endpoint = `search?indexes=Action,CraftAction&columns=${columns}&filters=${filters}`;

  const roleActions = await fetch(`${baseUrl}/${endpoint}`)
    .then((res) => res.json())
    // Add prefix and additional params to the resulting actions
    .then((roleActionsRes) => roleActionsRes.Results.map((action: ActionProps) => ({
      ...action, Prefix: 'r', UrlType: 'Action',
    })))
    .catch((error) => {
      console.error(error);
      return [];
    });

  return roleActions;
}

export async function getContent(type: string, id: string | number) {
  const req = `${baseUrl}/${type}/${id}`;
  const content = await fetch(req).then((res) => res.json());
  return content;
}

const moduleExports = {
  listJobActions,
  listRoleActions,
  getContent
};

export default moduleExports;
