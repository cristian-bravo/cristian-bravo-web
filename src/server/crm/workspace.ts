import { getRuntimeEnv, getTrimmedRuntimeEnv } from '../runtimeEnv';

const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '[::1]']);

/** Public entry URL only. CRM sessions and credentials never cross this link. */
export const getCrmWorkspaceUrl = (): string | null => {
  const configured = getTrimmedRuntimeEnv('CYSTEMS_CRM_URL');
  if (!configured || configured.length > 2048 || /[\\@?#\u0000-\u0020\u007f]/u.test(configured)) return null;
  try {
    const url = new URL(configured);
    const localDevelopment =
      getRuntimeEnv('NODE_ENV') === 'development' ||
      (getRuntimeEnv('NODE_ENV') === 'test' && getRuntimeEnv('CYSTEMS_CRM_ALLOW_LOOPBACK_HTTP_FOR_TESTS') === 'true');
    const allowedHttp = url.protocol === 'http:' && LOOPBACK_HOSTS.has(url.hostname) && localDevelopment;
    if (
      (url.protocol !== 'https:' && !allowedHttp) ||
      url.username || url.password || url.search || url.hash ||
      !/^\/[A-Za-z0-9/_-]{0,127}$/u.test(url.pathname) || url.pathname.includes('//')
    ) return null;
    return url.href;
  } catch {
    return null;
  }
};
