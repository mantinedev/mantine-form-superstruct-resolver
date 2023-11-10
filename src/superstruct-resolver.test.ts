import * as s from 'superstruct';
import isEmail from 'is-email';
import { act, renderHook } from '@testing-library/react';
import { useForm } from '@mantine/form';
import { superstructResolver } from './superstruct-resolver';

const emailString = s.define('email', isEmail);

const schema = s.object({
  name: s.size(s.string(), 2, 30),
  email: emailString,
  age: s.min(s.number(), 18),
});

it('validates basic fields with given superstruct schema', () => {
  const hook = renderHook(() =>
    useForm({
      initialValues: {
        name: '',
        email: '',
        age: 16,
      },
      validate: superstructResolver(schema),
    })
  );

  expect(hook.result.current.errors).toStrictEqual({});
  act(() => hook.result.current.validate());

  expect(hook.result.current.errors).toStrictEqual({
    name: 'name: Expected a string with a length between `2` and `30` but received one with a length of `0`',
    email: 'email: Expected a value of type `email`, but received: `""`',
    age: 'age: Expected a number greater than or equal to 18 but received `16`',
  });

  act(() => hook.result.current.setValues({ name: 'John', email: 'john@email.com', age: 16 }));
  act(() => hook.result.current.validate());

  expect(hook.result.current.errors).toStrictEqual({
    age: 'age: Expected a number greater than or equal to 18 but received `16`',
  });
});

const nestedSchema = s.object({
  nested: s.object({
    field: s.size(s.string(), 2, 30),
  }),
});

it('validates nested fields with given superstruct schema', () => {
  const hook = renderHook(() =>
    useForm({
      initialValues: {
        nested: {
          field: '',
        },
      },
      validate: superstructResolver(nestedSchema),
    })
  );

  expect(hook.result.current.errors).toStrictEqual({});
  act(() => hook.result.current.validate());

  expect(hook.result.current.errors).toStrictEqual({
    'nested.field':
      'nested field: Expected a string with a length between `2` and `30` but received one with a length of `0`',
  });

  act(() => hook.result.current.setValues({ nested: { field: 'John' } }));
  act(() => hook.result.current.validate());

  expect(hook.result.current.errors).toStrictEqual({});
});

const listSchema = s.object({
  list: s.array(
    s.object({
      name: s.size(s.string(), 2, 30),
    })
  ),
});

it('validates list fields with given superstruct schema', () => {
  const hook = renderHook(() =>
    useForm({
      initialValues: {
        list: [{ name: '' }],
      },
      validate: superstructResolver(listSchema),
    })
  );

  expect(hook.result.current.errors).toStrictEqual({});
  act(() => hook.result.current.validate());

  expect(hook.result.current.errors).toStrictEqual({
    'list.0.name':
      'list 0 name: Expected a string with a length between `2` and `30` but received one with a length of `0`',
  });

  act(() => hook.result.current.setValues({ list: [{ name: 'John' }] }));
  act(() => hook.result.current.validate());

  expect(hook.result.current.errors).toStrictEqual({});
});
