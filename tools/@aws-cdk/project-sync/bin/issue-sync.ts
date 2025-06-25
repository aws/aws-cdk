import { syncIssue } from '../lib/issue-sync';

if (process.env.ISSUE_NUMBER === undefined) {throw Error('Environment variable ISSUE_NUMBER is not defined');}

syncIssue(process.env.ISSUE_NUMBER).then(console.log).catch(console.error);
