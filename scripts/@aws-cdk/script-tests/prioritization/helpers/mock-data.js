const { PRIORITIES, LABELS, STATUS, NEEDS_ATTENTION_STATUS, ...PROJECT_CONFIG } = require('../../../../../scripts/prioritization/project-config');

const OPTION_IDS = {
  [PRIORITIES.R1]: 'r1-option-id',
  [PRIORITIES.R2]: 'r2-option-id',
  [PRIORITIES.R3]: 'r3-option-id',
  [PRIORITIES.R4]: 'r4-option-id',
  [PRIORITIES.R5]: 'r5-option-id',
  [STATUS.READY]: 'ready-status-id',
  [STATUS.IN_PROGRESS]: 'in_progress-status-id',
  [STATUS.PAUSED]: 'paused-status-id',
  [STATUS.ASSIGNED]: 'assigned-status-id',
  [STATUS.DONE]: 'done-status-id',
  [NEEDS_ATTENTION_STATUS.EXTENDED.name]: 'extended-status-id',
  [NEEDS_ATTENTION_STATUS.AGING.name]: 'aging-status-id',
  [NEEDS_ATTENTION_STATUS.STALLED.name]: 'stalled-status-id'
};

const projectFields = {
  organization: {
    projectV2: {
      fields: {
        nodes: [
          {
            id: PROJECT_CONFIG.priorityFieldId,
            name: 'Priority',
            options: Object.values(PRIORITIES).map(priority => ({
              id: OPTION_IDS[priority],
              name: priority
            }))
          },
          {
            id: PROJECT_CONFIG.statusFieldId,
            name: 'Status',
            options: Object.values(STATUS).map(status => ({
              id: OPTION_IDS[status],
              name: status
          }))
          }
        ]
      }
    }
  }
};

const addItemToProject = {
  addProjectV2ItemById: {
    item: { id: 'new-item-id' }
  }
}

const updateFieldValueInProject = {
  updateProjectV2ItemFieldValue: {
    projectV2Item: { id: 'new-item-id' }
  }
}

const projectItem = (existingPriority, existingStatus) => ({
  node: {
    projectItems: {
      nodes: existingPriority ? [{
        id: 'existing-item-id',
        project: {
          id: PROJECT_CONFIG.projectId
        },
        fieldValues: {
          nodes: [
            {
              field: { name: 'Priority' },
              name: existingPriority
            },
            {
              field: { name: 'Status' },
              name: existingStatus
            }
          ]
        }
      }] : []
    }
  }
});

/**
 * Creates a mock PR with specified properties
 */
exports.createMockPR = ({
  number = 123,
  node_id = 'PR_123',
  draft = false,
  labels = [],
  updatedAt = new Date().toISOString(),
  reviews = [],
  checksState = 'SUCCESS'
}) => ({
  number,
  node_id,
  draft,
  labels: labels.map(name => ({ name })),
  updatedAt,
  reviews: { nodes: reviews },
  commits: {
    nodes: [{
      commit: {
        statusCheckRollup: { state: checksState }
      }
    }]
  }
});

/**
 * Creates mock GitHub GraphQL client with predefined responses for Priority (R1, R3, R4)
 */
exports.createMockGithubForPriority = ({
  existingPriority = null,
  existingStatus = STATUS.READY
} = {}) => { 
  const graphql = jest.fn();

  graphql
    // First call - fetch project fields
    .mockResolvedValueOnce(projectFields)
    // Second call - check if PR is in project
    .mockResolvedValueOnce(projectItem(existingPriority, existingStatus));

    // If PR exists and needs priority update
    if (existingPriority) {
      // Third call - update priority only
      graphql.mockResolvedValueOnce(updateFieldValueInProject);
    } else {
      // Third call - add to project
      graphql.mockResolvedValueOnce(addItemToProject)
      // Fourth call - update priority
      .mockResolvedValueOnce(updateFieldValueInProject)
      // Fifth call - update status
      .mockResolvedValueOnce(updateFieldValueInProject);
    }

  return { graphql };
};

/**
 * Creates mock GitHub GraphQL client with predefined responses for R5 priority
 */
exports.createMockGithubForR5 = ({
  draft = false,
  labels = [],
  updatedAt = new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
  existingPriority = null,
  existingStatus = STATUS.READY
}) => {
  const graphql = jest.fn();

  // Set up mock responses in sequence
  graphql
    // First call - fetch open PRs
    .mockResolvedValueOnce({
      organization: {
        repository: {
          pullRequests: {
            nodes: [{
              id: 'PR_123',
              number: 123,
              draft,
              updatedAt,
              labels: {
                nodes: labels.map(label => ({ name: label }))
              }
            }],
            pageInfo: {
              hasNextPage: false,
              endCursor: null
            }
          }
        }
      }
    })
    // Second call - fetch project fields
    .mockResolvedValueOnce(projectFields)
    // Third call - fetchProjectItem (check if PR is in project)
    .mockResolvedValueOnce(projectItem(existingPriority, existingStatus))
    if (!existingPriority) {
      // Fourth call - add to project
      graphql.mockResolvedValueOnce(addItemToProject)
      // Fifth call - update priority
      .mockResolvedValueOnce(updateFieldValueInProject)
      // Sixth call - update status
      .mockResolvedValueOnce(updateFieldValueInProject);
    }

  return { graphql };
};

/**
 * Creates mock GitHub GraphQL client with predefined responses for R2 priority
 */
exports.createMockGithubForR2 = ({
  approvalCount = 0,
  checksState = 'SUCCESS',
  existingPriority = null,
  existingStatus = STATUS.READY
}) => {
  const graphql = jest.fn();

  // Set up mock responses in sequence
  graphql
      // First call - fetch open PRs
      .mockResolvedValueOnce({
        organization: {
          repository: {
            pullRequests: {
              nodes: [{
                id: 'PR_123',
                number: 123,
                reviews: {
                  nodes: Array.from({ length: approvalCount }, () => ({ state: 'APPROVED' }))
                },
                commits: {
                  nodes: [{
                    commit: {
                      statusCheckRollup: {
                        state: checksState
                      }
                    }
                  }]
                }
              }],
              pageInfo: {
                hasNextPage: false,
                endCursor: null
              }
            }
          }
        }
        })
      // Second call - fetch project fields
      .mockResolvedValueOnce(projectFields)
      // Third call - check if PR is in project
      .mockResolvedValueOnce(projectItem(existingPriority, existingStatus));

  // If PR exists and needs priority update
  if (existingPriority && existingPriority !== PRIORITIES.R2) {
      // Fourth call - update priority only
      graphql.mockResolvedValueOnce(updateFieldValueInProject);
  }
  // If PR doesn't exist in project
  else if (!existingPriority) {
      // Fourth call - add to project
      graphql.mockResolvedValueOnce(addItemToProject)
      // Fifth call - update priority
      .mockResolvedValueOnce(updateFieldValueInProject)
      //Sixth call - update status
      .mockResolvedValueOnce(updateFieldValueInProject);
  }

  return { graphql };
};

/**
 * Creates mock GitHub GraphQL client with predefined responses for Needs Attention Status field assignment
 */
exports.createMockGithubForNeedsAttention = ({ 
  status = STATUS.READY,
  daysInStatus = 0,
  items = null
}) => {
  const graphql = jest.fn();

  const createItem = (itemStatus, days) => ({
      id: `item-${Math.random()}`,
      fieldValues: {
          nodes: [
              {
                  field: { name: 'Status' },
                  name: itemStatus,
                  updatedAt: new Date(Date.now() - (days * 24 * 60 * 60 * 1000)).toISOString()
              }
          ]
      }
  });

   // First call - fetch project fields
   graphql.mockResolvedValueOnce({
    organization: {
        projectV2: {
            fields: {
                nodes: [
                    {
                        id: PROJECT_CONFIG.attentionFieldId,
                        name: 'Needs Attention',
                        options: Object.values(NEEDS_ATTENTION_STATUS).map(attentionStatus => ({
                          id: OPTION_IDS[attentionStatus.name],
                          name: attentionStatus.name
                        }))
                    }
                ]
            }
        }
    }
   });
  
  // Second call - fetch project items
  graphql.mockResolvedValueOnce({
      organization: {
          projectV2: {
              items: {
                  nodes: items ? items.map(item => createItem(item.status, item.daysInStatus))
                              : [createItem(status, daysInStatus)],
                  pageInfo: {
                      hasNextPage: false,
                      endCursor: null
                  }
              }
          }
      }
  });

  // For field updates
  if (items) {
    items.forEach(item => {
        if (item.status !== STATUS.DONE) {  // Skip DONE items
            graphql.mockResolvedValueOnce(updateFieldValueInProject);
        }
    });
  } else if (status !== STATUS.DONE) {
      graphql.mockResolvedValueOnce(updateFieldValueInProject);
  }

  return { graphql };
};

exports.OPTION_IDS = OPTION_IDS;