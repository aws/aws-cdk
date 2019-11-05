import dynamodb = require('@aws-cdk/aws-dynamodb');

const DefaultTableProps: dynamodb.TableProps | any = {
  partitionKey: {
    name: 'id',
    type: dynamodb.AttributeType.STRING
  }
};

export { DefaultTableProps };