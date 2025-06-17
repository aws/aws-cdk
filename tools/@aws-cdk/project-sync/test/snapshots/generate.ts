import {Github} from '../../lib/github.js'
import * as fs from 'node:fs/promises';
import { join } from 'node:path';

if (!process.env.GITHUB_TOKEN) {
    throw new Error('GITHUB_TOKEN is not set')
}

const gh = new Github(process.env.GITHUB_TOKEN);

(async () => {
    await fs.writeFile(join(__dirname, 'get-project-info.json'), JSON.stringify(await gh.getProjectInfo(process.env.PROJECT_NUMBER ?? '302')))
    for(const issue of ["15891", "41", "33208", "30793"])
        await fs.writeFile(join(__dirname, 'get-issue', `${issue}.json`), JSON.stringify(await gh.getIssue(issue)))
})();