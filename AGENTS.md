% Repository Guidelines

## Project Structure & Module Organization

- `contracts/` – Hardhat 3 project with Solidity 0.8.28, tests in `test/` (TypeScript) and optional Solidity tests in `contracts/tests/`.
- `contracts/scripts/` – Deploy and utility scripts; `ignition/modules/` for Ignition deployments.
- `contracts/docs/` – Deployment, keystore, and addresses.
- `frontend/paynote/` – Next.js 15 + TypeScript + Tailwind app (wagmi/viem, RainbowKit). Assets in `public/`, app routes in `src/app/`.

## Build, Test, and Development Commands

- Contracts
  - Install: `cd contracts && npm install`
  - Compile: `npx hardhat compile`
  - Test: `npx hardhat test`
  - Deploy (Ignition): `npx hardhat ignition deploy ignition/modules/PayNoteRegistry.ts --network optimismSepolia`
  - Verify: `npx hardhat verify --network optimismSepolia --build-profile production <ADDRESS> <OWNER>`
- Frontend
  - Install: `cd frontend/paynote && npm install`
  - Dev server: `npm run dev`
  - Build/Start: `npm run build && npm start`
  - Lint/Types: `npm run lint` · `npm run typecheck`

## Coding Style & Naming Conventions

- TypeScript: 2-space indent; camelCase for vars/functions, PascalCase for React components; files kebab-case (e.g., `wallet-connect-button.tsx`). ESLint config lives in `frontend/paynote/eslint.config.mjs`.
- React/Next: colocate components in `src/components/` or feature folders; avoid default exports for shared UI.
- Solidity: SPDX headers, explicit visibility, events for state changes, `PayNoteRegistry` interface in `contracts/interfaces/`. Function names camelCase; constants UPPER_CASE.
- Scripts/tests: `contracts/test/*.ts`, Solidity tests `contracts/contracts/tests/*.t.sol`.

## Testing Guidelines

- Contracts: write unit tests in `contracts/test/` using Hardhat + chai (`npx hardhat test`). Prefer deterministic fixtures and assert on state/events.
- Frontend: use write unit tests in JEST —add tests where appropriate; ensure type-check passes.

## Commit & Pull Request Guidelines

- Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`, `dep:` (seen in history). Example: `feat: wallet button + /auth v0.1`.
- PRs: clear description, linked issues, scope-limited commits, screenshots or logs when UI/UX or deployment changes. Include steps to test.

## Security & Configuration

- Copy `contracts/.env.example` to `.env`; set RPC URLs, private keys, and Etherscan keys. Prefer Hardhat keystore: `npx hardhat keystore set <KEY>`.
- Never commit secrets; validate addresses and networks before deploying. See `contracts/docs/` for deployment and keystore guides.
