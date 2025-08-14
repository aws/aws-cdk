import { PROJECT_NUMBER } from './config';
import { Github } from './github';
import { syncIssueData } from './issue-sync';
import { syncPrData } from './pr-sync';

export async function syncAll() {
  try {
    const github = Github.default();

    console.log(`Fetching all items from project ${PROJECT_NUMBER}...`);

    let hasNextPage = true;
    let cursor: string | undefined = undefined;
    let issueCounter = 0;

    // Use pagination to fetch all issues from project
    while (hasNextPage) {
      const response = await github.getProjectItems(PROJECT_NUMBER, cursor);

      if (!response.data?.repository?.projectV2?.items?.nodes) {
        console.error('Failed to fetch project items or no items found');
        break;
      }

      const pageInfo = response.data.repository.projectV2.items.pageInfo;
      hasNextPage = pageInfo.hasNextPage;
      cursor = pageInfo.endCursor;

      // Extract issues and PRs from project items
      const projectItems = response.data.repository.projectV2.items.nodes;
      const issues = projectItems
        .filter((item: any) => item.content?.number != undefined && item.content?.__typename == 'Issue')
        .map((item: any) => item.content);
      const prs = projectItems
        .filter((item: any) => item.content?.number != undefined && item.content?.__typename == 'PullRequest')
        .map((item: any) => item.content);

      console.log(`Fetched page with ${projectItems.length} project items, found ${issues.length} issues and ${prs.length} PRs`);
      issueCounter += issues.length;

      // Process each issue sequentially
      for (const issue of issues) {
        const issueNumber = issue.number.toString();
        console.log(`Processing issue #${issueNumber}: ${issue.title}`);

        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          await syncIssueData(issue);
          console.log(`Successfully synced issue #${issueNumber}`);
        } catch (error) {
          console.error(`Error syncing issue #${issueNumber}:`, error);
        }
      }

      // Process each PR sequentially
      for (const pr of prs) {
        const prNumber = pr.number.toString();
        console.log(`Processing PR #${prNumber}: ${pr.title}`);

        try {
          await new Promise(resolve => setTimeout(resolve, 500));
          await syncPrData(pr);
          console.log(`Successfully synced PR #${prNumber}`);
        } catch (error) {
          console.error(`Error syncing PR #${prNumber}:`, error);
        }
      }
    }

    console.log(`Finished syncing ${issueCounter} issue(s) from project 302`);
  } catch (error) {
    console.error('Error in syncAllIssues:', error);
  }
}
