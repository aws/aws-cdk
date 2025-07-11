import { Names } from 'aws-cdk-lib/core';
import { IConstruct } from 'constructs';

export function generateUniqueId(context: IConstruct): string {
  const name = Names.uniqueId(context);
  if (name.length > 100) {
    return name.substring(0, 50) + name.substring(name.length - 50);
  }
  return name;
}

/**
 * Data source for a place index
 */
export enum DataSource {
  /**
   * Esri
   *
   * @see https://docs.aws.amazon.com/location/latest/developerguide/esri.html
   */
  ESRI = 'Esri',

  /**
   * Grab provides routing functionality for Southeast Asia.
   *
   * @see https://docs.aws.amazon.com/location/latest/developerguide/grab.html
   */
  GRAB = 'Grab',

  /**
   * HERE
   *
   * @see https://docs.aws.amazon.com/location/latest/developerguide/HERE.html
   */
  HERE = 'Here',
}
