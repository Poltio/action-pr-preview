module.exports = async ({ github, context }) => {
  // Read the URL safely from the environment block
  const deployUrl = process.env.DEPLOY_URL;
  const commentBody = `✅ Changes in this PR is deployed. To view the working copy please visit the following link: \n\n\n🔗 ${deployUrl}`;

  // Get the existing comments.
  const { data: comments } = await github.rest.issues.listComments({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: context.payload.number,
  });

  // Find any comment already made by the bot.
  const botComment = comments.find((comment) => comment.user.id === 41898282);

  if (botComment) {
    // If the comment exists, update it.
    await github.rest.issues.updateComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      comment_id: botComment.id,
      body: commentBody,
    });
  } else {
    // First time commenting.
    await github.rest.issues.createComment({
      owner: context.repo.owner,
      repo: context.repo.repo,
      issue_number: context.payload.number,
      body: commentBody,
    });
  }

  // Create new deployment to post the preview link on PR.
  const deployment = await github.rest.repos.createDeployment({
    owner: context.repo.owner,
    repo: context.repo.repo,
    ref: context.payload.pull_request.head.sha,
    environment: "stage",
    description: commentBody,
    required_contexts: [],
  });

  // Setup environment_url so we can see the preview url on bottom of PR page
  await github.rest.repos.createDeploymentStatus({
    state: "success",
    environment_url: deployUrl,
    owner: context.repo.owner,
    repo: context.repo.repo,
    deployment_id: deployment.data.id,
    auto_merge: false,
  });
};
