import {
  each,
  isEmpty,
  isArray,
  isObject,
  isString,
  camelCase,
  snakeCase,
} from 'lodash';

const transform = (
  body: object,
  transformFn: (string?: string | undefined) => string
) => {
  const transformObj = (obj: object | null) => {
    each(obj, (value: object, key: string) => {
      // @ts-ignore
      delete obj[key];
      // @ts-ignore
      obj[transformFn(key)] = value;

      if (!isString(value)) {
        transformObj(value);
      }
    });
  };

  if (isArray(body)) {
    each(body, (obj: object | null) => {
      if (isObject(obj)) {
        transformObj(obj);
      }
    });
  } else if (isObject(body)) {
    transformObj(body);
  }

  return body;
};

const transformKeys = {
  toCamelCase: (body: object) => {
    return isEmpty(body) ? body : transform(body, camelCase);
  },
  toSnakeCase: (body: object) => {
    return isEmpty(body) ? body : transform(body, snakeCase);
  },
};

export default transformKeys;
