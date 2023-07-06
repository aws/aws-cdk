const { SSM } = require('@aws-sdk/client-ssm');

exports.handler = async function (event) {
  const props = event.ResourceProperties;

  console.info(`Reading function ARN from SSM parameter ${props.ParameterName} in region ${props.Region}`);

  if (event.RequestType === 'Create' || event.RequestType === 'Update') {
    const ssm = new SSM({ region: props.Region });
    const ssmParameter = await ssm.getParameter({ Name: props.ParameterName });
    console.info('Response: %j', ssmParameter);
    const functionArn = ssmParameter.Parameter.Value;
    return {
      Data: {
        FunctionArn: functionArn,
      },
    };
  }
};
