const LABELS = {
  CORE: 'contribution/core',
  MAINTAINER_REVIEW: 'pr/needs-maintainer-review',
  COMMUNITY_REVIEW: 'pr/needs-community-review',
  CLARIFICATION_REQUESTED: 'pr/reviewer-clarification-requested',
  EXEMPTION_REQUESTED: 'pr-linter/exemption-requested',
  P1: 'p1',
  BUG: 'bug'
};

const PRIORITIES = {
  R1: '🚨 R1',
  R2: '🔥 R2',
  R3: '🎯 R3',
  R4: '💭 R4',
  R5: '📆 R5',
  R6: '🐛 R6'
};

const STATUS = {
  READY: '⭐ Ready',
  IN_PROGRESS: '🔄 In Progress',
  PAUSED: '⏸️ Paused',
  ASSIGNED: '👤 Assigned',
  DONE: '✅ Done'
};

// Time threshold for R5
const DAYS_THRESHOLD = 21;

const NEEDS_ATTENTION_STATUS = {
  STALLED: {
    name: '🚨 Stalled',
    threshold: 21
  },
  AGING: {
    name: '⚠️ Aging',
    threshold: 14
  },
  EXTENDED: {
    name: '🕒 Extended',
    threshold: 7
  }
};

/**
 * Project configuration for GitHub project automation.
 * Note: For projectId, priorityFieldId, statusFieldId, attentionFieldId and addedOnFieldId,
 * refer to Setup section in README.md on how to retrieve these values using GraphQL query.
 * These IDs need to be updated only when project fields are modified.
 */
module.exports = {
  org: 'aws',
  repo: 'aws-cdk',
  projectNumber: 263,
  projectId: 'PVT_kwDOACIPmc4Av_32',
  priorityFieldId: 'PVTSSF_lADOACIPmc4Av_32zgmVmPs',
  statusFieldId: 'PVTSSF_lADOACIPmc4Av_32zgmVmF8',
  attentionFieldId: 'PVTSSF_lADOACIPmc4Av_32zgmZDdo',
  addedOnFieldId: 'PVTF_lADOACIPmc4Av_32zgqbglg',
  LABELS,
  PRIORITIES,
  STATUS,
  NEEDS_ATTENTION_STATUS,
  DAYS_THRESHOLD
};
