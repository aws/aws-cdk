import fs = require('fs-extra');
import path = require('path');
import { createReport, createTypeSystem, writeHtml } from '../lib';

test('black box', async () => {
  const ts = await createTypeSystem(path.join(__dirname, 'sample'));
  const report = createReport(ts);

  let actual = '';
  const append = { write: (data: any) => actual += data.toString('utf-8') };
  writeHtml(ts, report, append as any);

  const expectedPath = path.join(__dirname, 'expected.html');
  if (process.env.UPDATE_DIFF) {
    await fs.writeFile(expectedPath, actual);
  }

  const expected = (await fs.readFile(expectedPath)).toString();

  // to update expectation run with UPDATE_DIFF=1
  expect(actual).toEqual(expected);
});