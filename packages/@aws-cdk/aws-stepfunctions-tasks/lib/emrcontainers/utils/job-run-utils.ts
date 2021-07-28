import * as cdk from '@aws-cdk/core';
import { ApplicationConfiguration } from '../base-types';

/**
   * Render the EMR Containers ConfigurationProperty as JSON
   *
   * @param property
   */
export function ApplicationConfigPropertyToJson(property: ApplicationConfiguration) {
  return {
    Classification: cdk.stringToCloudFormation(property.classification.classificationStatement),
    Properties: cdk.objectToCloudFormation(property.properties),
    Configurations: cdk.listMapper(ApplicationConfigPropertyToJson)(property.nestedConfig),
  };
}