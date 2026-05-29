// backend/src/services/jiraService.js

const createJiraIssueFromTicket = async () => {
  console.info('Jira integration pending company authorization.');
  return { skipped: true, reason: 'authorization_pending' };
};

export { createJiraIssueFromTicket };
