# Deploy Your Pull Request to Google Cloud Run.

With this action you can deploy your Pull Requests as a unique preview environments on google cloud run.

### required google cloud services

- google artifact registry (to store the docker containers)
- google cloud run (to run the containers in unique urls as serverless apps )

### authentication

Since v1 the action authenticates with Workload Identity Federation (no keys);
v0.x releases take a JSON key instead. The service account needs
`roles/artifactregistry.writer` on the registry repository (plus reader on any
repository your Dockerfile pulls base images from), `roles/run.developer` on the
Cloud Run service, `roles/iam.serviceAccountUser` on the service's runtime
service account, and `roles/iam.workloadIdentityUser` granted to your repository
through your Workload Identity Provider. The calling job needs
`id-token: write`.

### params

the following params are required.

- GOOGLE_CLOUD_PROJECT_ID: project id in the google cloud
- WORKLOAD_IDENTITY_PROVIDER: full resource name of the workload identity provider
- SERVICE_ACCOUNT: email of the service account to deploy as
- CLOUD_RUN_SERVICE_NAME: google cloud run service name
- CLOUD_RUN_REGION: google cloud run region for the service
- ARTIFACT_REGISTRY_REGION: google artifact registry region
- ARTIFACT_REGISTRY_REPO: google artifact registry repo
- ARTIFACT_REGISTRY_IMAGE: google artifact registry image name

optional:

- DOCKER_BUILD_ARGS: extra flags appended to `docker buildx build` (e.g. `--build-arg env=stage`).
  split on whitespace, so values cannot contain spaces.

### notes

- the calling workflow **must** run `actions/checkout` itself; this action no longer
  checks out, so anything you build in earlier steps survives into the build context.
- build layers are cached in artifact registry under the `:buildcache` tag of your image,
  shared across every pull request in the repo.

### example

```yaml
name: Pull Request Preview

on:
  pull_request:
    branches:
      - main

permissions: {}

env:
  PROJECT_ID: <project-id>
  SERVICE: my-super-awesome-serivce
  REGION: europe-west1
  GAR_LOCATION: europe-west1
  GAR_REPO: my-super-awesome-repo
  GAR_IMAGE: my-super-awesome-api

jobs:
  preview:
    name: Building and Deploying the Image
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write # Workload Identity Federation login to GCP
      pull-requests: write # comment the preview link

    steps:
      - uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
        with:
          persist-credentials: false
      - id: preview
        uses: poltio/action-pr-preview@<sha> # v1.0.0
        with:
          GOOGLE_CLOUD_PROJECT_ID: ${{ env.PROJECT_ID }}
          WORKLOAD_IDENTITY_PROVIDER: projects/<project-number>/locations/global/workloadIdentityPools/<pool>/providers/<provider>
          SERVICE_ACCOUNT: <deployer>@<project-id>.iam.gserviceaccount.com
          CLOUD_RUN_SERVICE_NAME: ${{ env.SERVICE }}
          CLOUD_RUN_REGION: ${{ env.REGION }}
          ARTIFACT_REGISTRY_REGION: ${{ env.GAR_LOCATION }}
          ARTIFACT_REGISTRY_REPO: ${{ env.GAR_REPO }}
          ARTIFACT_REGISTRY_IMAGE: ${{ env.GAR_IMAGE }}
```

### TODO: 

- [ ] Better description in the readme with links to related google cloud actions and how to enable the services/apis and generate the auth key 
- [ ] More visuals in the readme with example PR screen shots 


