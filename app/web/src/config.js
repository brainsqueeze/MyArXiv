export const ENVIRONMENT = {
  name: 'LOCAL',
  version: '0'
};

let config = {
  API_BASE_URL: `${window.location.protocol}//${window.location.hostname}:9091/api`
};

export const CONFIG = config;