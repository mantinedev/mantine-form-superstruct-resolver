import type { Struct } from 'superstruct';
import type { FormErrors } from '@mantine/form';

export function superstructResolver(schema: Struct) {
  return (values: Record<string, unknown>): FormErrors => {
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
  };
}
