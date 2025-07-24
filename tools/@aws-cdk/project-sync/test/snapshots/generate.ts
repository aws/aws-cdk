import { Github } from '../../lib/github.js';
import { PROJECT_NUMBER } from '../../lib/config.js';
import * as fs from 'node:fs/promises';
import { join } from 'node:path';

const gh = Github.default();

(async () => {
  await fs.writeFile(join(__dirname, 'get-project-info.json'), JSON.stringify(await gh.getProjectInfo(PROJECT_NUMBER)));
  for (const issue of ['15891', '41', '33208', '30793']) {await fs.writeFile(join(__dirname, 'get-issue', `${issue}.json`), JSON.stringify(await gh.getIssue(issue)));}

  for (const pr of ['34962']) {await fs.writeFile(join(__dirname, 'get-pr', `${pr}.json`), JSON.stringify(await gh.getPr(pr)));}
})().catch(console.error);
