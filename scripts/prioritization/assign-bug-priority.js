const { PRIORITIES, LABELS, STATUS, ...PROJECT_CONFIG } = require('./project-config');
const {
    updateProjectField,
    updateProjectDateField,
    addItemToProject,
    fetchProjectFields,
    fetchProjectItem,
} = require('./project-api');

module.exports = async ({ github, context }) => {
    async function addToProject(issue) {
        console.log(`Processing issue #${issue.number}...`);

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

        // Check if issue is already in project
        const result = await fetchProjectItem({
            github,
            contentId: issue.node_id
        });

        // Filter our specific project
        const projectItem = result?.node?.projectItems?.nodes
            ?.find(item => item.project.id === PROJECT_CONFIG.projectId);

        if (projectItem) {
            // Issue already in project - update only priority if different
            const currentPriority = projectItem.fieldValues.nodes
                .find(fv => fv.field?.name === 'Priority')?.name;

            if (currentPriority === PRIORITIES.R6) {
                console.log(`Issue #${issue.number} already has ${PRIORITIES.R6} priority. Skipping.`);
                return;
            }

            const priorityR6OptionId = priorityField.options.find(
                (option) => option.name === PRIORITIES.R6
            )?.id;

            // Update priority only, retain existing status
            await updateProjectField({
                github,
                projectId: PROJECT_CONFIG.projectId,
                itemId: projectItem.id,
                fieldId: PROJECT_CONFIG.priorityFieldId,
                value: priorityR6OptionId,
            });
        } else {
            // Add new issue to project
            const addResult = await addItemToProject({
                github,
                projectId: PROJECT_CONFIG.projectId,
                contentId: issue.node_id,
            });

            const itemId = addResult.addProjectV2ItemById.item.id;
            const priorityR6OptionId = priorityField.options.find(
                (option) => option.name === PRIORITIES.R6
            )?.id;

            const readyStatusId = statusField.options.find(
                (option) => option.name === STATUS.READY
            )?.id;

            // Set priority, Ready status and current date for new items
            await Promise.all([
                updateProjectField({
                    github,
                    projectId: PROJECT_CONFIG.projectId,
                    itemId: itemId,
                    fieldId: PROJECT_CONFIG.priorityFieldId,
                    value: priorityR6OptionId,
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
    }

    const issue = context.payload.issue;
    const labels = issue.labels.map((l) => l.name);
    if (labels.includes(LABELS.P1) && labels.includes(LABELS.BUG)) {
        await addToProject(issue);
    }
};
