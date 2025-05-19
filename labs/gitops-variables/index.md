# Injecting Application Version from Git Tag into a Python Flask App

## Overview

In this lab, you'll enhance your GitOps pipeline by dynamically injecting the current Git tag (used for versioning) into your Python application at runtime. This allows the app to report its deployed version automatically, which is a best practice for traceability, observability, and release auditing.

You'll achieve this by:

- Reading the tag version as an environment variable in your Flask app
- Passing that value from GitHub Actions using Docker build arguments
- Confirming that the app displays the version in its web response

This practical enhancement for real-world CI/CD workflows prepares your applications for better operational insight.

## Step 1: Update Your Flask App to Display the Version

Edit `main.py` to read the version from an environment variable:

```python
import os
from flask import Flask

app = Flask(__name__)
version = os.getenv("APP_VERSION", "unknown")

@app.route('/')
def index():
    return f'Hello Argo CD {version}!'

app.run(host='0.0.0.0', port=8080)
```

### Explanation:

- `import os` brings in Python’s built-in `os` module, which allows your application to interact with the operating system, including reading environment variables.
- `os.getenv("APP_VERSION", "unknown")` reads the `APP_VERSION` environment variable at runtime.
- If it’s not set, it defaults to `unknown`.
- This allows you to inject any version value during container build or runtime.

## Step 2: Modify the Dockerfile to Accept and Set a Build ARG

Update your `Dockerfile` as follows:

```dockerfile
FROM python:3.8-alpine
WORKDIR /py-app
COPY . .
RUN pip3 install flask

# Accept a build argument and set it as an environment variable
ARG APP_VERSION=latest
ENV APP_VERSION=$APP_VERSION

EXPOSE 8080
CMD ["python3", "main.py"]
```

### Explanation:

- `ARG APP_VERSION=latest` allows the build process to specify a version
- `ENV APP_VERSION=$APP_VERSION` passes that version to the container’s runtime environment
- This makes the value available to `main.py` via `os.getenv()`

## Step 3: Update GitHub Actions Workflow to Pass the Tag

Edit your `release.yaml` in `.github/workflows/` to include a `build-args` section:

```yaml
- name: Build and Push
  uses: docker/build-push-action@v5
  with:
    context: .
    push: true
    tags: docker.io/${{ secrets.REGISTRY_USER }}/example-application:${{ env.TAG_NAME }}
    build-args: |
      APP_VERSION=${{ env.TAG_NAME }}
```

### Explanation:

- The `TAG_NAME` environment variable is derived from the Git tag (`v1.0.0`, `v1.1.0`, etc.)
- This is passed to the Docker build as a `build-arg`
- The image will be built with the appropriate `APP_VERSION` set

## Step 4: Commit All Changes and Tag the Release

Use the **Source Control panel in GitHub Codespaces** to stage, commit, and push your changes:

1. Click the Source Control icon in the left sidebar

2. Enter a commit message like:

   ```
   Update app for version injection
   ```

3. Click **Commit & Push**

Then open the terminal and run:

```
git tag v2.0.0
git push origin v2.0.0
```

### Why this matters:

Tags in Git reference specific commits. If you skip committing your changes before tagging, your tag will reference an outdated code version.

## Step 5: Confirm the Application Displays the Version

1. Open the `example-environment` repository in GitHub
2. You will see a pull request created by the GitHub Actions workflow
3. Review and **merge the pull request into the** `**main**` **branch**
4. Wait for Argo CD to detect and apply the updated manifest
5. Access your application via its LoadBalancer DNS or IP
6. You should see:

```
Hello Argo CD v2.0.0!
```

This confirms that the Git tag has been successfully injected and surfaced in the running application.

## Summary and Congratulations

You’ve now extended your GitOps workflow to inject application version metadata from Git tags directly into your application's runtime behavior.

This enhancement improves:

- **Traceability** – You always know what version is deployed
- **Observability** – You can verify versions through simple health checks or monitoring
- **Best Practices** – Versioned deployments are easier to debug, roll back, and audit

You can apply this pattern to more complex apps and multi-service environments. Great work.