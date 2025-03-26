/**
 * Updates a field value for an item in a GitHub Project.
 * @param {Object} params - The parameters for updating the project field
 * @param {Object} params.github - The GitHub API client
 * @param {string} params.projectId - The ID of the project
 * @param {string} params.itemId - The ID of the item to update
 * @param {string} params.fieldId - The ID of the field to update
 * @param {string} params.value - The new value for the field
 * @returns {Promise<Object>} The GraphQL mutation response
 */
const updateProjectField = async ({
    github,
    projectId,
    itemId,
    fieldId,
    value,
  }) => {
    return github.graphql(
      `
        mutation($input: UpdateProjectV2ItemFieldValueInput!) {
          updateProjectV2ItemFieldValue(input: $input) {
            projectV2Item {
              id
            }
          }
        }
      `,
      {
        input: {
          projectId,
          itemId,
          fieldId,
          value: value ? { singleSelectOptionId: value } : null,
        },
      }
    );
  };

/**
 * Updates a date field value for an item in a GitHub Project.
 * @param {Object} params - The parameters for updating the project field
 * @param {Object} params.github - The GitHub API client
 * @param {string} params.projectId - The ID of the project
 * @param {string} params.itemId - The ID of the item to update
 * @param {string} params.fieldId - The ID of the field to update
 * @param {string} params.date - The date string in ISO format
 * @returns {Promise<Object>} The GraphQL mutation response
 */
const updateProjectDateField = async ({
  github,
  projectId,
  itemId,
  fieldId,
  date,
}) => {
  return github.graphql(
    `
      mutation($input: UpdateProjectV2ItemFieldValueInput!) {
        updateProjectV2ItemFieldValue(input: $input) {
          projectV2Item {
            id
          }
        }
      }
    `,
    {
      input: {
        projectId,
        itemId,
        fieldId,
        value: { date },
      },
    }
  );
};

/**
 * Adds an item (PR) to a GitHub Project.
 * @param {Object} params - The parameters for adding an item to the project
 * @param {Object} params.github - The GitHub API client
 * @param {string} params.projectId - The ID of the project
 * @param {string} params.contentId - The node ID of the PR to add
 * @returns {Promise<Object>} The GraphQL mutation response with the new item's ID
 */
  const addItemToProject = async ({ github, projectId, contentId }) => {
    return github.graphql(
      `
      mutation($input: AddProjectV2ItemByIdInput!) {
        addProjectV2ItemById(input: $input) {
          item {
            id
          }
        }
      }
    `,
      {
        input: {
          projectId,
          contentId,
        },
      }
    );
  };
  
/**
 * Fetches fields configuration for a GitHub Project.
 * @param {Object} params - The parameters for fetching project fields
 * @param {Object} params.github - The GitHub API client
 * @param {string} params.org - The organization name
 * @param {number} params.number - The project number
 * @returns {Promise<Object>} The project fields data including field IDs and options
 */
  const fetchProjectFields = async ({ github, org, number }) => {
    return github.graphql(
      `
      query($org: String!, $number: Int!) {
        organization(login: $org) {
          projectV2(number: $number) {
            fields(first: 20) {
              nodes {
                ... on ProjectV2SingleSelectField {
                  id
                  name
                  options {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    `,
      { org, number }
    );
  };
  

  /**
   * Fetches open pull requests from a repository with pagination support.
   * Includes data needed for both R2 and R5 priority processing.
   * @param {Object} params - The parameters for fetching pull requests
   * @param {Object} params.github - The GitHub API client
   * @param {string} params.org - The organization name
   * @param {string} params.repo - The repository name
   * @param {string} [params.cursor] - The pagination cursor
   * @returns {Promise<Object>} The GraphQL mutation response
   */
  const fetchOpenPullRequests = async ({ github, org, repo, cursor }) => {
    return github.graphql(
      `
      query($org: String!, $repo: String!, $cursor: String) {
        organization(login: $org) {
          repository(name: $repo) {
            pullRequests(first: 100, after: $cursor, states: OPEN) {
              nodes {
                id
                number
                updatedAt
                reviews(last: 100) {
                  nodes {
                    state
                  }
                }
                commits(last: 1) {
                  nodes {
                    commit {
                      statusCheckRollup {
                        state
                      }
                    }
                  }
                }
                labels(first: 10) {
                  nodes {
                    name
                  }
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      }`,
      { org, repo, cursor }
    );
  };

  /**
   * Fetches project item details for a specific PR or Issue
   * @param {Object} params - The parameters for fetching project item
   * @param {Object} params.github - The GitHub API client
   * @param {string} params.contentId - PR/Issue node ID
   * @returns {Promise<Object>} Project item details if PR is in project
   */
  const fetchProjectItem = async ({ github, contentId }) => {
    return github.graphql(
      `
      query($contentId: ID!) {
        node(id: $contentId) {
          ... on PullRequest {
            projectItems(first: 100) {
              nodes {
                id
                project {
                  id
                }
                fieldValues(first: 8) {
                  nodes {
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      name
                      field {
                        ... on ProjectV2SingleSelectField {
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          ... on Issue {
            projectItems(first: 100) {
              nodes {
                id
                project {
                  id
                }
                fieldValues(first: 8) {
                  nodes {
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      name
                      field {
                        ... on ProjectV2SingleSelectField {
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      `,
      { contentId }
    );
  };

  /**
   * Fetches all items from a GitHub Project with their status and update times
   * @param {Object} params - The parameters for fetching project items
   * @param {Object} params.github - The GitHub API client
   * @param {string} params.org - The organization name
   * @param {number} params.number - The project number
   * @param {string} [params.cursor] - The pagination cursor
   * @returns {Promise<Object>} Project items with their field values
   */
  const fetchProjectItems = async ({ github, org, number, cursor }) => {
    return github.graphql(
      `
      query($org: String!, $number: Int!, $cursor: String) {
        organization(login: $org) {
          projectV2(number: $number) {
            items(first: 100, after: $cursor) {
              nodes {
                id
                createdAt
                type
                content {
                  ... on Issue {
                    id
                    number
                  }
                  ... on PullRequest {
                    id
                    number
                  }
                }
                fieldValues(first: 20) {
                  nodes {
                    ... on ProjectV2ItemFieldSingleSelectValue {
                      name
                      field {
                        ... on ProjectV2SingleSelectField {
                          name
                        }
                      }
                      updatedAt
                    }
                    ... on ProjectV2ItemFieldDateValue {
                      date
                      field {
                        ... on ProjectV2Field {
                          name
                        }
                      }
                    }
                  }
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        }
      }`,
      { org, number, cursor }
    );
  };

  module.exports = {
    updateProjectField,
    updateProjectDateField,
    addItemToProject,
    fetchProjectFields,
    fetchOpenPullRequests,
    fetchProjectItem,
    fetchProjectItems
  };