/**
 * Format bytes as a human readable string
 *
 * @param bytes Number of bytes to format
 * @param decimals Number of decimal places to show (default 2)
 * @returns Formatted string with appropriate unit suffix
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  decimals = decimals < 0 ? 0 : decimals;

  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}
