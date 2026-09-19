import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

let runtimeEnvLoaded = false;

const parseEnvValue = (value: string) => {
  const trimmed = value.trim();
  const quote = trimmed[0];

  if ((quote === '"' || quote === "'") && trimmed.endsWith(quote)) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
};

/**
 * Loads local runtime configuration for the standalone Astro adapter without
 * replacing values injected by the process manager. It intentionally returns
 * no values and never logs them, so credentials remain server-only.
 */
export const loadRuntimeEnvFiles = () => {
  if (runtimeEnvLoaded) return;
  runtimeEnvLoaded = true;

  const externallyInjectedKeys = new Set(Object.keys(process.env));
  const envFiles = [join(process.cwd(), '.env'), join(process.cwd(), '.env.local')];

  for (const envFile of envFiles) {
    if (!existsSync(envFile)) continue;

    for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
      const match = line.match(/^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!match || externallyInjectedKeys.has(match[1])) continue;

      process.env[match[1]] = parseEnvValue(match[2]);
    }
  }
};

export const getRuntimeEnv = (key: string) => {
  loadRuntimeEnvFiles();
  const value = process.env[key];
  return typeof value === 'string' ? value : undefined;
};

export const getTrimmedRuntimeEnv = (key: string) => {
  const value = getRuntimeEnv(key);
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
};
