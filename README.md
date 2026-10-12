# AI-Server public operations dashboard

A static React/Vite dashboard for the eight-workstream autonomous research system. The UI reads `status.json` and `activity.json` at runtime; snapshot generation is intentionally outside this repository.

## Public-safe mode

This repository and its GitHub Pages build must contain **redacted, public-safe operational metadata only**. Never publish credentials, patient or participant data, private paths, hostnames, raw logs, unpublished scientific results, or internal repository details. The placeholder JSON files are safe defaults and may be replaced by the authorized exporter.

`DASHBOARD_SECURE_AUTH=NOT_CONFIGURED`

GitHub Pages is public static hosting and provides no application authentication in this configuration. Do not treat obscurity as access control.

## Local development

```sh
npm ci
npm test
npm run build
npm run dev
```

Progress is shown as determinate only when the snapshot supplies a numeric value. Otherwise the UI displays an explicit stage, or states that progress is not quantified. Human-review readiness likewise requires `readyForHuman: true`; status text alone never opens that gate.

## Deployment

Pushes to `main` run tests, build the static app, and deploy the `dist` artifact through GitHub Pages. The workflow uses minimal `contents: read`, `pages: write`, and `id-token: write` permissions and serializes deployments through a concurrency group.
