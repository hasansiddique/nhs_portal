export function clsx(...classes: unknown[]): string {
  return classes.filter(Boolean).join(' ');
}
