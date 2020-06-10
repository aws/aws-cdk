import * as tasks from '../../lib';

describe('DynamoProjectionExpression', () => {
  test('should correctly configure projectionExpression', () => {
    expect(
      new tasks.DynamoProjectionExpression()
        .withAttribute('Messages')
        .atIndex(1)
        .atIndex(10)
        .withAttribute('Tags')
        .withAttribute('Items')
        .atIndex(0)
        .toString(),
    ).toEqual('Messages[1][10].Tags.Items[0]');
  });

  test('should throw if expression starts with atIndex', () => {
    expect(() => new tasks.DynamoProjectionExpression().atIndex(1).withAttribute('Messages').toString()).toThrow(
      /Expression must start with an attribute/,
    );
  });
});
