export class Github {
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
      throw new Error(`GitHub GraphQL request failed: ${response.statusText}`, this);
        }
        
        return response.json();
    }
    
    queryIssues(labels: string[], state: 'OPEN' | 'CLOSED' | 'ALL' = 'OPEN', cursor?: string) {
        // GraphQL query to get issues with specific labels, supporting pagination
        const query = `
            query {
                repository(owner: "aws", name: "aws-cdk") {
                    issues(first: 100, states: [${state}], ${cursor ? `after: "${cursor}",` : ''} filterBy: {labels: [${labels[0] ? `"${labels[0]}"` : ''}]}) {
                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                        nodes {
                            number
                            title
                            labels(first: 100) {
                                nodes {
                                    name
                                }
                            }
                        }
                    }
                }
            }
        `;
        
        return this.authGraphQL(query);
    }

    getProjectInfo(project: string) {
        return this.authGraphQL(`
            query {
                repository(owner: "aws", name: "aws-cdk") {
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
                repository(owner: "aws", name: "aws-cdk") {
                    issue(number: ${issue}) {
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
