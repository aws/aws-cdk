import { format as formatUrl } from 'url';
const ALLOWED_METHODS = [ 'ANY', 'DELETE', 'GET', 'HEAD', 'OPTIONS', 'PATCH', 'POST', 'PUT' ];

export function validateHttpMethod(method: string, messagePrefix: string = '') {
  if (!ALLOWED_METHODS.includes(method.toUpperCase())) {
    throw new Error(`${messagePrefix}Invalid HTTP method "${method}". Allowed methods: ${ALLOWED_METHODS.join(',')}`);
  }
}

export function parseMethodOptionsPath(originalPath: string): { resourcePath: string, httpMethod: string } {
  if (!originalPath.startsWith('/')) {
    throw new Error(`Method options path must start with '/': ${originalPath}`);
  }

  const path = originalPath.substr(1); // trim trailing '/'

  const components = path.split('/');

  if (components.length < 2) {
    throw new Error(`Method options path must include at least two components: /{resource}/{method} (i.e. /foo/bar/GET): ${path}`);
  }

  const httpMethod = components.pop()!.toUpperCase(); // last component is an HTTP method
  if (httpMethod !== '*') {
    validateHttpMethod(httpMethod, `${originalPath}: `);
  }

  let resourcePath = '/~1' + components.join('~1');
  if (components.length === 1 && components[0] === '*') {
    resourcePath = '/*';
  } else if (components.length === 1 && components[0] === '') {
    resourcePath = '/';
  }

  return {
    httpMethod,
    resourcePath
  };
}

export function parseAwsApiCall(path?: string, action?: string, actionParams?: { [key: string]: string }): { apiType: string, apiValue: string } {
  if (actionParams && !action) {
    throw new Error(`"actionParams" requires that "action" will be set`);
  }

  if (path && action) {
    throw new Error(`"path" and "action" are mutually exclusive (path="${path}", action="${action}")`);
  }

  if (path) {
    return {
      apiType: 'path',
      apiValue: path
    };
  }

  if (action) {
    if (actionParams) {
      action += '&' + formatUrl({ query: actionParams }).substr(1);
    }

    return {
      apiType: 'action',
      apiValue: action
    };
  }

  throw new Error(`Either "path" or "action" are required`);
}
