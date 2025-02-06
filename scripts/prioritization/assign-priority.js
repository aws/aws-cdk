/**
 * Handles the initial priority assignment for PRs when labels are added. This script
 * processes R1 (team PRs with contribution/core label), R3 (PRs needing maintainer review),
 * and R4 (PRs needing clarification or exemption) priorities. When a matching label
 * is detected, the PR is added to the project board with appropriate priority and
 * set to Ready status.
 */


const { PRIORITIES, LABELS, STATUS, ...PROJECT_CONFIG } = require('./project-config');
const {
  updateProjectField,
  addItemToProject,
  fetchProjectFields,
} = require('./project-api');

module.exports = async ({ github, context }) => {
  const getPriority = (pr) => {
    const labels = pr.labels.map((l) => l.name);
    const isDraft = pr.draft === true;

    const hasExemptionOrClarification = labels.some(label => 
      [LABELS.CLARIFICATION_REQUESTED, LABELS.EXEMPTION_REQUESTED].includes(label)
    );

    // R1: Not draft + contribution/core
    if (!isDraft && labels.includes(LABELS.CORE)) {
      return PRIORITIES.R1;
    }

    // R3: Not draft + needs-maintainer-review + no contribution/core + no exemption/clarification
    if (!isDraft && 
      labels.includes(LABELS.MAINTAINER_REVIEW) && 
      !labels.includes(LABELS.CORE) && 
      !hasExemptionOrClarification) {
    return PRIORITIES.R3;
  }

    // R4: Three conditions (draft allowed)
    if (hasExemptionOrClarification && (
      // Condition 1: With community review
      labels.includes(LABELS.COMMUNITY_REVIEW) ||
      // Condition 2: With maintainer review
      labels.includes(LABELS.MAINTAINER_REVIEW) ||
      // Condition 3: No community or maintainer review
      (!labels.includes(LABELS.COMMUNITY_REVIEW) && 
       !labels.includes(LABELS.MAINTAINER_REVIEW))
    )) {
      return PRIORITIES.R4;
    }

    return null;
  };

  async function addToProject(pr) {

     // Check if PR qualifies for any priority
     const priority = getPriority(pr);
     if (!priority) {
       console.log(`PR #${pr.number} doesn't qualify for any priority. Skipping.`);
       return;
     }
 
    console.log(`Processing PR #${pr.number} for ${priority} priority`);
    
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

    try {
      // Add PR to project
      const addResult = await addItemToProject({
        github,
        projectId: PROJECT_CONFIG.projectId,
        contentId: pr.node_id,
      });

      const itemId = addResult.addProjectV2ItemById.item.id;

      // Set priority
      const priorityOptionId = priorityField.options.find(
        (option) => option.name === priority
      )?.id;

      if (!priorityOptionId) {
        console.error(`Priority option ${priority} not found in project settings`);
        return;
      }

      // Set Ready status
      const readyOptionId = statusField.options.find(
        (option) => option.name === STATUS.READY
      )?.id;

      if (!readyOptionId) {
        console.error('Ready status option not found in project settings');
        return;
      }

      // Set Priority and Ready Status
      await Promise.all([
        updateProjectField({
          github,
          projectId: PROJECT_CONFIG.projectId,
          itemId: itemId,
          fieldId: PROJECT_CONFIG.priorityFieldId,
          value: priorityOptionId,
        }),
        updateProjectField({
          github,
          projectId: PROJECT_CONFIG.projectId,
          itemId: itemId,
          fieldId: PROJECT_CONFIG.statusFieldId,
          value: readyOptionId,
        })
      ]);
    } catch (error) {
      console.error(`Error processing PR #${pr.number}:`, error);
    }
  }

  const pr = context.payload.pull_request;
  await addToProject(pr);
};
