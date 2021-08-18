import { IEventBus } from '@aws-cdk/aws-events';
import { IQueue } from '@aws-cdk/aws-sqs';
import { Duration } from '@aws-cdk/core';

/** Represents a mapping from the request onto the parameters for an integration */
export class Mapping {
  /**
   * Use a value from the body.
   *
   * @param path a JSON path-like expression to select a value from the request
   * @default - use the whole request body
   */
  static fromRequestBody(path?: string) {
    return new Mapping(`$request.body${path ? `.${path}` : ''}`);
  }
  /**
   * Use a value from a the request header.
   *
   * @param headerName the header containing the mapped value
   */
  static fromRequestHeader(headerName: string) {
    return new Mapping(`$request.header.${headerName}`);
  }
  /**
   * Use a value from the querystring.
   *
   * @param queryParam the name of the query parameter
   */
  static fromQueryParam(queryParam: string) {
    return new Mapping(`$request.querystring.${queryParam}`);
  }
  /**
   * Use a value from the path.
   *
   * @param pathParam the path parameter containing the mapped value
   */
  static fromRequestPath(pathParam: string) {
    return new Mapping(`$request.path.${pathParam}`);
  }
  /**
   * Use a context variable.
   *
   * @param variable the name of the context variable
   */
  static fromContextVariable(variable: string) {
    return new Mapping(`$context.${variable}`);
  }
  /**
   * Use a state variable.
   *
   * @param variable the name of the state variable
   */
  static fromStateVariable(variable: string) {
    return new Mapping(`$stageVariables.${variable}`);
  }
  /**
   * @param expression the value of the mapping expression
   */
  private constructor(readonly expression: string) { }
}

/**
 * A string-valued property, either from a fixed value or mapped from the request.
 */
export class StringMappingExpression {
  /**
   * Use a fixed value.
   *
   * @param value the value
   */
  static fromValue(value: string) {
    return new StringMappingExpression(value);
  }
  /**
   * Use a mapping to set the value.
   *
   * @param mapping how to map the value
   */
  static fromMapping(mapping: Mapping) {
    return new StringMappingExpression(mapping.expression);
  }
  /**
   * @param mapping the mapping value
   */
  private constructor(readonly mapping: string) { }
}

/**
 * A number-valued property, either from a fixed value or mapped from the request.
 */
export class NumberMappingExpression {
  /**
   * Use a fixed value.
   *
   * @param value the fixed value
   */
  static fromValue(value: number) {
    return new NumberMappingExpression(value.toString(10));
  }
  /**
   * Use a mapping to set the value.
   *
   * @param mapping how to map the value
   */
  static fromMapping(mapping: Mapping) {
    return new NumberMappingExpression(mapping.expression);
  }
  /**
   * @param mapping the mapping value
   */
  private constructor(readonly mapping: string) { }
}

/**
 * An Array-valued property, either from a fixed value or mapped from the request.
 */
export class ArrayMappingExpression {
  /**
   * Use a fixed value.
   *
   * @param value the fixed value
   */
  static fromValue(value: Array<any>) {
    return new ArrayMappingExpression(JSON.stringify(value));
  }
  /**
   * Use a mapping to set the value.
   *
   * @param mapping how to map the value
   */
  static fromMapping(mapping: Mapping) {
    return new ArrayMappingExpression(mapping.expression);
  }
  /**
   * @param mapping the mapping value
   */
  private constructor(readonly mapping: string) { }
}

/**
 * An EventBus property, either from a fixed value or mapped from the request.
 */
export class EventBusMappingExpression {
  /**
   * Use a fixed value.
   *
   * @param eventBus the fixed value
   */
  static fromEventBus(eventBus: IEventBus) {
    return new EventBusMappingExpression(eventBus.eventBusName);
  }
  /**
   * Use a mapping to set the value.
   *
   * @param mapping how to map the value
   */
  static fromMapping(mapping: Mapping) {
    return new EventBusMappingExpression(mapping.expression);
  }
  /**
   * @param mapping the mapping value
   */
  private constructor(readonly mapping: string) { }
}

/**
 * A Date-valued property, either a fixed value or mapped from the request.
 */
export class DateMappingExpression {
  /**
   * Use a fixed value.
   *
   * @param date the fixed value
   */
  static fromDate(date: Date) {
    return new DateMappingExpression(date.toISOString());
  }
  /**
   * Use a mapping to set the value.
   *
   * @param mapping how to map the value
   */
  static fromMapping(mapping: Mapping) {
    return new DateMappingExpression(mapping.expression);
  }
  /**
   * @param mapping the mapping value
   */
  private constructor(readonly mapping: string) { }
}

/**
 * A Queue-value property, either from a fixed value or mapped from the request.
 */
export class QueueMappingExpression {
  /**
   * Use a fixed value.
   *
   * @param queue the fixed value
   */
  static fromQueue(queue: IQueue) {
    return new QueueMappingExpression(queue.queueUrl);
  }
  /**
   * Use a mapping to set the value.
   *
   * @param mapping how to map the value
   */
  static fromMapping(mapping: Mapping) {
    return new QueueMappingExpression(mapping.expression);
  }
  /**
   * @param mapping the mapping value
   */
  private constructor(readonly mapping: string) { }
}

/**
 * A Duration-valued property, either a fixed value or mapped from the request.
 */
export class DurationMappingExpression {
  /**
   * Use a fixed value.
   *
   * @param duration the fixed value
   */
  static fromDuration(duration: Duration) {
    return new DurationMappingExpression(duration.toSeconds().toString());
  }
  /**
   * Use a mapping to set the value.
   *
   * @param mapping how to map the value
   */
  static fromMapping(mapping: Mapping) {
    return new DurationMappingExpression(mapping.expression);
  }
  /**
   * @param mapping the mapping value
   */
  private constructor(readonly mapping: string) { }
}
