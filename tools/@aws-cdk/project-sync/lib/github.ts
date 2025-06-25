import { REPOSITORY, REPOSITORY_OWNER } from './config';

const issueQuery = `
  createdAt
  timelineItems(last: 100) {
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
  projectItems(first: 100) {
    nodes {
      id
      project {
          number
      }
    }
  }
`;

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
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `token ${this.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`GitHub GraphQL request failed: ${response.statusText}`);
    }

    return response.json();
  }

  getProjectIssues(project: string, cursor?: string) {
    return this.authGraphQL(`
      query {
        repository(owner: "${REPOSITORY_OWNER}", name: "${REPOSITORY}") {
          projectV2(number: ${project}) {
            items(first: 100 ${cursor ? `, after: "${cursor}"` : ''}) {
              pageInfo {
                  hasNextPage
                  endCursor
              }
              nodes {
                content {
                  ... on Issue {
                    number
                    title
                    ${issueQuery}
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
