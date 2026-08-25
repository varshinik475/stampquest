# Deployment Checklist

## Release

- [x] Source is pushed to `main`.
- [x] `npm ci` completes from the committed lockfile.
- [x] `npm test` passes: 8 component tests.
- [x] `npm run test:e2e` passes: 1 primary-flow test.
- [x] `npm run build` completes successfully.
- [x] GitHub Actions runs tests on push and pull request.
- [x] Passing primary-flow screenshot is uploaded as a CI artifact.
- [x] Accessibility audit is recorded in [AUDIT.md](AUDIT.md).
- [x] AI route credentials are kept in environment variables, not source control.
- [ ] Public Vercel production URL: pending authenticated Vercel deployment. The existing preview is protected by Vercel SSO.

## Failure Behavior

- Chat API errors render an alert with technical details and a retry action.
- Streaming exposes a keyboard-reachable Stop button.
- Destination tool failures render a specific fallback state instead of a blank result.
- The 3D route falls back to a static passport composition for reduced-motion and low-power contexts.
- Travel data is stored locally, so the app remains useful without a database account.

## Rollback Plan

1. Revert the faulty change on `main` and push the revert.
2. Confirm GitHub Actions is green on the revert commit.
3. If Vercel is connected, promote the previous successful deployment; otherwise redeploy the previous known-good `main` commit.
4. Recheck `/`, `/passport`, `/chat`, and `/passport-orbit` before announcing recovery.

## Sign-off

Owner: K. Varshini  
Status: Ready for public deployment after Vercel authentication is configured.