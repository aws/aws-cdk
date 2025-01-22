import { STSClient, GetCallerIdentityCommand } from '@aws-sdk/client-sts';
import { MiddlewareStack, SMITHY_CONTEXT_KEY } from '@smithy/types';

export const iamLoggingMiddleware = (arnOperationMap: Map<string, string>, region: string) => {
  return {
    applyToStack: (stack: MiddlewareStack<any, any>) => {
      stack.add(
        (next, context) => async (args: any): Promise<any> => {
          // Get identity information using STS
          const stsClient = new STSClient({ region });
          const identity = await stsClient.send(new GetCallerIdentityCommand({}));

          arnOperationMap.set(`${context[SMITHY_CONTEXT_KEY]?.service}:${context[SMITHY_CONTEXT_KEY]?.operation}`, identity.Arn as string);

          return next(args);
        },
        {
          name: 'IAMLoggingMiddleware',
          step: 'build',
          override: true,
        },
      );
    },
  };
};
