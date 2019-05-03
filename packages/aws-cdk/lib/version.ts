export const DISPLAY_VERSION = `${versionNumber()} (build ${commit()})`;

function versionNumber(): string {
  return require('../package.json').version.replace(/\+[0-9a-f]+$/, '');
}

function commit(): string {
  return require('../build-info.json').commit;
}