import { MetadataEntry } from 'constructs';
import { MetadataType } from '../../lib/metadata-resource';
import {
  filterMetadataType,
} from '../../lib/private/runtime-info';

test('test filterMetadataType correct filter', () => {
  const metadata: MetadataEntry[] = [
    { type: MetadataType.CONSTRUCT, data: { hello: 'world' } },
    {
      type: MetadataType.METHOD,
      data: {
        bool: true,
        nested: { foo: 'bar' },
        arr: [1, 2, 3],
        str: 'foo',
        arrOfObjects: [{ foo: { hello: 'world' } }],
      },
    },
    {
      type: 'hello',
      data: { bool: true, nested: { foo: 'bar' }, arr: [1, 2, 3], str: 'foo' },
    },
    {
      type: MetadataType.FEATURE_FLAG,
      data: 'foobar',
    },
  ];

  expect(filterMetadataType(metadata)).toEqual([
    { hello: 'world' },
    {
      bool: true,
      nested: { foo: 'bar' },
      arr: [1, 2, 3],
      str: 'foo',
      arrOfObjects: [{ foo: { hello: 'world' } }],
    },
    'foobar',
  ]);
});
