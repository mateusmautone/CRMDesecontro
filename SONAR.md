SonarCloud integration (quick start)

Overview
- This repository contains a backend and frontend with Jest coverage reports.
- This guide explains how to run SonarCloud scans in CI and locally.

1) Create a SonarCloud project
- Sign in at https://sonarcloud.io (you can use your GitHub account).
- Create an organization and a new project. Choose "Analyze with CI".
- Note these values: `Organization` (example: my-org) and `Project Key` (example: my-org_CRMDesecontro).

2) Add GitHub secrets
Go to your GitHub repository Settings → Secrets → Actions and add:
- `SONAR_TOKEN` : a token you create in SonarCloud (Administration → Security → Generate Tokens)
- `SONAR_ORG` : your SonarCloud organization key (e.g. `my-org`)
- `SONAR_PROJECT_KEY` : your SonarCloud project key (e.g. `my-org_CRMDesecontro`)

3) What I added to this repo
- `sonar-project.properties` : basic Sonar configuration at repo root (replace placeholders if desired).
- CI workflow (`.github/workflows/ci.yml`) was updated to run a SonarCloud scan step after tests run and coverage is generated.

4) Coverage files
- The workflow expects LCOV reports at:
  - `backend/coverage/lcov.info`
  - `frontend/coverage/lcov.info`
- If your test commands change the coverage output path, update `sonar.javascript.lcov.reportPaths` accordingly in `sonar-project.properties` or in the workflow args.

5) Run Sonar scan locally (optional)
- You can run the SonarScanner CLI locally (requires Java). Example using the official Docker image:

```bash
# generate coverage locally first
cd backend
npm test -- --coverage --coverageDirectory=coverage/backend --watchAll=false
cd ../frontend
npx jest --config jest.config.cjs --coverage --coverageDirectory=coverage/frontend --watchAll=false

# Run SonarScanner via Docker (replace placeholders)
docker run --rm \
  -e SONAR_HOST_URL="https://sonarcloud.io" \
  -e SONAR_LOGIN="<YOUR_SONAR_TOKEN>" \
  -v "$(pwd)":/usr/src \
  sonarsource/sonar-scanner-cli \
  -Dsonar.projectKey="REPLACE_WITH_YOUR_PROJECT_KEY" \
  -Dsonar.sources=. \
  -Dsonar.organization="REPLACE_WITH_YOUR_ORG" \
  -Dsonar.javascript.lcov.reportPaths=backend/coverage/lcov.info,frontend/coverage/lcov.info
```

6) Notes & troubleshooting
- If Sonar does not pick up coverage, confirm the `lcov.info` files exist and paths match.
- The CI step uses the SonarCloud GitHub Action which requires `SONAR_TOKEN` to be set in repository secrets.
- If you prefer a self-hosted SonarQube instance, change `sonar.host.url` accordingly and use a token for that instance.

If you want I can:
- Update `sonar-project.properties` with concrete `sonar.organization` and `sonar.projectKey` if you provide them.
- Add a small logger wrapper and remove/migrate `console.log` lines in the backend sources.
- Add a coverage gate in CI that fails when coverage is below thresholds.
