const RENDER_API = 'https://api.render.com/v1';
const MAX_ATTEMPTS = 20;
const POLL_INTERVAL_MS = 15_000;

async function triggerDeploy(apiKey, serviceId) {
  const response = await fetch(`${RENDER_API}/services/${serviceId}/deploys`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to trigger Render deploy: ${response.statusText}`);
  }

  const deploy = await response.json();
  return deploy.id;
}

async function checkDeployStatus(apiKey, serviceId, deployId) {
  const response = await fetch(
    `${RENDER_API}/services/${serviceId}/deploys/${deployId}`,
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    },
  );

  if (!response.ok) {
    return;
  }

  const deploy = await response.json();
  return deploy.status;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function waitForDeploy(apiKey, serviceId, deployId, utils) {
  const failedStatuses = new Set(['deactivated', 'build_failed', 'canceled']);

  const pollStatus = async attempt => {
    if (attempt > MAX_ATTEMPTS) {
      return utils.build.failBuild('Render deployment timed out');
    }

    const status = await checkDeployStatus(apiKey, serviceId, deployId);
    console.info(
      `Deploy status: ${status} (attempt ${attempt}/${MAX_ATTEMPTS})`,
    );

    if (status === 'live') {
      console.info('Render deployment successful');
      return;
    }

    if (failedStatuses.has(status)) {
      return utils.build.failBuild(
        `Render deployment failed with status: ${status}`,
      );
    }

    await sleep(POLL_INTERVAL_MS);
    return pollStatus(attempt + 1);
  };

  return pollStatus(1);
}

export const onPreBuild = async function ({ utils }) {
  const { RENDER_API_KEY, RENDER_SERVICE_ID } = process.env;

  if (!RENDER_API_KEY || !RENDER_SERVICE_ID) {
    return utils.build.failBuild(
      'Missing RENDER_API_KEY or RENDER_SERVICE_ID environment variables',
    );
  }

  console.info('Triggering Render deployment...');

  const deployId = await triggerDeploy(RENDER_API_KEY, RENDER_SERVICE_ID);
  console.info(`Render deploy triggered: ${deployId}`);

  return waitForDeploy(RENDER_API_KEY, RENDER_SERVICE_ID, deployId, utils);
};
