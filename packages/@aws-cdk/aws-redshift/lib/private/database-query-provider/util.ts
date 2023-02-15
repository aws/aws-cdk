import { ClusterProps } from './types';
import { Column } from '../../table';

export function makePhysicalId(resourceName: string, clusterProps: ClusterProps, requestId: string): string {
  return `${clusterProps.clusterName}:${clusterProps.databaseName}:${resourceName}:${requestId}`;
}

export function getDistKeyColumn(columns: Column[]): Column | undefined {
  // string comparison is required for custom resource since everything is passed as string
  const distKeyColumns = columns.filter(column => column.distKey === true || (column.distKey as unknown as string) === 'true');

  if (distKeyColumns.length === 0) {
    return undefined;
  } else if (distKeyColumns.length > 1) {
    throw new Error('Multiple dist key columns found');
  }

  return distKeyColumns[0];
}

export function getSortKeyColumns(columns: Column[]): Column[] {
  // string comparison is required for custom resource since everything is passed as string
  return columns.filter(column => column.sortKey === true || (column.sortKey as unknown as string) === 'true');
}

export function areColumnsEqual(columnsA: Column[], columnsB: Column[]): boolean {
  if (columnsA.length !== columnsB.length) {
    return false;
  }
  return columnsA.every(columnA => {
    return columnsB.find(column => column.name === columnA.name && column.dataType === columnA.dataType);
  });
}
