/* eslint-disable import/no-extraneous-dependencies */
import { generate, L2, Enum, STRING, DURATION, objLit, renderDuration, ifDefined, enumMapping } from '@aws-cdk/l2gen';

const scope = new Enum('Scope');
const cloudFrontScope = scope.addMember({ name: 'CLOUDFRONT', summary: '' });
const regionalScope = scope.addMember({ name: 'REGIONAL', summary: '' });

const webAcl = L2.define('WebACL', res => {
  const scopeProp = res.addProperty({
    name: 'scope',
    type: scope,
    required: true,
    summary: 'Specifies whether this is for an Amazon CloudFront distribution or for a regional application.',
    details: `
      A regional application can be an Application Load Balancer (ALB), an
      Amazon API Gateway REST API, an AWS AppSync GraphQL API, or an Amazon
      Cognito user pool.`,
  });

  const scopeMapping = enumMapping([
    [cloudFrontScope, 'CLOUDFRONT'],
    [regionalScope, 'REGIONAL'],
  ]);

  res.wire({ scope: scopeMapping(scopeProp) });

  res.addProperty({
    name: 'description',
    type: STRING,
    required: false,
    summary: 'A description of the web ACL that helps with identification.',
    defaultDescription: 'No description',

    wire: 'description',
  });

  res.addProperty({
    name: 'aclName',
    type: STRING,
    required: false,
    summary: 'The name of the web ACL. You cannot change the name of a web ACL after you create it.',
    defaultDescription: 'A name is automatically generated',

    wire: 'name',
  });

  const immunityTime = res.addProperty({
    name: 'captchaImmunityTime',
    type: DURATION,
    required: false,
    summary: 'Determines how long a CAPTCHA timestamp in the token remains valid after the client successfully solves a CAPTCHA puzzle.',
    defaultDescription: '5 minutes',
  });

  res.wire({
    captchaConfig: ifDefined(immunityTime, objLit({
      immunityTimeProperty: objLit({
        immunityTime: renderDuration(immunityTime, 'toSeconds'),
      }),
    })),
  });
});

generate(
  scope,
  webAcl,
);