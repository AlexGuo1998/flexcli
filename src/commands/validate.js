// commands/validate.js
import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import logger from '../utils/logger.js';

import manifestSchema from '../assets/manifest_schema.json' with { type: 'json' };

export default async function validateCommand(wsClient, options) {
  const ajv = new Ajv();

  const { path: pluginPath } = options;
  const fullPath = path.resolve(pluginPath);

  // 1. Check required files and directories
  const uiDir = path.join(fullPath, 'ui');
  const resourcesDir = path.join(fullPath, 'resources');
  const manifestFile = path.join(fullPath, 'manifest.json');

  if (!fs.existsSync(uiDir)) {
    throw new Error(`Missing ui folder: ${uiDir}`);
  }
  if (!fs.existsSync(manifestFile)) {
    throw new Error(`Missing manifest file: ${manifestFile}`);
  }
  if (!fs.existsSync(resourcesDir)) {
    throw new Error(`Missing resources folder: ${resourcesDir}`);
  }

  // 2. Parse and validate manifest.json
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));
  } catch (e) {
    throw new Error(`Failed to parse manifest.json: ${e.message}`);
  }

  const validateManifest = ajv.compile(manifestSchema);
  if (!validateManifest(manifest)) {
    throw new Error(`Invalid manifest.json: ${ajv.errorsText(validateManifest.errors)}`);
  }

  // check if entry exists
  const backendJs = path.join(fullPath, manifest.entry);
  if (!fs.existsSync(backendJs)) {
    throw new Error(`Missing entry file: ${backendJs}`);
  }

  logger.info(`Validation succeeded for plugin: ${fullPath}`);
    return true;
}
