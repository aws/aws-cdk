import {
  DatePartitionProjection,
  EnumPartitionProjection,
  IntegerPartitionProjection,
} from '../lib';

// console.log(proj.toOutputFormat());
describe('partition projection output', () => {
  test('Date partition projection', () => {
    const proj = new DatePartitionProjection(
      'date',
      's3://DOC-EXAMPLE-BUCKET/prefix/${date}/',
      'NOW-3YEARS,NOW',
      'yyyy-MM-dd');
    expect(proj.toOutputFormat()).toEqual({
      'projection.enabled': true,
      'projection.date.type': 'date',
      'projection.date.format': 'yyyy-MM-dd',
      'projection.date.range': 'NOW-3YEARS,NOW',
      'storage.location.template': 's3://DOC-EXAMPLE-BUCKET/prefix/${date}/',
    });
  });

  test('Integer partition projection', () => {
    const proj = new IntegerPartitionProjection(
      'hour',
      's3://DOC-EXAMPLE-BUCKET/prefix/${hour}/',
      '0,23',
      2);
    expect(proj.toOutputFormat()).toEqual({
      'projection.enabled': true,
      'projection.hour.type': 'integer',
      'projection.hour.range': '0,23',
      'projection.hour.interval': '2',
      'storage.location.template': 's3://DOC-EXAMPLE-BUCKET/prefix/${hour}/',
    });
  });

  test('Enum partition projection', () => {
    const proj = new EnumPartitionProjection(
      'unit',
      's3://DOC-EXAMPLE-BUCKET/prefix/${unit}/',
      'A,B,C');
    expect(proj.toOutputFormat()).toEqual({
      'projection.enabled': true,
      'projection.unit.type': 'enum',
      'projection.unit.values': 'A,B,C',
      'storage.location.template': 's3://DOC-EXAMPLE-BUCKET/prefix/${unit}/',
    });
  });

});