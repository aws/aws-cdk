describe('global table properties', () => {
  test('with default properties', () => {

  });

  test('with sort key', () => {

  });

  test('with table name', () => {

  });

  test('with TTL attribute', () => {

  });

  test('with removal policy as DESTROY', () => {

  });

  test('with contributor insights enabled', () => {

  });

  test('with deletion protection enabled', () => {

  });

  test('with point in time recovery enabled', () => {

  });

  test('with table class as standard IA', () => {

  });

  test('with provisioned billing mode', () => {

  });

  test('with replicas', () => {

  });

  test('throws if stack region specified in replicas', () => {

  });

  test('throws for duplicate replica regions', () => {

  });

  test('with global secondary indexes', () => {

  });

  test('throws if capacity is set on global secondary index and billing mode is on demand', () => {

  });

  test('throws for >20 global secondary indexes', () => {

  });

  test('with local secondary indexes', () => {

  });

  test('throws for >5 local secondary indexes', () => {

  });

  test('with table encryption with dynamodb owned key', () => {

  });

  test('with table encryption with AWS managed key', () => {

  });

  test('with table encryption with customer managed key', () => {

  });
});

describe('replica table properties', () => {
  test('with kinesis stream', () => {

  });

  test('with contributor insights different than global table', () => {

  });

  test('with deletion protection different than global table', () => {

  });

  test('with point in time recovery different than global table', () => {

  });

  test('with table class different than global table', () => {

  });

  test('with read capacity different than global table', () => {

  });

  test('throws when read capacity is configured and global table billing is on-demand', () => {

  });

  test('with additional global secondary indexes', () => {

  });

  test('can override global secondary index properties from global table', () => {

  });

  test('throws for >20 global secondary indexes', () => {

  });

  test('throws for read capacity set on global secondary index with on-demand billing mode', () => {

  });
});

describe('global table functionality', () => {

});

describe('billing mode and capacity', () => {

});
