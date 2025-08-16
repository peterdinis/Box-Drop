import prettyBytes from 'pretty-bytes';

export function formatBytes(bytes: number): string {
  return prettyBytes(bytes);
}