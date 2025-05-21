/**
 * Updates the "Added On" date for project items that have empty "Added On" field
 * by using the project item's createdAt timestamp from GitHub API.
 * This handles items that were added to the board manually.
 */

const { ...PROJECT_CONFIG } = require('./project-config');
const {
  fetchProjectItems,
  updateProjectDateField,
} = require('./project-api');

module.exports = async ({ github }) => {
  // Get today's date at start of day (UTC)
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  try {
    let allItems = [];
    let hasNextPage = true;
    let cursor = null;

    // Fetch project items with pagination
    while (hasNextPage) {
      const result = await fetchProjectItems({
        github,
        org: PROJECT_CONFIG.org,
        number: PROJECT_CONFIG.projectNumber,
        cursor,
      });

      const items = result.organization.projectV2.items;
      
      // Filter items created today
      const todayItems = items.nodes.filter(item => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= today;
      });

      if (todayItems.length > 0) {
        allItems = allItems.concat(todayItems);
      }

      hasNextPage = items.pageInfo.hasNextPage;
      cursor = items.pageInfo.endCursor;
    }

    console.log(`Processing ${allItems.length} items created today for AddedOn dates`);

    // Process each item
    for (const item of allItems) {
      const itemType = item.type;
      const itemNumber = item.content?.number;

      try {
        // Find the AddedOn field value
        const addedOnField = item.fieldValues.nodes.find(
          (field) => field.field?.name === 'AddedOn'
        );

        // If AddedOn is empty
        if (!addedOnField || !addedOnField.date) {
          console.log(`Processing ${itemType} #${itemNumber} - Adding missing AddedOn date`);

          await updateProjectDateField({
            github,
            projectId: PROJECT_CONFIG.projectId,
            itemId: item.id,
            fieldId: PROJECT_CONFIG.addedOnFieldId,
            date: item.createdAt,
          });

          console.log(`Updated AddedOn date for ${itemType} #${itemNumber} with creation date ${item.createdAt}`);
        } else {
          console.log(`Skipping ${itemType} #${itemNumber} - AddedOn date already set`);
        }
      } catch (error) {
        console.error(`Error processing ${itemType} #${itemNumber}:`, error.message);
        continue;
      }
    }

    if (allItems.length === 0) {
      console.log('No items found that were created today');
    } else {
      console.log(`Successfully processed ${allItems.length} items`);
    }
    
    console.log('Completed processing today\'s items for AddedOn dates');
  } catch (error) {
    console.error('Error updating AddedOn dates:', error.message);
    throw error;
  }
};