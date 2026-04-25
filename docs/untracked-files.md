# Untracked Local Files

This repository must not commit local runtime artifacts or tool scratch files by
default. Treat untracked files as local-only unless they are deliberately
promoted into the project as source, tests, configuration, or documentation.

Before committing, review `git status --short` and stage only files that belong
to the requested change. If a local tool creates workspace state, add a narrow
`.gitignore` entry for that path instead of committing it.

Current local-only paths:

- `.openchrome/` - browser automation state and scratch data generated during
  local agent sessions.

Lockfiles are an explicit exception when the package manager and CI require
reproducible installs. For this npm project, `package-lock.json` is intended to
be tracked so GitHub Actions can use `npm ci` and `actions/setup-node` caching.
