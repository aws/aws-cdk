import { syncIssue, getGithubClient } from "../lib/issue-sync";

async function syncP1BugIssues() {
  try {
    const github = getGithubClient();
    const requiredLabels = ['p1', 'bug'];
    
    console.log('Fetching open issues with P1 label...');
    
    let hasNextPage = true;
    let cursor: string | undefined = undefined;
    let allFilteredIssues: { number: number, title: string }[] = [];
    
    // Use pagination to fetch all issues
    while (hasNextPage) {
      // We'll search for the first label and then filter for the second one
      const response = await github.queryIssues([requiredLabels[0]], 'OPEN', cursor);
      
      if (!response.data?.repository?.issues?.nodes) {
        console.error('Failed to fetch issues or no issues found');
        break;
      }
      
      const pageInfo = response.data.repository.issues.pageInfo;
      hasNextPage = pageInfo.hasNextPage;
      cursor = pageInfo.endCursor;
      
      // Filter issues that have all required labels
      const issues = response.data.repository.issues.nodes;
      const filteredIssues = issues.filter((issue: any) => {
        const issueLabels = issue.labels.nodes.map((label: any) => label.name);
        return requiredLabels.every(requiredLabel => issueLabels.includes(requiredLabel));
      });
      
      allFilteredIssues = [...allFilteredIssues, ...filteredIssues];
      
      console.log(`Fetched page with ${issues.length} issues, found ${filteredIssues.length} with both P1 and bug labels`);
      
      // Add a small delay between requests to avoid hitting rate limits
      if (hasNextPage) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log(`Found a total of ${allFilteredIssues.length} open issues with both P1 and bug labels`);
    
    // Process each filtered issue sequentially
    for (const issue of allFilteredIssues) {
      const issueNumber = issue.number.toString();
      console.log(`Processing issue #${issueNumber}: ${issue.title}`);
      
      try {
        await syncIssue(issueNumber);
        console.log(`Successfully synced issue #${issueNumber}`);
      } catch (error) {
        console.error(`Error syncing issue #${issueNumber}:`, error);
      }
      
      // Add a small delay between requests to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('Finished syncing all P1 bug issues');
  } catch (error) {
    console.error('Error in syncP1BugIssues:', error);
  }
}

// Execute the function
syncP1BugIssues().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
