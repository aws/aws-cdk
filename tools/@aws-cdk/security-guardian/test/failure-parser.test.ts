import { parseFailureMessage, formatFailures, createIndividualFailureXml } from '../src/failure-parser';

describe('Failure Parser', () => {
  test('should parse single failure message', () => {
    const content = 'Check was not compliant as property [Policies[*].PolicyDocument.Statement[*]] is missing. Value traversed to [Path=/Resources/TestRole/Properties[L:324,C:20] Value={&quot;AssumeRolePolicyDocument&quot;:{&quot;Version&quot;:&quot;2012-10-17&quot;}}]';
    const ruleAttr = 'IAM_NO_WILDCARD_ACTIONS_INLINE for Type: ResolvedCheck';

    const failures = parseFailureMessage(content, ruleAttr);
    
    expect(failures).toHaveLength(1);
    expect(failures[0]).toEqual({
      rule: 'IAM_NO_WILDCARD_ACTIONS_INLINE',
      type: 'ResolvedCheck',
      resource: 'TestRole',
      line: 324,
      column: 20,
      property: 'Policies[*].PolicyDocument.Statement[*]',
      message: 'is missing.'
    });
  });

  test('should parse failure message with rule from attribute', () => {
    const content = 'Check was not compliant as property [Policies[*].PolicyDocument.Statement[*]] is missing. Value traversed to [Path=/Resources/TestRole/Properties[L:324,C:20] Value={&quot;AssumeRolePolicyDocument&quot;:{&quot;Version&quot;:&quot;2012-10-17&quot;}}]';
    const ruleAttr = 'IAM_NO_WILDCARD_ACTIONS_INLINE for Type: ResolvedCheck';

    const failures = parseFailureMessage(content, ruleAttr);
    
    expect(failures).toHaveLength(1);
    expect(failures[0]).toEqual({
      rule: 'IAM_NO_WILDCARD_ACTIONS_INLINE',
      type: 'ResolvedCheck',
      resource: 'TestRole',
      line: 324,
      column: 20,
      property: 'Policies[*].PolicyDocument.Statement[*]',
      message: 'is missing.'
    });
  });

  test('should parse multiple failure messages', () => {
    const content = 'Check was not compliant as property [Policies[*].PolicyDocument.Statement[*]] is missing. Value traversed to [Path=/Resources/EcsClusterDefaultAutoScalingGroupInstanceRole3C026863/Properties[L:324,C:20] Value={&quot;AssumeRolePolicyDocument&quot;:{&quot;Version&quot;:&quot;2012-10-17&quot;,&quot;Statement&quot;:[{&quot;Action&quot;:&quot;sts:AssumeRole&quot;,&quot;Effect&quot;:&quot;Allow&quot;,&quot;Principal&quot;:{&quot;Service&quot;:&quot;ec2.amazonaws.com&quot;}}]},&quot;Tags&quot;:[{&quot;Key&quot;:&quot;Name&quot;,&quot;Value&quot;:&quot;ecs-placement-strategies-empty/EcsCluster/DefaultAutoScalingGroup&quot;}]}]Check was not compliant as property [Policies[*].PolicyDocument.Statement[*]] is missing. Value traversed to [Path=/Resources/EcsClusterDefaultAutoScalingGroupDrainECSHookFunctionServiceRole94543EDA/Properties[L:485,C:20] Value={&quot;AssumeRolePolicyDocument&quot;:{&quot;Version&quot;:&quot;2012-10-17&quot;,&quot;Statement&quot;:[{&quot;Action&quot;:&quot;sts:AssumeRole&quot;,&quot;Effect&quot;:&quot;Allow&quot;,&quot;Principal&quot;:{&quot;Service&quot;:&quot;lambda.amazonaws.com&quot;}}]},&quot;ManagedPolicyArns&quot;:[&quot;arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole&quot;],&quot;Tags&quot;:[{&quot;Key&quot;:&quot;Name&quot;,&quot;Value&quot;:&quot;ecs-placement-strategies-empty/EcsCluster/DefaultAutoScalingGroup&quot;}]}]Check was not compliant as property [Policies[*].PolicyDocument.Statement[*]] is missing. Value traversed to [Path=/Resources/EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookRoleA38EC83B/Properties[L:619,C:20] Value={&quot;AssumeRolePolicyDocument&quot;:{&quot;Version&quot;:&quot;2012-10-17&quot;,&quot;Statement&quot;:[{&quot;Action&quot;:&quot;sts:AssumeRole&quot;,&quot;Effect&quot;:&quot;Allow&quot;,&quot;Principal&quot;:{&quot;Service&quot;:&quot;autoscaling.amazonaws.com&quot;}}]},&quot;Tags&quot;:[{&quot;Key&quot;:&quot;Name&quot;,&quot;Value&quot;:&quot;ecs-placement-strategies-empty/EcsCluster/DefaultAutoScalingGroup&quot;}]}]Check was not compliant as property [Policies[*].PolicyDocument.Statement[*]] is missing. Value traversed to [Path=/Resources/TaskDefTaskRole1EDB4A67/Properties[L:676,C:20] Value={&quot;AssumeRolePolicyDocument&quot;:{&quot;Version&quot;:&quot;2012-10-17&quot;,&quot;Statement&quot;:[{&quot;Action&quot;:&quot;sts:AssumeRole&quot;,&quot;Effect&quot;:&quot;Allow&quot;,&quot;Principal&quot;:{&quot;Service&quot;:&quot;ecs-tasks.amazonaws.com&quot;}}]}}]';
    const ruleAttr = 'IAM_NO_WILDCARD_ACTIONS_INLINE for Type: Resolved';

    const failures = parseFailureMessage(content, ruleAttr);
    
    expect(failures).toHaveLength(4);
    expect(failures[0].resource).toBe('EcsClusterDefaultAutoScalingGroupInstanceRole3C026863');
    expect(failures[0].line).toBe(324);
    expect(failures[1].resource).toBe('EcsClusterDefaultAutoScalingGroupDrainECSHookFunctionServiceRole94543EDA');
    expect(failures[1].line).toBe(485);
    expect(failures[2].resource).toBe('EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookRoleA38EC83B');
    expect(failures[2].line).toBe(619);
    expect(failures[3].resource).toBe('TaskDefTaskRole1EDB4A67');
    expect(failures[3].line).toBe(676);
  });

  test('should format failures for display', () => {
    const failures = [
      {
        rule: 'IAM_NO_WILDCARD_ACTIONS_INLINE',
        type: 'Resolved',
        resource: 'TestRole',
        line: 324,
        column: 20,
        property: 'Policies[*].PolicyDocument.Statement[*]',
        message: 'is missing.'
      }
    ];

    const formatted = formatFailures(failures);
    
    expect(formatted).toContain('Rule: IAM_NO_WILDCARD_ACTIONS_INLINE');
    expect(formatted).toContain('Resource: TestRole');
    expect(formatted).toContain('Line 324, Column 20');
    expect(formatted).toContain('Property: Policies[*].PolicyDocument.Statement[*]');
  });

  test('should handle malformed messages gracefully', () => {
    const message = 'Invalid message format';
    const failures = parseFailureMessage(message);
    expect(failures).toHaveLength(0);
  });

  test('should create individual failure XML tags', () => {
    const failures = [
      {
        rule: 'IAM_NO_WILDCARD_ACTIONS_INLINE',
        type: 'Resolved',
        resource: 'TestRole1',
        line: 324,
        column: 20,
        property: 'Policies[*].PolicyDocument.Statement[*]',
        message: 'is missing.'
      },
      {
        rule: 'IAM_NO_WILDCARD_ACTIONS_INLINE',
        type: 'Resolved',
        resource: 'TestRole2',
        line: 485,
        column: 20,
        property: 'Policies[*].PolicyDocument.Statement[*]',
        message: 'is missing.'
      }
    ];

    const xml = createIndividualFailureXml(failures, 'test-file.template.json');
    
    expect(xml).toContain('<failure message="IAM_NO_WILDCARD_ACTIONS_INLINE: is missing. (Property: Policies[*].PolicyDocument.Statement[*])" type="Resolved" file="test-file.template.json" line="324" column="20"></failure>');
    expect(xml).toContain('<failure message="IAM_NO_WILDCARD_ACTIONS_INLINE: is missing. (Property: Policies[*].PolicyDocument.Statement[*])" type="Resolved" file="test-file.template.json" line="485" column="20"></failure>');
  });

  test('should parse the user provided XML data correctly', () => {
    const xmlContent = 'Check was not compliant as property [Policies[*].PolicyDocument.Statement[*]] is missing. Value traversed to [Path=/Resources/EcsClusterDefaultAutoScalingGroupInstanceRole3C026863/Properties[L:324,C:20] Value={&quot;AssumeRolePolicyDocument&quot;:{&quot;Version&quot;:&quot;2012-10-17&quot;,&quot;Statement&quot;:[{&quot;Action&quot;:&quot;sts:AssumeRole&quot;,&quot;Effect&quot;:&quot;Allow&quot;,&quot;Principal&quot;:{&quot;Service&quot;:&quot;ec2.amazonaws.com&quot;}}]},&quot;Tags&quot;:[{&quot;Key&quot;:&quot;Name&quot;,&quot;Value&quot;:&quot;ecs-placement-strategies-empty/EcsCluster/DefaultAutoScalingGroup&quot;}]}]Check was not compliant as property [Policies[*].PolicyDocument.Statement[*]] is missing. Value traversed to [Path=/Resources/EcsClusterDefaultAutoScalingGroupDrainECSHookFunctionServiceRole94543EDA/Properties[L:485,C:20] Value={&quot;AssumeRolePolicyDocument&quot;:{&quot;Version&quot;:&quot;2012-10-17&quot;,&quot;Statement&quot;:[{&quot;Action&quot;:&quot;sts:AssumeRole&quot;,&quot;Effect&quot;:&quot;Allow&quot;,&quot;Principal&quot;:{&quot;Service&quot;:&quot;lambda.amazonaws.com&quot;}}]},&quot;ManagedPolicyArns&quot;:[&quot;arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole&quot;],&quot;Tags&quot;:[{&quot;Key&quot;:&quot;Name&quot;,&quot;Value&quot;:&quot;ecs-placement-strategies-empty/EcsCluster/DefaultAutoScalingGroup&quot;}]}]Check was not compliant as property [Policies[*].PolicyDocument.Statement[*]] is missing. Value traversed to [Path=/Resources/EcsClusterDefaultAutoScalingGroupLifecycleHookDrainHookRoleA38EC83B/Properties[L:619,C:20] Value={&quot;AssumeRolePolicyDocument&quot;:{&quot;Version&quot;:&quot;2012-10-17&quot;,&quot;Statement&quot;:[{&quot;Action&quot;:&quot;sts:AssumeRole&quot;,&quot;Effect&quot;:&quot;Allow&quot;,&quot;Principal&quot;:{&quot;Service&quot;:&quot;autoscaling.amazonaws.com&quot;}}]},&quot;Tags&quot;:[{&quot;Key&quot;:&quot;Name&quot;,&quot;Value&quot;:&quot;ecs-placement-strategies-empty/EcsCluster/DefaultAutoScalingGroup&quot;}]}]Check was not compliant as property [Policies[*].PolicyDocument.Statement[*]] is missing. Value traversed to [Path=/Resources/TaskDefTaskRole1EDB4A67/Properties[L:676,C:20] Value={&quot;AssumeRolePolicyDocument&quot;:{&quot;Version&quot;:&quot;2012-10-17&quot;,&quot;Statement&quot;:[{&quot;Action&quot;:&quot;sts:AssumeRole&quot;,&quot;Effect&quot;:&quot;Allow&quot;,&quot;Principal&quot;:{&quot;Service&quot;:&quot;ecs-tasks.amazonaws.com&quot;}}]}}]';
    const messageAttr = 'IAM_NO_WILDCARD_ACTIONS_INLINE for Type: Resolved';
    
    const failures = parseFailureMessage(xmlContent, messageAttr);
    
    expect(failures).toHaveLength(4);
    
    // Check first failure
    expect(failures[0].rule).toBe('IAM_NO_WILDCARD_ACTIONS_INLINE');
    expect(failures[0].type).toBe('Resolved');
    expect(failures[0].resource).toBe('EcsClusterDefaultAutoScalingGroupInstanceRole3C026863');
    expect(failures[0].line).toBe(324);
    expect(failures[0].column).toBe(20);
    expect(failures[0].property).toBe('Policies[*].PolicyDocument.Statement[*]');
    expect(failures[0].message).toBe('is missing.');
    
    // Check that XML generation works
    const xml = createIndividualFailureXml(failures, 'test.template.json');
    expect(xml).toContain('line="324"');
    expect(xml).toContain('line="485"');
    expect(xml).toContain('line="619"');
    expect(xml).toContain('line="676"');
  });
});