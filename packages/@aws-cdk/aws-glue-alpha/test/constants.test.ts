import * as glue from '../lib';

describe('WorkerType', () => {
  test('.STANDARD should set the name correctly', () => expect(glue.WorkerType.STANDARD).toEqual('Standard'));

  test('.G_1X should set the name correctly', () => expect(glue.WorkerType.G_1X).toEqual('G.1X'));

  test('.G_2X should set the name correctly', () => expect(glue.WorkerType.G_2X).toEqual('G.2X'));

  test('.G_4X should set the name correctly', () => expect(glue.WorkerType.G_4X).toEqual('G.4X'));

  test('.G_8X should set the name correctly', () => expect(glue.WorkerType.G_8X).toEqual('G.8X'));

  test('.G_025X should set the name correctly', () => expect(glue.WorkerType.G_025X).toEqual('G.025X'));

  test('.Z_2X should set the name correctly', () => expect(glue.WorkerType.Z_2X).toEqual('Z.2X'));

});

describe('JobState', () => {
  test('SUCCEEDED should set Job State correctly', () => expect(glue.JobState.SUCCEEDED).toEqual('SUCCEEDED'));

  test('FAILED should set Job State correctly', () => expect(glue.JobState.FAILED).toEqual('FAILED'));

  test('RUNNING should set Job State correctly', () => expect(glue.JobState.RUNNING).toEqual('RUNNING'));

  test('STARTING should set Job State correctly', () => expect(glue.JobState.STARTING).toEqual('STARTING'));

  test('STOPPED should set Job State correctly', () => expect(glue.JobState.STOPPED).toEqual('STOPPED'));

  test('STOPPING should set Job State correctly', () => expect(glue.JobState.STOPPING).toEqual('STOPPING'));

  test('TIMEOUT should set Job State correctly', () => expect(glue.JobState.TIMEOUT).toEqual('TIMEOUT'));

});

describe('Metric Type', () => {
  test('GAUGE should set Metric Type correctly', () => expect(glue.MetricType.GAUGE).toEqual('gauge'));

  test('COUNT should set Metric Type correctly', () => expect(glue.MetricType.COUNT).toEqual('count'));

});

describe('Execution Class', () => {
  test('FLEX should set Execution Class correctly', () => expect(glue.ExecutionClass.FLEX).toEqual('FLEX'));

  test('STANDARD should set Execution Class correctly', () => expect(glue.ExecutionClass.STANDARD).toEqual('STANDARD'));

});

describe('Glue Version', () => {
  test('V0_9 should set Glue Version correctly', () => expect(glue.GlueVersion.V0_9).toEqual('0.9'));

  test('V1_0 should set Glue Version correctly', () => expect(glue.GlueVersion.V1_0).toEqual('1.0'));

  test('V2_0 should set Glue Version correctly', () => expect(glue.GlueVersion.V2_0).toEqual('2.0'));

  test('V3_0 should set Glue Version correctly', () => expect(glue.GlueVersion.V3_0).toEqual('3.0'));

  test('V4_0 should set Glue Version correctly', () => expect(glue.GlueVersion.V4_0).toEqual('4.0'));

});

describe('Job Language', () => {
  test('PYTHON should set Job Language correctly', () => expect(glue.JobLanguage.PYTHON).toEqual('python'));

  test('SCALA should set Job Language correctly', () => expect(glue.JobLanguage.SCALA).toEqual('scala'));

});

describe('Python Version', () => {
  test('TWO should set Python Version correctly', () => expect(glue.PythonVersion.TWO).toEqual('2'));

  test('THREE should set Python Version correctly', () => expect(glue.PythonVersion.THREE).toEqual('3'));

  test('THREE_NINE should set Python Version correctly', () => expect(glue.PythonVersion.THREE_NINE).toEqual('3.9'));

});

describe('Runtime', () => {
  test('RAY_TWO_FOUR should set Runtime correctly', () => expect(glue.Runtime.RAY_TWO_FOUR).toEqual('Ray2.4'));

});

describe('JobType', () => {
  test('ETL should set Runtime correctly', () => expect(glue.JobType.ETL).toEqual('glueetl'));

  test('PYTHON_SHELL should set Runtime correctly', () => expect(glue.JobType.PYTHON_SHELL).toEqual('pythonshell'));

  test('RAY should set Runtime correctly', () => expect(glue.JobType.RAY).toEqual('glueray'));

  test('STREAMING should set Runtime correctly', () => expect(glue.JobType.STREAMING).toEqual('gluestreaming'));

});

