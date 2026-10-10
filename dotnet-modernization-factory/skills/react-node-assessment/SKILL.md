# Skill: React/Node Windows-to-Linux Assessment

Inspect `package.json`, lockfiles, `.nvmrc`, `.node-version`, CI workflows, scripts, build output, bundler configuration, server entry points, Windows paths, shell commands, native npm modules, environment variables, TLS/certificate assumptions, file uploads, writable paths, and existing IIS/Nginx/proxy configuration.

Classify as:
- React static frontend served by Nginx;
- Node.js API/service;
- combined React + Node.js repository;
- unknown / human review.

Verify build scripts and output directory from repository evidence. Recommend `npm ci` only when a compatible committed lockfile exists. Flag Node.js 18 as EOL and require an explicit exception or supported-LTS decision.
