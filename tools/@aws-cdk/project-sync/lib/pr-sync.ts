import { Github } from './github.js';
import { PROJECT_NUMBER, REPOSITORY } from './config.js';
import { projectIds, getPriorityFromLabels } from './utils.js';

export const syncPr = async (pr: string) => {
  const github = Github.default();

  // 1. Fetch the issue details
  const prData = await github.getPr(pr) as Record<any, any>;

  // Extract repository data
  const repoData = prData?.data?.repository;
  if (!repoData || !repoData.pullRequest) {
    throw new Error(`PR ${pr} not found on repository ${REPOSITORY}`);
  }

  await syncPrData(repoData.pullRequest);
};

export const syncPrData = async (prDetails: any) => {
  const github = Github.default();

  // If issue is part of the project, set the issue's project properties
  let projectItemId = undefined;
  if (prDetails.projectItems?.nodes) {
    for (const node of prDetails.projectItems.nodes) {
      if (`${node.project?.number}` === PROJECT_NUMBER) {
        projectItemId = node.id;
        break;
      }
    }
  }

  if (projectItemId === undefined) {
    console.log(`PR is not included in project ${PROJECT_NUMBER}, skipping.`);
    return;
  }

  const { projectId, createFieldId, updateFieldId, authorFieldId, priorityField } = await projectIds(github);

  // Get timeline items to determine the last update date (excluding github-actions)
  const timelineItems = prDetails.timelineItems?.nodes ?? [];

  // Get creation date from the first reaction or use current date
  const creationDate = new Date(prDetails.createdAt);

  // Get update date from the last timeline item or use creation date
  let updateDate = creationDate;

  for (let index = 0; index < timelineItems.length; index++) {
    const item = timelineItems[timelineItems.length-index-1];
    if (item?.createdAt !== undefined && item.author?.login !== 'github-actions' && item.actor?.login !== 'github-actions' && item.commit?.author?.user?.login !== 'github-actions') {
      updateDate = new Date(item.createdAt ?? item.commit.committedDate);
      break;
    }
  }

  if (prDetails.reactions.nodes.length > 0) {
    const reactionDate = new Date(prDetails.reactions.nodes[0].createdAt);
    if (reactionDate > updateDate) {updateDate = reactionDate;}
  }

  const fields: Record<string, any> = {
    [createFieldId]: { date: creationDate },
    [updateFieldId]: { date: updateDate },
    [authorFieldId]: { text: prDetails.author?.login || '' },
  };

  const priorityOptionId = getPriorityFromLabels(prDetails.labels?.nodes || [], priorityField);
  if (priorityOptionId) {
    fields[priorityField.id] = { singleSelectOptionId: priorityOptionId };
  }

  const result = await github.setProjectItem(projectId, projectItemId, fields);
  console.log('Result from mutation request: ');
  console.dir(JSON.stringify(result));
};
