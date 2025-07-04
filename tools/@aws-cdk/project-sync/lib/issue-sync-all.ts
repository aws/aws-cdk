import { PROJECT_NUMBER } from './config';
import { Github } from './github';
import { syncIssueData } from './issue-sync';

export async function syncAllIssues() {
  try {
    const github = Github.default();

    console.log(`Fetching all issues from project ${PROJECT_NUMBER}...`);

    let hasNextPage = true;
    let cursor: string | undefined = undefined;
    let issueCounter = 0;

    // Use pagination to fetch all issues from project
    while (hasNextPage) {
      const response = await github.getProjectIssues(PROJECT_NUMBER, cursor);

      if (!response.data?.repository?.projectV2?.items?.nodes) {
        console.error('Failed to fetch project items or no items found');
        break;
      }

      const pageInfo = response.data.repository.projectV2.items.pageInfo;
      hasNextPage = pageInfo.hasNextPage;
      cursor = pageInfo.endCursor;

      // Extract issues from project items
      const projectItems = response.data.repository.projectV2.items.nodes;
      const issues = projectItems
        .filter((item: any) => item.content?.number != undefined)
        .map((item: any) => item.content);

      console.log(`Fetched page with ${projectItems.length} project items, found ${issues.length} issues`);
      issueCounter += issues.length;

      // Process each issue sequentially
      for (const issue of issues) {
        const issueNumber = issue.number.toString();
        console.log(`Processing issue #${issueNumber}: ${issue.title}`);

        try {
          await syncIssueData(issue);
          console.log(`Successfully synced issue #${issueNumber}`);
        } catch (error) {
          console.error(`Error syncing issue #${issueNumber}:`, error);
        }

        // Add a small delay between requests to avoid hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    console.log(`Finished syncing ${issueCounter} issue(s) from project 302`);
  } catch (error) {
    console.error('Error in syncAllIssues:', error);
  }
}
