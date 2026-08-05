# Releasing

This document describes the process for creating and publishing a new release of the Chrome extension.

## Prerequisites

Before creating a release:

* Make sure the working tree is clean.
* Make sure all intended changes have been merged.
* Make sure CI is passing on the commit being released.
* Make sure you are on the `main` branch.

## Release process

### 1. Choose the version increment

Use [Semantic Versioning](https://semver.org/) to determine whether the release is a:

* `patch` — bug fixes and other backwards-compatible fixes
* `minor` — backwards-compatible new functionality
* `major` — breaking changes

### 2. Bump the version and create the Git tag

Run:

```bash
npm version <patch|minor|major>
```

For example:

```bash
npm version patch
```

This updates the project version, updates the extension manifest version, creates a Git commit, and creates the corresponding Git tag.

**Do not manually edit the version before running this command.**

### 3. Push the release commit and tag

Run:

```bash
git push --follow-tags
```

This pushes the version commit and its newly created Git tag to GitHub.

### 4. Create the GitHub Release

On GitHub:

1. Open the repository's **Releases** page.
2. Find the newly pushed tag.
3. Create a GitHub Release for that tag.
4. Add release notes as appropriate.
5. Publish the release.

### 5. Verify the deployment

Creating the GitHub Release triggers `publish.yml`.

`publish.yml` builds and publishes the updated extension to the Chrome Web Store.

After the workflow completes:

1. Check the GitHub Actions run for `publish.yml`.
2. Confirm that the deployment succeeded.
3. Verify the new extension version in the Chrome Web Store.

## Quick reference

For a normal patch release:

```bash
npm version patch
git push --follow-tags
```

For a minor release:

```bash
npm version minor
git push --follow-tags
```

For a major release:

```bash
npm version major
git push --follow-tags
```

Then create the GitHub Release for the newly created tag.

## Release flow

```text
npm version <patch|minor|major>
        │
        ├── Updates package.json
        ├── Updates manifest.json
        ├── Creates release commit
        └── Creates Git tag
                │
                ▼
       git push --follow-tags
                │
                ▼
             GitHub
                │
                ▼
        Create GitHub Release
                │
                ▼
          publish.yml
                │
                ▼
        Chrome Web Store
```