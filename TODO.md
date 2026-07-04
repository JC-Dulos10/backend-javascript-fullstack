# TODO

- [ ] Fix broken Jest test file: `src/routes/__tests__/auth.routes.integration.spec.ts` (currently has syntax/structure errors causing TS1128/TS1005/etc.).
- [ ] Fix missing `loginSchema` export in `src/validators/auth.validator.ts` to satisfy unit tests (currently only `registerSchema` exists, but tests import `loginSchema`).
- [ ] Re-run `npm test` to confirm all Jest suites pass.

