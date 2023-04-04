export const ES_READ_ACTIONS = [
  'es:ESHttpGet',
  'es:ESHttpHead',
];

export const ES_WRITE_ACTIONS = [
  'es:ESHttpDelete',
  'es:ESHttpPost',
  'es:ESHttpPut',
  'es:ESHttpPatch',
];

export const ES_READ_WRITE_ACTIONS = [
  ...ES_READ_ACTIONS,
  ...ES_WRITE_ACTIONS,
];
