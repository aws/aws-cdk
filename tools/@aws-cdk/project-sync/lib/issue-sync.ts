import { Github } from './github.js';
import { PROJECT_NUMBER, REPOSITORY } from './config.js';

export const syncIssue = async (issue: string) => {
  const github = Github.default();

  // 1. Fetch the issue details
  const issueData = await github.getIssue(issue) as Record<any, any>;

  // Extract repository data
  const repoData = issueData?.data?.repository;
  if (!repoData || !repoData.issue) {
    throw new Error(`Issue ${issue} not found on repository ${REPOSITORY}`);
  }

  await syncIssueData(repoData.issue);
};

export const syncIssueData = async (issueDetails: any) => {
  const github = Github.default();

  // If issue is part of the project, set the issue's project properties
  let projectItemId = undefined;
  if (issueDetails.projectItems?.nodes) {
    for (const node of issueDetails.projectItems.nodes) {
      if (`${node.project?.number}` === PROJECT_NUMBER) {
        projectItemId = node.id;
        break;
      }
    }
  }

  if (projectItemId === undefined) {
    console.log(`Issue is not included in project ${PROJECT_NUMBER}, skipping.`);
    return;
  }

  const projectInfo = await github.getProjectInfo(PROJECT_NUMBER);
  const projectId = projectInfo.data.repository.projectV2.id!;

  let createFieldId = undefined;
  let updateFieldId = undefined;
  for (const field of projectInfo.data.repository.projectV2.fields.nodes) {
    if (field.name === 'Create date') {
      createFieldId = field.id;
    }
    if (field.name === 'Update date') {
      updateFieldId = field.id;
    }
  }

  if (createFieldId === undefined) {
    throw new Error('Project field "Creation date" not found');
  }

  if (updateFieldId === undefined) {
    throw new Error('Project field "Update date" not found');
  }

  // Get timeline items to determine the last update date (excluding github-actions)
  const timelineItems = issueDetails.timelineItems?.nodes ?? [];

  // Get creation date from the first reaction or use current date
  const creationDate = new Date(issueDetails.createdAt);

  // Get update date from the last timeline item or use creation date
  let updateDate = creationDate;

  for (let index = 0; index < timelineItems.length; index++) {
    const item = timelineItems[timelineItems.length-index-1];
    if (item?.createdAt !== undefined && item.author?.login !== 'github-actions' && item.actor?.login !== 'github-actions') {
      updateDate = new Date(item.createdAt);
      break;
    }
  }

  if (issueDetails.reactions.nodes.length > 0) {
    const reactionDate = new Date(issueDetails.reactions.nodes[0].createdAt);
    if (reactionDate > updateDate) {updateDate = reactionDate;}
  }

  const result = await github.setProjectItem(projectId, projectItemId, {
    [createFieldId]: { date: creationDate },
    [updateFieldId]: { date: updateDate },
  });
  console.log('Result from mutation request: ');
  console.dir(JSON.stringify(result));
};
