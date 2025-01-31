import { replacerBufferWithInfo } from '../../lib/serialize';

test('converts buffer to information', () => {
  const res = JSON.stringify({ data: Buffer.from('test data') }, replacerBufferWithInfo);

  expect(res).toEqual('{"data":"<Buffer: 9 Bytes>"}');
});
