import type { Method } from 'jsii-reflect';
import { Linter } from '../linter';

const EXCLUDE_ANNOTATION_NO_GRANTS = '[disable-awslint:no-grants]';

export const grantsMethodsLinter = new Linter(assembly => assembly.allClasses);

grantsMethodsLinter.add({
  code: 'no-grants',
  message: 'L2 constructs are not allowed to have new "grantXxx()" methods. Create or re-use a companion <Contruct>Grants class instead.',
  eval: e => {
    Object.values(e.ctx.getMethods())
      .filter(m => !m.static)
      .filter(m => !m.abstract)
      .filter(m => m.name.startsWith('grant') && m.name !== 'grantOnKey')
      .filter(m => m.parameters.length > 0 && m.parameters[0].type.fqn === 'aws-cdk-lib.aws_iam.IGrantable')
      .forEach((grant) => {
        e.assert(isExempted(grant), `${e.ctx.fqn}.${grant.name}`);
      });
  },
});

function isExempted(method: Method): boolean {
  const docs = method.docs;
  return [docs.summary, docs.remarks].some(doc => doc.includes(EXCLUDE_ANNOTATION_NO_GRANTS));
}
