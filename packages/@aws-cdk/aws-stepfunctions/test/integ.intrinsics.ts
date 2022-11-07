import * as cdk from '@aws-cdk/core';
import { IntegTest, ExpectedResult } from '@aws-cdk/integ-tests';
import { JsonPath, Pass, StateMachine } from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'aws-stepfunctions-intrinsics-integ');

const pass = new Pass(stack, 'pass', {
  parameters: {
    array1: JsonPath.array('asdf', JsonPath.stringAt('$.Id')),
    arrayPartition1: JsonPath.arrayPartition(JsonPath.listAt('$.inputArray'), 4),
    arrayPartition2: JsonPath.arrayPartition(JsonPath.listAt('$.inputArray'), JsonPath.numberAt('$.chunkSize')),
    arrayContains1: JsonPath.arrayContains(JsonPath.listAt('$.inputArray'), 5),
    arrayContains2: JsonPath.arrayContains(JsonPath.listAt('$.inputArray'), 'a'),
    arrayContains3: JsonPath.arrayContains(JsonPath.listAt('$.inputArray'), JsonPath.numberAt('$.lookingFor')),
    arrayRange1: JsonPath.arrayRange(1, 9, 2),
    arrayRange2: JsonPath.arrayRange(JsonPath.numberAt('$.start'), JsonPath.numberAt('$.end'), JsonPath.numberAt('$.step')),
    arrayGetItem1: JsonPath.arrayGetItem(JsonPath.listAt('$.inputArray'), 5),
    arrayGetItem2: JsonPath.arrayGetItem(JsonPath.numberAt('$.inputArray'), JsonPath.numberAt('$.index')),
    arrayLength1: JsonPath.arrayLength(JsonPath.listAt('$.inputArray')),
    arrayUnique1: JsonPath.arrayUnique(JsonPath.listAt('$.inputArray')),
    base64Encode1: JsonPath.base64Encode('Data to encode'),
    base64Encode2: JsonPath.base64Encode(JsonPath.stringAt('$.input')),
    base64Decode1: JsonPath.base64Decode('RGF0YSB0byBlbmNvZGU='),
    base64Decode2: JsonPath.base64Decode(JsonPath.stringAt('$.base64')),
    hash1: JsonPath.hash('Input data', 'SHA-1'),
    hash2: JsonPath.hash(JsonPath.objectAt('$.Data'), JsonPath.stringAt('$.Algorithm')),
    jsonMerge1: JsonPath.jsonMerge(JsonPath.objectAt('$.Obj1'), JsonPath.objectAt('$.Obj2')),
    mathRandom1: JsonPath.mathRandom(1, 999),
    mathRandom2: JsonPath.mathRandom(JsonPath.numberAt('$.start'), JsonPath.numberAt('$.end')),
    mathAdd1: JsonPath.mathAdd(1, 999),
    mathAdd2: JsonPath.mathAdd(JsonPath.numberAt('$.value1'), JsonPath.numberAt('$.step')),
    stringSplit1: JsonPath.stringSplit('1,2,3,4,5', ','),
    stringSplit2: JsonPath.stringSplit(JsonPath.stringAt('$.inputString'), JsonPath.stringAt('$.splitter')),
    uuid: JsonPath.uuid(),
    format1: JsonPath.format('Hi my name is {}.', JsonPath.stringAt('$.Name')),
    format2: JsonPath.format(JsonPath.stringAt('$.Format'), JsonPath.stringAt('$.Name')),
    stringToJson1: JsonPath.stringToJson(JsonPath.stringAt('$.Str')),
    jsonToString1: JsonPath.jsonToString(JsonPath.objectAt('$.Obj')),
  },
});

const stateMachine = new StateMachine(stack, 'StateMachine', {
  definition: pass,
});

const integ = new IntegTest(app, 'StateMachineIntrinsicsTest', {
  testCases: [stack],
});
integ.assertions.awsApiCall('StepFunctions', 'describeStateMachine', {
  stateMachineArn: stateMachine.stateMachineArn,
}).expect(ExpectedResult.objectLike({
  status: 'ACTIVE',
}));

app.synth();
