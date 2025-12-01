#!/bin/bash

# Helper script to setup GCP resources for CRMDesecontro
# Usage: ./gcp-setup.sh <PROJECT_ID> <REGION>

PROJECT_ID=$1
REGION=$2

if [ -z "$PROJECT_ID" ] || [ -z "$REGION" ]; then
    echo "Usage: ./gcp-setup.sh <PROJECT_ID> <REGION>"
    exit 1
fi

echo "Setting up GCP resources for project: $PROJECT_ID in region: $REGION"

# Enable APIs
echo "Enabling APIs..."
gcloud services enable run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    sqladmin.googleapis.com \
    secretmanager.googleapis.com \
    storage.googleapis.com \
    iamcredentials.googleapis.com \
    --project $PROJECT_ID

# Create Artifact Registry repositories
echo "Creating Artifact Registry repositories..."
gcloud artifacts repositories create crm-backend --repository-format=docker --location=$REGION --project $PROJECT_ID
gcloud artifacts repositories create crm-frontend --repository-format=docker --location=$REGION --project $PROJECT_ID

# Create Service Account for GitHub Actions
echo "Creating Service Account..."
gcloud iam service-accounts create github-actions-deployer --display-name "GitHub Actions Deployer" --project $PROJECT_ID

# Grant permissions
echo "Granting permissions..."
SA_EMAIL="github-actions-deployer@${PROJECT_ID}.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SA_EMAIL" --role="roles/run.admin"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SA_EMAIL" --role="roles/artifactregistry.writer"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SA_EMAIL" --role="roles/cloudsql.client"
gcloud projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SA_EMAIL" --role="roles/iam.serviceAccountUser"

echo "Setup complete! Don't forget to create your Cloud SQL instance and configure GitHub Secrets."
