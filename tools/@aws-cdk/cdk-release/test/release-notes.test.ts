import * as files from '../lib/private/files';
import { createReleaseNotes } from '../lib/release-notes';
import * as versions from '../lib/versions';

/** MOCKS */
const mockWriteFile = jest.spyOn(files, 'writeFile').mockImplementation(() => jest.fn());
const mockReadVersion = jest.spyOn(versions, 'readVersion');
jest.mock('changelog-parser', () => { return jest.fn(); });
// eslint-disable-next-line @typescript-eslint/no-require-imports
const changelogParser = require('changelog-parser');
/** MOCKS */

beforeEach(() => { jest.resetAllMocks(); });

const DEFAULT_OPTS = {
  changelogFile: 'CHANGELOG.md',
  releaseNotesFile: 'RELEASE_NOTES.md',
  versionFile: 'versions.json',
};

test('without alpha releases, only the stable changelog is returned', async () => {
  mockReadVersion.mockImplementation((_) => { return { stableVersion: '1.2.3' }; });
  mockChangelogOnceForVersion('1.2.3', 'foo');

  await createReleaseNotes(DEFAULT_OPTS);

  expectReleaseNotes('foo');
});

test('with alpha releases the contents of both are returned as separate sections', async () => {
  mockReadVersion.mockImplementation((_) => { return { stableVersion: '1.2.3', alphaVersion: '1.2.3-alpha' }; });
  mockChangelogOnceForVersion('1.2.3', 'foo'); // stable
  mockChangelogOnceForVersion('1.2.3-alpha', 'bar'); // alpha

  await createReleaseNotes({ ...DEFAULT_OPTS, alphaChangelogFile: 'CHANGELOG.alpha.md' });

  expectReleaseNotes([
    'foo',
    '---',
    '## Alpha modules (1.2.3-alpha)',
    'bar',
  ]);
});

test('throws if no matching version is found in the changelog', async () => {
  mockReadVersion.mockImplementation((_) => { return { stableVersion: '1.2.3' }; });
  mockChangelogOnceForVersion('4.5.6', 'foo');

  await expect(createReleaseNotes(DEFAULT_OPTS))
    .rejects
    .toThrow(/No changelog entry found for version 1.2.3 in CHANGELOG.md/);
});

function mockChangelogOnceForVersion(version: string, body: string) {
  changelogParser.mockImplementationOnce((_: string) => { return { versions: [{ version, body }] }; });
}

function expectReleaseNotes(contents: string | string[]) {
  const data = (typeof contents === 'string') ? contents : contents.join('\n');
  expect(mockWriteFile).toBeCalledWith(expect.any(Object), 'RELEASE_NOTES.md', data);
}
