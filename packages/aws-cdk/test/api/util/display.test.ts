import { RewritableBlock } from '../../../lib/api/util/display';
import { stderr } from '../console-listener';


describe('Rewritable Block Tests', () => {
  let block: RewritableBlock;
  beforeEach(() => {
    block = new RewritableBlock(process.stderr);
    process.stderr.rows = 80;
  });

  test('displayLines writes maximum lines based on rows if there are more lines than rows', () => {
    const lines = Array.from(Array(100).keys()).map(line => line.toString());
    const output = stderr.inspectSync(() => {
      block.displayLines(lines);
    });

    expect(output.length).toEqual(block.height!);
  });

  test('displayLines writes maximum lines based on lines length if there are less lines than rows', () => {
    const lines = Array.from(Array(45).keys()).map(line => line.toString());
    const output = stderr.inspectSync(() => {
      block.displayLines(lines);
    });

    expect(output.length).toEqual(46);
  });

  test('displayLines writes maximum lines based on lines length if rows is undefined', () => {
    const lines = Array.from(Array(5).keys()).map(line => line.toString());
    process.stderr.rows = undefined;
    const output = stderr.inspectSync(() => {
      block.displayLines(lines);
    });

    expect(output.length).toEqual(6);
  });
});