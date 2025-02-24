# Prioritization Github Action workflow Automation

## Setup

Note: This configuration needs to be updated only when project fields are modified.

### Prerequisites
1. GitHub CLI installed (`gh`)
2. Appropriate permissions to access AWS organization
3. GitHub token with `read:org` and `project` scopes

### Project Configuration
To set up the prioritization automation, we need to get the field IDs of the project board and update the configuration. Follow these steps:

1. Add the github token to `GH_TOKEN` environment variable:

    ```bash
    export GH_TOKEN="YOUR GITHUB TOKEN"

2. Retrieve project field IDs for the specific project:

    ```bash
    # Get project and field IDs
    gh api graphql -f query='
    query {
        organization(login: "aws") {
        projectV2(number: YOUR PROJECT NUMBER) {
            id
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
    ' | jq '.data.organization.projectV2 as $project | {
        projectId: $project.id,
        fields: [
        $project.fields.nodes[] | 
        select(.name == "Priority" or .name == "Status" or .name == "Needs Attention") |
        {name: .name, id: .id}
        ]
    }'

3. Update configuration with the returned IDs:

    ```javascript   
    // project-config.js
    module.exports = {
      ...
      projectNumber: 263,         // Project Number
      projectId: "xxx",           // Project ID
      priorityFieldId: "xxx",     // Priority field ID
      statusFieldId: "xxx",       // Status field ID
      attentionFieldId: "xxx",    // Needs Attention field ID
    };


## Available Views
1. [Prioritized Backlog](https://github.com/orgs/aws/projects/263/views/1) : Overall view of all PRs with prioritization
2. [My Items](https://github.com/orgs/aws/projects/263/views/6) : Filtered view showing only PRs assigned to you

## Common Labels and Categories

### Priority Labels
`R1` -> Non-draft PRs from the team (`contribution/core`)
`R2` -> Approved PRs with failing/pending checks
`R3` -> Non-draft PRs that needs maintainer review (`pr/needs-maintainer-review`)
`R4` -> PRs that needs clarification or exemption (`pr/reviewer-clarification-requested, pr-linter/exemption-requested`), draft state allowed
`R5` -> Non-draft PRs that are in needs-community-review more than 21 days (`pr/needs-community-review`)
`R6` -> P1 Bugs
`R7` -> Issues that needs SDE Input

### Work Status Labels
`Ready` -> Means the PR is ready to be picked up for review
`Assigned` -> Means a team member have picked the PR and assigned to themselves
`In progress` -> Currently being reviewed
`Paused` -> PR review is paused for some reason. Eg: security review
`Done` -> PR review is completed and merged or closed

### Needs Attention Labels
`Extended` -> If the status being in 7-14 days. Taking longer than expected
`Aging` -> If the status being in 14-21 days. Requires immediate attention
`Stalled` ->  If the status being in > 21 days. Critical attention required

These `Needs Attention` states apply to items in the following status labels:
- Ready: Awaiting assignment
- Assigned: Awaiting start
- In Progress: Under review
- Paused: Blocked/On hold

## Workflows

### Prioritized Backlog Workflow
1. PRs are automatically categorized by priority (`R1-R5`)
2. P1 Bugs are automatically categorized `R6` priority
3. Issues that needs SDE input are added manually to `R7` priority
2. Team members can select PRs from the Ready state
3. Status updates flow through: `Assigned` → `In Progress` → `Done/Paused`
4. Time-based monitoring labels are automatically applied in `Needs Attention` based on duration in each state

### My Items Workflow
1. PRs appear when assigned to you
2. Update status as you progress with reviews
3. Track your active reviews and blocked items
4. Monitor time-based alerts for your assignments

## Automation
- Priority labels are automatically assigned based on PR/Issue labels
- Time-based monitoring states are automatically updated daily
- Status changes trigger automatic label updates