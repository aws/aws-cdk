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
    process.stderr.rows = undefined as any;
    const output = stderr.inspectSync(() => {
      block.displayLines(lines);
    });

    expect(output.length).toEqual(6);
  });

  test('display accounts for newlines in output', () => {
    const output = stderr.inspectSync(() => {
      block.displayLines(['before\nafter']);
    });
    expect(output.length).toEqual(3); // cursorup + 2 lines
  });

  test('removeEmptyLines only removes trailing lines', () => {
    stderr.inspectSync(() => {
      block.displayLines(Array.from(Array(5).keys()).map(x => `${x}`));
    });
    stderr.inspectSync(() => {
      // Leaves 3 empty lines
      block.displayLines(Array.from(Array(2).keys()).map(x => `${x}`));
    });

    const output = stderr.inspectSync(() => {
      block.removeEmptyLines();
    });
    const expectedEmptyLines = 3;
    expect(JSON.stringify(output)).toEqual(JSON.stringify([`\u001b[${expectedEmptyLines}A`]));
  });
});
