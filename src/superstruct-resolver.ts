import type { Struct } from 'superstruct';
import type { FormErrors } from '@mantine/form';

export interface SuperstructResolverOptions {
  mode?: 'sync' | 'async';
}

function resolveSync(schema: Struct, values: Record<string, unknown>): FormErrors {
  const results: FormErrors = {};
  const [err] = schema.validate(values);

  if (!err) {
    return results;
  }

  err.failures().forEach((fieldFailure) => {
    const fieldName = fieldFailure.path.join(' ');
    results[fieldFailure.path.join('.')] = `${fieldName}: ${fieldFailure.message}`;
  });

  return results;
}

export function superstructResolver(
  schema: Struct,
  options: SuperstructResolverOptions & { mode: 'async' }
): (values: Record<string, unknown>) => Promise<FormErrors>;

export function superstructResolver(
  schema: Struct,
  options?: SuperstructResolverOptions
): (values: Record<string, unknown>) => FormErrors;

export function superstructResolver(schema: Struct, options?: SuperstructResolverOptions) {
  return (values: Record<string, unknown>) => {
    if (options?.mode === 'async') {
      return Promise.resolve(resolveSync(schema, values));
    }

    return resolveSync(schema, values);
  };
}
