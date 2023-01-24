# Deploy Your Pull Request to Google Cloud Run.

With this action you can deploy your Pull Requests as a unique preview environments on google cloud run.

### required google cloud services

- google artifact registry (to store the docker containers)
- google cloud run (to run the containers in unique urls as serverless apps )

### params

the following params are required.

- GOOGLE_CLOUD_PROJECT_ID: project id in the google cloud
- GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY: google cloud service account key in json format.
- CLOUD_RUN_SERVICE_NAME: google cloud run service name
- CLOUD_RUN_REGION: google cloud run region for the service
- ARTIFACT_REGISTRY_REGION: google artifact registry region
- ARTIFACT_REGISTRY_REPO: google artifact registry repo
- ARTIFACT_REGISTRY_IMAGE: google artifact registry image name

### example

```yaml
name: Pull Request Preview

on:
  pull_request:
    branches:
      - main

env:
  PROJECT_ID: ${{ secrets.GC_PROJECT_ID }}
  SERVICE: my-super-awesome-serivce
  REGION: europe-west1
  GAR_LOCATION: europe-west1
  GAR_REPO: my-super-awesome-repo
  GAR_IMAGE: my-super-awesome-api

jobs:
  preview:
    name: Building and Deploying the Image
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      - id: preview
        uses: poltio/action-pr-preview@main
        with:
          GOOGLE_CLOUD_PROJECT_ID: ${{ env.PROJECT_ID }}
          GOOGLE_CLOUD_SERVICE_ACCOUNT_KEY: ${{ secrets.GKE_SA_KEY }}
          CLOUD_RUN_SERVICE_NAME: ${{ env.SERVICE }}
          CLOUD_RUN_REGION: ${{ env.REGION }}
          ARTIFACT_REGISTRY_REGION: ${{ env.GAR_LOCATION }}
          ARTIFACT_REGISTRY_REPO: ${{ env.GAR_REPO }}
          ARTIFACT_REGISTRY_IMAGE: ${{ env.GAR_IMAGE }}
```

### TODO: 

- [ ] Better description in the readme with links to related google cloud actions and how to enable the services/apis and generate the auth key 
- [ ] More visuals in the readme with example PR screen shots 


