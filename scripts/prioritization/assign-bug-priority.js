const { PRIORITIES, LABELS, STATUS, ...PROJECT_CONFIG } = require('./project-config');
const {
    updateProjectField,
    addItemToProject,
    fetchProjectFields,
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

        const addResult = await addItemToProject({
            github,
            projectId: PROJECT_CONFIG.projectId,
            contentId: issue.node_id,
        });

        const itemId = addResult.addProjectV2ItemById.item.id;

        const priorityR6OptionId = priorityField.options.find(
            (option) => option.name === PRIORITIES.R6
        )?.id;

        if (!priorityR6OptionId) {
            throw new Error(`Cannot find Id of the R6 priority option. 
            Found: ${priorityField.options.map(op => op.name)}`);
        }

        await updateProjectField({
            github,
            projectId: PROJECT_CONFIG.projectId,
            itemId: itemId,
            fieldId: PROJECT_CONFIG.priorityFieldId,
            value: priorityR6OptionId,
        });
    }

    const issue = context.payload.issue;
    const labels = issue.labels.map((l) => l.name);
    if (labels.includes(LABELS.P1) && labels.includes(LABELS.BUG)) {
        await addToProject(issue);
    } else {
        // do nothing
    }
};
