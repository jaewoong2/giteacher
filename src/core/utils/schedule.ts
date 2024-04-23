export const useEventBridgeSchedulerSchedule = <T>(token: string, body: T) => {
  const headers = {
    Authorization: `${token}`,
  };

  const requestBody = {
    ...body,
  };

  const template = JSON.parse(
    JSON.stringify(AWS_EVENT_BRIDGE_SCHEDULER_TEMPLATE),
  );

  template.headers.Authorization = headers.Authorization;
  template.body = JSON.stringify(requestBody);

  return {
    getScheduleTemplate: () => template,
  };
};

const HOST = 'api.prlc.kr';
const PATH = '/api/commits';

export const AWS_EVENT_BRIDGE_SCHEDULER_TEMPLATE = {
  resource: '/{proxy+}',
  path: PATH,
  httpMethod: 'POST',
  headers: {
    Accept: '*/*',
    'Accept-Encoding': 'gzip, deflate, br',
    'Cache-Control': 'no-cache',
    'Content-Type': 'application/json',
    Host: HOST,
  },
  multiValueHeaders: {
    Accept: ['*/*'],
    'Accept-Encoding': ['gzip, deflate, br'],
    Authorization: [],
    'Cache-Control': ['no-cache'],
    'Content-Type': ['application/json'],
    Host: [HOST],
    'X-Forwarded-For': [],
    'X-Forwarded-Port': ['443'],
    'X-Forwarded-Proto': ['https'],
  },
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  pathParameters: {
    proxy: 'api/sentence',
  },
  stageVariables: null,
  requestContext: {
    resourcePath: '/{proxy+}',
    httpMethod: 'POST',
    path: PATH,
    protocol: 'HTTP/1.1',
    stage: 'dev',
    domainPrefix: 'api',
    identity: {},
    domainName: HOST,
  },
  isBase64Encoded: false,
};
