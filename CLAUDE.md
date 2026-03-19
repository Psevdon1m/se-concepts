# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Vue 3 (beta) + Vite (beta) single-page application using Vue Router 5. Uses Vue Vapor mode (beta channel for all `@vue/*` packages via npm overrides).

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — production build
- `npm run lint` — run oxlint then eslint (both with `--fix`), via `npm-run-all2`
- `npm run format` — format `src/` with oxfmt

## Tooling

- **Linting**: Two-pass — oxlint first (correctness category, plugins: eslint/unicorn/oxc/vue), then eslint (with eslint-plugin-oxlint to avoid duplicate rules). Prettier rules are disabled via eslint-config-prettier.
- **Formatting**: oxfmt (no semicolons, single quotes). Editor default formatter is `oxc.oxc-vscode`.
- **Path alias**: `@` maps to `./src` (configured in both `vite.config.js` and `jsconfig.json`).

## Code Style

- 2-space indentation, no semicolons, single quotes, LF line endings
- Max line length: 100 characters
- Vue SFCs use `<script setup>` composition API
