import { REPOSITORY, REPOSITORY_OWNER } from './config';
import { backOff } from 'exponential-backoff';

const issueQuery = `
  createdAt
  author {
    login
  }
  labels(first: 32) {
    nodes {
      name
    }
  }
  timelineItems(last: 16) {
    nodes{
      ... on IssueComment {
        createdAt
        author {
            login
        }
      }
      ... on CrossReferencedEvent {
        createdAt
        actor {
            login
        }
      }
      ... on ClosedEvent {
        createdAt
        actor {
            login
        }
      }
      ... on ReopenedEvent {
        createdAt
        actor {
            login
        }
      }
      ... on LabeledEvent {
        createdAt
        actor {
            login
        }
      }
      ... on UnlabeledEvent {
        createdAt
        actor {
            login
        }
      }
      ... on AssignedEvent {
        createdAt
        actor {
            login
        }
      }
      ... on UnassignedEvent {
        createdAt
        actor {
            login
        }
      }
    }
  }
  reactions(last: 1) {
    nodes {
      createdAt
    }
  }
  projectItems(first: 16) {
    nodes {
      id
      project {
          number
      }
    }
  }
`;

const prQuery = `
  createdAt
  author {
    login
  }
  labels(first: 32) {
    nodes {
      name
    }
  }
  timelineItems(last: 16) {
    nodes {
      ... on PullRequestCommit {
        commit {
          committedDate
          author {
            user {
              login
            }
          }
        }
      }
      ... on IssueComment {
        createdAt
        author {
          login
        }
      }
      ... on CrossReferencedEvent {
        createdAt
        actor {
            login
        }
      }
      ... on ClosedEvent {
        createdAt
        actor {
            login
        }
      }
      ... on ReopenedEvent {
        createdAt
        actor {
            login
        }
      }
      ... on LabeledEvent {
        createdAt
        actor {
            login
        }
      }
      ... on UnlabeledEvent {
        createdAt
        actor {
            login
        }
      }
      ... on AssignedEvent {
        createdAt
        actor {
            login
        }
      }
      ... on UnassignedEvent {
        createdAt
        actor {
            login
        }
      }
    }
  }
  reactions(last: 1) {
    nodes {
      createdAt
    }
  }
  projectItems(first: 16) {
    nodes {
      id
      project {
          number
      }
    }
  }
`;

const backoffOptions = {
  numOfAttempts: 10,
  startingDelay: 1000,
  timeMultiple: 2,
  maxDelay: 60000,
  retry: (error: Error) => {
    console.log(`GitHub API request failed, retrying: ${error.message}`);
    return true;
  },
};

export class Github {
  static default(): Github {
    if (!process.env.GITHUB_TOKEN) {
      throw new Error('GITHUB_TOKEN is not set');
    }

    return new Github(process.env.GITHUB_TOKEN);
  }

  token: string;

  constructor(token: string) {
    this.token = token;
  }

  async authGraphQL(query: string) {
    return backOff(async () => {
      const response = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Authorization': `token ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GitHub GraphQL request failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return response.json();
    }, backoffOptions);
  }

  getProjectItems(project: string, cursor?: string) {
    return this.authGraphQL(`
      query {
        repository(owner: "${REPOSITORY_OWNER}", name: "${REPOSITORY}") {
          projectV2(number: ${project}) {
            items(first: 50 ${cursor ? `, after: "${cursor}"` : ''}) {
              pageInfo {
                  hasNextPage
                  endCursor
              }
              nodes {
                content {
                  ... on Issue {
                    __typename
                    number
                    title
                    ${issueQuery}
                  }
                  ... on PullRequest {
                    __typename
                    number
                    title
                    ${prQuery}
                  }
                }
              }
            }
          }
        }
      }
    `);
  }

  getProjectInfo(project: string) {
    return this.authGraphQL(`
      query {
        repository(owner: "${REPOSITORY_OWNER}", name: "${REPOSITORY}") {
          projectV2(number: ${project}) {
            id
            fields(first: 100) {
              nodes {
                ... on ProjectV2SingleSelectField {
                  id
                  name
                  options {
                    name
                    id
                  }
                }
                ... on ProjectV2Field {
                    id
                    name
                }
              }
            }
          }
        }
      }
  `);
  }

  getIssue(issue: string) {
    return this.authGraphQL(`
      query {
        repository(owner: "${REPOSITORY_OWNER}", name: "${REPOSITORY}") {
          issue(number: ${issue}) {
            ${issueQuery}
          }
        }
      }
    `);
  }

  getPr(pr: string) {
    return this.authGraphQL(`
      query {
        repository(owner: "${REPOSITORY_OWNER}", name: "${REPOSITORY}") {
          pullRequest(number: ${pr}) {
            ${prQuery}
          }
        }
      }
    `);
  }

  async setProjectItem(projectId: string, itemId: string, fields: Record<
    string,
        {date: Date} | {text: string} | {number: number} | {singleSelectOptionId: string} | {iterationId: string}
  >) {
    const results = [];
    for (const [key, value] of Object.entries(fields)) {
      results.push(await this.authGraphQL(`
        mutation {
          updateProjectV2ItemFieldValue(
            input: {
              projectId: "${projectId}",
              itemId: "${itemId}",
              fieldId: "${key}",
              value: {${Object.entries(value).map(([fieldKey, fieldValue]) => `${fieldKey}: ${JSON.stringify(fieldValue)}`).join(',')}}
            }
          ) {
            projectV2Item {
              id
            }
          }
        }
      `));
    }
    return results;
  }
}
