# GitHub Actions Workflows

## check-pr-statuses.yml

This workflow automatically checks PR statuses and updates statistics every 4 hours.

### Schedule
- Runs every 4 hours (0:00, 4:00, 8:00, 12:00, 16:00, 20:00 UTC)
- Can be manually triggered from Actions tab

### Required Secrets

You need to add these secrets in your GitHub repository:
1. Go to Settings → Secrets and variables → Actions
2. Add the following secrets:

#### ANTHROPIC_API_KEY (Required)
Your Claude API key for running Claude Code commands.
- Get it from: https://console.anthropic.com/account/keys

#### DATABASE_URL (Required)
The connection string for your database where PR statistics are stored.
- Format: `postgresql://user:password@host:port/database`

#### GITHUB_TOKEN (Automatic)
This is automatically provided by GitHub Actions, no setup needed.

### Manual Trigger
You can manually run the workflow from the Actions tab:
1. Go to Actions tab in your repository
2. Select "Check PR Statuses" workflow
3. Click "Run workflow"
4. Optionally enter a different Page ID
5. Click "Run workflow" button

### Monitoring
- Check the Actions tab for run history
- Failed runs will create an issue automatically
- Each run creates a summary in the workflow run page

### Customization
- To change schedule: Edit the cron expression in the workflow file
- To check different page IDs: Use manual trigger with custom input
- To disable issue creation on failure: Comment out the "Notify on Failure" step

### Troubleshooting
1. **Workflow not running**: Check if Actions are enabled in repository settings
2. **Authentication errors**: Verify ANTHROPIC_API_KEY secret is set correctly
3. **Database errors**: Check DATABASE_URL connection string
4. **Permission errors**: Ensure workflow has correct permissions in the yaml file