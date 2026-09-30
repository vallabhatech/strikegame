# Change Log

Step-by-step modernization, reliability, security, and documentation log.

## 2026-09-30

### Step 1 — Initialize change tracking
- Added an auditable maintenance log.
- No application behavior changed in this step.

### Step 2 — Clean up root project metadata
- Replaced placeholder root metadata and the failing default test command.
- Added a repository smoke test that delegates to the client test runner.
- Declared Node.js 18+ as the supported runtime baseline.

### Step 3 — Modernize client dependencies
- Upgraded the client from React 17 to React 18.
- Upgraded Create React App tooling and TypeScript.
- Added an explicit typecheck script.
- Removed the stale React Router dependency path from the main application flow.

### Step 4 — Tighten client TypeScript configuration
- Raised the compilation target to ES2020.
- Disabled JavaScript compilation.
- Enabled stricter indexed-access and switch checking.

### Step 5 — Refactor the multiplayer client
- Reworked socket listener lifecycle so listeners are registered and removed explicitly.
- Added configurable Socket.IO endpoint support through `REACT_APP_SOCKET_URL`.
- Added typed game state and socket payloads.
- Replaced the biased sort-based board shuffle with Fisher–Yates.
- Added lobby validation, accessible labels, and clearer game status.
- Removed optimistic strike updates so the server remains authoritative.

### Step 6 — Harden the game server
- Added nickname, room-code, board, membership, turn, and strike validation.
- Replaced `Math.random()` room codes with cryptographically generated codes.
- Added server-side win detection.
- Added restart handling.
- Added a `/health` endpoint.
- Added configurable port and frontend CORS origin.
- Disabled Express's powered-by header and limited JSON request size.

### Step 7 — Align server packaging
- Replaced the incorrect React-oriented server package configuration with scripts and dependencies matching the actual Node.js server.

### Step 8 — Add environment templates
- Added client and server `.env.example` files documenting deployment configuration.

### Step 9 — Add GitHub Actions CI
- Added CI for every push and pull request.
- Client checks: dependency install, TypeScript typecheck, production build.
- Server checks: syntax validation and high-severity dependency audit.
- Added a root smoke test.

### Step 10 — Add CodeQL
- Added JavaScript/TypeScript CodeQL scanning for pushes and pull requests.
- Added a weekly scheduled security scan using the security-extended query suite.

### Step 11 — Add responsive game interface
- Replaced placeholder utility-class styling with a self-contained responsive CSS interface.
- Added mobile-friendly board sizing, lobby/game states, focus states, and accessible status messaging.

### Step 12 — Rewrite documentation
- Replaced the stale README with documentation matching the current architecture.
- Added setup, environment, Socket.IO event, production, security, CI, testing, and scaling documentation.

## Verification

- Repository files were re-read from GitHub after the main edits.
- GitHub Actions workflows are configured to trigger automatically on every push and pull request.
- This environment cannot execute GitHub-hosted runner jobs directly; workflow commits trigger the hosted runs on GitHub.
- The repository has no committed npm lockfiles, so CI uses `npm install` rather than `npm ci`.
- Final runtime/build status must be taken from the GitHub Actions run results rather than assumed from static inspection.
- The final client/server synchronization fixes were committed after the initial workflow configuration so subsequent pushes will exercise the latest code.
