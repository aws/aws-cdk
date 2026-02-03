/**
 * Monitors open PRs once daily during weekdays to identify stale community review requests. When a PR
 * with the community review label hasn't been updated for the specified threshold
 * period (default 21 days), it's assigned R5 priority. These PRs are added to the
 * project board and set to Ready status to ensure visibility of long-pending
 * community reviews.
 */

const { PRIORITIES, LABELS, STATUS, DAYS_THRESHOLD, ...PROJECT_CONFIG } = require("./project-config");

const {
  updateProjectField,
  updateProjectDateField,
  addItemToProject,
  fetchProjectFields,
  fetchOpenPullRequests,
  fetchProjectItem,
} = require('./project-api');

const MS_PER_DAY = 1000 * 60 * 60 * 24;

module.exports = async ({ github }) => {
  let allPRs = [];
  let hasNextPage = true;
  let cursor = null;

  // Fetch all PRs using pagination
  while (hasNextPage) {
    const result = await fetchOpenPullRequests({
      github,
      org: PROJECT_CONFIG.org,
      repo: PROJECT_CONFIG.repo,
      cursor: cursor,
    });

    const pullRequests = result.organization.repository.pullRequests;
    allPRs = allPRs.concat(pullRequests.nodes);

    // Update pagination info
    hasNextPage = pullRequests.pageInfo.hasNextPage;
    cursor = pullRequests.pageInfo.endCursor;
  }

  console.log(`Total PRs fetched: ${allPRs.length}`);

  // Get project fields
  const projectFields = await fetchProjectFields({
    github,
    org: PROJECT_CONFIG.org,
    number: PROJECT_CONFIG.projectNumber
  });

  const priorityField = projectFields.organization.projectV2.fields.nodes.find(
    (field) => field.id === PROJECT_CONFIG.priorityFieldId
  );

  const statusField = projectFields.organization.projectV2.fields.nodes.find(
    (field) => field.id === PROJECT_CONFIG.statusFieldId
  );

  const r5OptionId = priorityField.options.find(
    (option) => option.name === PRIORITIES.R5
  )?.id;

  const readyStatusId = statusField.options.find(
    (option) => option.name === STATUS.READY
  )?.id;

  for (const pr of allPRs) {
    const labels = pr.labels.nodes.map((l) => l.name);
    const isDraft = pr.draft === true;

    // Skip draft PRs
    if (isDraft) {
      console.log(`Skipping draft PR #${pr.number}`);
      continue;
    }

    const hasExemptionOrClarification = labels.some(label => 
      [LABELS.CLARIFICATION_REQUESTED, LABELS.EXEMPTION_REQUESTED].includes(label)
    );

    // Skip if PR doesn't have community review label or has exemption/clarification
    if (!labels.includes(LABELS.COMMUNITY_REVIEW) || hasExemptionOrClarification) {
      continue;
    }

    const lastUpdated = new Date(pr.updatedAt);
    const daysSinceUpdate = (Date.now() - lastUpdated) / MS_PER_DAY;

    // Skip if PR update is within the days threshold
    if (daysSinceUpdate <= DAYS_THRESHOLD) {
      continue;
    }

    console.log(`Processing PR #${pr.number} for ${PRIORITIES.R5} priority consideration`);

    try {
      // Get all projects the PR added to
      const result = await fetchProjectItem({
        github,
        contentId: pr.id
      });

      // Filter specific project
      const projectItem = result?.node?.projectItems?.nodes
        ?.find(item => item.project.id === PROJECT_CONFIG.projectId);
      
      // Skip if PR is already in project
      if (projectItem) {
        console.log(`PR #${pr.number} is already in project. Skipping.`);
        continue;
      }

      // Add new PR to project with R5 priority
      console.log(`Adding PR #${pr.number} to project with ${PRIORITIES.R5} priority`);
      
      const addResult = await addItemToProject({
        github,
        projectId: PROJECT_CONFIG.projectId,
        contentId: pr.id,
      });

      // Set priority, Ready status and current date for new items
      await Promise.all([
        updateProjectField({
          github,
          projectId: PROJECT_CONFIG.projectId,
          itemId: addResult.addProjectV2ItemById.item.id,
          fieldId: PROJECT_CONFIG.priorityFieldId,
          value: r5OptionId,
        }),
        updateProjectField({
          github,
          projectId: PROJECT_CONFIG.projectId,
          itemId: addResult.addProjectV2ItemById.item.id,
          fieldId: PROJECT_CONFIG.statusFieldId,
          value: readyStatusId,
        }),
        updateProjectDateField({
          github,
          projectId: PROJECT_CONFIG.projectId,
          itemId: itemId,
          fieldId: PROJECT_CONFIG.addedOnFieldId,
          date: new Date().toISOString(),
        })
      ]);
    } catch (error) {
      console.error(`Error processing PR #${pr.number}:`, error);
      continue;
    }
}
}
