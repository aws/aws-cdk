/**
 * Monitors project items daily to identify PRs that have been in their current status for extended periods.
 * Updates the "Needs Attention" field based on duration thresholds:
 * - Extended (7-14 days): Taking longer than expected
 * - Aging (14-21 days): Requires immediate attention
 * - Stalled (>21 days): Critical attention required
 *
 * Only monitors PRs in specific statuses:
 * - Ready: Awaiting assignment
 * - Assigned: Awaiting start
 * - In Progress: Under review
 * - Paused: Blocked/On hold
 *
 * This helps maintain visibility of PRs that may need intervention to progress.
 */
const { STATUS, NEEDS_ATTENTION_STATUS, ...PROJECT_CONFIG } = require('./project-config');
const { fetchProjectFields, updateProjectField, fetchProjectItems } = require('./project-api');

const MS_PER_DAY = 1000 * 60 * 60 * 24;

// Statuses that need attention monitoring
const MONITORED_STATUSES = [
  STATUS.READY,
  STATUS.ASSIGNED,
  STATUS.IN_PROGRESS,
  STATUS.PAUSED
];

const getAttentionStatus = (days) => {
  if (days > NEEDS_ATTENTION_STATUS.STALLED.threshold) return NEEDS_ATTENTION_STATUS.STALLED.name;
  if (days > NEEDS_ATTENTION_STATUS.AGING.threshold) return NEEDS_ATTENTION_STATUS.AGING.name;
  if (days > NEEDS_ATTENTION_STATUS.EXTENDED.threshold) return NEEDS_ATTENTION_STATUS.EXTENDED.name;
  return null;
};

module.exports = async ({ github }) => {
  try {
    const projectFields = await fetchProjectFields({ 
      github,
      org: PROJECT_CONFIG.org,
      number: PROJECT_CONFIG.projectNumber
    });

    const attentionField = projectFields.organization.projectV2.fields.nodes.find(
      field => field.id === PROJECT_CONFIG.attentionFieldId
    );

    if (!attentionField) {
      throw new Error('Attention field not found in project');
    }

    let allItems = [];
    let hasNextPage = true;
    let cursor = null;

    while (hasNextPage) {
      const result = await fetchProjectItems({
        github,
        org: PROJECT_CONFIG.org,
        number: PROJECT_CONFIG.projectNumber,
        cursor
      });

      const items = result.organization.projectV2.items;
      allItems = allItems.concat(items.nodes);

      hasNextPage = items.pageInfo.hasNextPage;
      cursor = items.pageInfo.endCursor;
    }

    console.log(`Processing ${allItems.length} total items for needs attention status`);

    // Process all items
    for (const item of allItems) {
      try {
        // Get current status and its last update time
        const statusField = item.fieldValues.nodes.find(
          (field) => field.field?.name === "Status"
        );

        if (!statusField) {
          console.log(`No status field found for item ${item.id}`);
          continue;
        }

        const currentStatus = statusField.name;

        // Skip non-monitored statuses
        if (!MONITORED_STATUSES.includes(currentStatus)) {
          console.log(`Skipping non-monitored status for item ${item.id} (${currentStatus})`);
          continue;
        }

        const statusLastUpdated = new Date(statusField.updatedAt);
        const daysInStatus = (Date.now() - statusLastUpdated) / MS_PER_DAY;
        const attentionStatus = getAttentionStatus(daysInStatus);

        console.log(`Item ${item.id}: ${currentStatus} for ${daysInStatus.toFixed(1)} days`);

        // Only update if attention status needs to be set
        if (attentionStatus) {
          const attentionFieldOptionId = attentionField.options.find(
            (option) => option.name === attentionStatus
          )?.id;

          if (!attentionFieldOptionId) {
            console.error(`No option ID found for attention status: ${attentionStatus}`);
            continue;
          }

          await updateProjectField({
            github,
            projectId: PROJECT_CONFIG.projectId,
            itemId: item.id,
            fieldId: PROJECT_CONFIG.attentionFieldId,
            value: attentionFieldOptionId,
          });
          console.log(`Updated item ${item.id} attention status to ${attentionStatus}`);
        }
      } catch (error) {
        console.error(`Error processing item ${item.id}:`, error);
        continue;
      }
    }
  } catch (error) {
    console.error('Error fetching project items:', error);
    throw error;
  }
};
