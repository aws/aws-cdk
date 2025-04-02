/**
 * Processes open PRs every 6 hours during weekdays to identify and assign R2 priority. A PR qualifies
 * for R2 when it has received approval but has failing or pending checks, regardless of its current
 * priority or status. These PRs are either added to the project board with R2 priority and Ready status
 * (if not already in board) or updated to R2 priority (if already in board with different priority).
 */

const { PRIORITIES, LABELS, STATUS, ...PROJECT_CONFIG } = require("./project-config");

const {
  updateProjectField,
  updateProjectDateField,
  addItemToProject,
  fetchProjectFields,
  fetchOpenPullRequests,
  fetchProjectItem,
} = require('./project-api');


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

  const r2OptionId = priorityField.options.find(
    (option) => option.name === PRIORITIES.R2
  )?.id;

  const readyStatusId = statusField.options.find(
    (option) => option.name === STATUS.READY
  )?.id;

 for (const pr of allPRs) {
   try {
     console.log(`Processing PR #${pr.number}....`);

      // Check PR status
      const approvals = pr.reviews.nodes.filter(
        (review) => review.state === "APPROVED"
      );

      if (approvals.length < 2) {
        console.log(`Observed approval count: ${approvals.length}. Skipping as it is less than 2...`);
        continue;
      }

      // Check status of checks
      const checksState = pr.commits.nodes[0]?.commit.statusCheckRollup?.state;
      const checksNotPassing = checksState !== "SUCCESS";

     // Skip if PR checks is not passing
      if (!checksNotPassing) {
        console.log(`PR checks are failing. Skipping...`);
        continue;
      }

       // Get all projects the PR added to
      const result = await fetchProjectItem({
        github,
        contentId: pr.id
      });

      // Filter our specific project
     const projectItem = result?.node?.projectItems?.nodes
       ?.find(item => item.project.id === PROJECT_CONFIG.projectId);

      if (projectItem) {
        // PR already in project
        const currentPriority = projectItem.fieldValues.nodes
          .find(fv => fv.field?.name === 'Priority')?.name;

        if (currentPriority === PRIORITIES.R2) {
          console.log(`PR #${pr.number} already has ${PRIORITIES.R2} priority. Skipping.`);
          continue;
        }

        // Update priority only, maintain existing status
        console.log(`Updating PR #${pr.number} from ${currentPriority} to ${PRIORITIES.R2} priority`);
        await updateProjectField({
          github,
          projectId: PROJECT_CONFIG.projectId,
          itemId: projectItem.id,
          fieldId: PROJECT_CONFIG.priorityFieldId,
          value: r2OptionId,
        });
      } else {
        // Add new PR to project with R2 priority and Ready status
        console.log(`Adding PR #${pr.number} to project with ${PRIORITIES.R2} priority`);
        const addResult = await addItemToProject({
          github,
          projectId: PROJECT_CONFIG.projectId,
          contentId: pr.id,
        });
        itemId = addResult.addProjectV2ItemById.item.id;

        // Set priority, Ready status and current date for new items
        await Promise.all([
          updateProjectField({
            github,
            projectId: PROJECT_CONFIG.projectId,
            itemId: itemId,
            fieldId: PROJECT_CONFIG.priorityFieldId,
            value: r2OptionId,
          }),
          updateProjectField({
            github,
            projectId: PROJECT_CONFIG.projectId,
            itemId: itemId,
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
      }
    } catch (error) {
      console.error(`Error processing PR #${pr.number}:`, error);
      continue;
    }
  }
};
