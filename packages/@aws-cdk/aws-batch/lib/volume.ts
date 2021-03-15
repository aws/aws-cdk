/**
 * The details on a container instance bind mount host volume.
 */
export interface Host {
  /**
   * Specifies the path on the host container instance that is presented to the container.
   * If the sourcePath value does not exist on the host container instance, the Docker daemon creates it.
   * If the location does exist, the contents of the source path folder are exported.
   *
   * This property is not supported for tasks that use the Fargate launch type.
   */
  readonly sourcePath?: string;
}

/**
 * A data volume used in a task definition.
 *
 * For tasks that use a Docker volume, specify a DockerVolumeConfiguration.
 * For tasks that use a bind mount host volume, specify a host and optional sourcePath.
 *
 * For more information, see [Using Data Volumes in Tasks](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_data_volumes.html).
 */
export interface Volume {
  /**
   * This property is specified when you are using bind mount host volumes.
   *
   * Bind mount host volumes are supported when you are using either the EC2 or Fargate launch types.
   * The contents of the host parameter determine whether your bind mount host volume persists on the
   * host container instance and where it is stored. If the host parameter is empty, then the Docker
   * daemon assigns a host path for your data volume. However, the data is not guaranteed to persist
   * after the containers associated with it stop running.
   */
  readonly host?: Host;

  /**
   * The name of the volume.
   *
   * Up to 255 letters (uppercase and lowercase), numbers, and hyphens are allowed.
   * This name is referenced in the sourceVolume parameter of container definition mountPoints.
   */
  readonly name: string;
}
