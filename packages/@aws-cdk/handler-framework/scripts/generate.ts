import { config } from '../lib/config';
import { CdkHandlerFramework, ComponentDefinition } from '../lib/framework';

const generate: { [outputFileLocation: string]: ComponentDefinition[] } = {};

function main() {
  recurse(config, []);
  for (const [outputFileLocation, components] of Object.entries(generate)) {
    CdkHandlerFramework.generate(outputFileLocation, components);
  }

  function recurse(_config: any, path: string[]) {
    if (_config instanceof Array) {
      const outputFileLocation = path.join('/');
      generate[outputFileLocation] = _config;
      return;
    }
    for (const key in _config) {
      if (_config.hasOwnProperty(key) && typeof _config[key] === 'object') {
        path.push(key);
        recurse(_config[key], path);
        path.pop(); // backtrack
      }
    }
  }
}

main();
