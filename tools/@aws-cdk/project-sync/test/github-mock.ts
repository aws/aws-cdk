import * as fs from 'node:fs/promises';
import { join } from 'node:path';

export class GithubMock {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  authGraphQL(_query: string) : Promise<any> {
    throw Error('Not implemented in the mock.');
  }

  async getProjectInfo(_projectId: string) {
    return JSON.parse((await fs.readFile(join(__dirname, 'snapshots', 'get-project-info.json'))).toString());
  }

  async getIssue(issue: string) {
    return JSON.parse((await fs.readFile(join(__dirname, 'snapshots', 'get-issue', `${issue}.json`))).toString());
  }

  async getPr(pr: string) {
    return JSON.parse((await fs.readFile(join(__dirname, 'snapshots', 'get-pr', `${pr}.json`))).toString());
  }

  async setProjectItem(_projectId: string, _itemId: string, _fields: Record<
    string,
        {date: Date} | {text: string} | {number: number} | {singleSelectOptionId: string} | {iterationId: string}
  >): Promise<any> {
    // Mock implementation that just returns success
    return { success: true };
  }

  queryIssues(_labels: string[], _state: 'OPEN' | 'CLOSED' | 'ALL' = 'OPEN', _cursor?: string): Promise<any> {
    throw Error('Not implemented in the mock.');
  }
}
