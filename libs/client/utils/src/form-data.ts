export const CREATE_FORM_DATA = (JSON_PAYLOAD: object) => {
  if (!JSON_PAYLOAD || typeof JSON_PAYLOAD != 'object')
    THROW_ERROR_MESSAGES('NOT AN OBJECT', 'JSON_PAYLOAD', JSON_PAYLOAD);

  const formData = new FormData();
  for (const [key, value] of Object.entries(JSON_PAYLOAD)) {
    if (value != null) {
      if (value instanceof Array) {
        // key : [{ key : value}]
        value.forEach(function (elm, index) {
          if (elm instanceof Object) {
            for (const objValue in elm) {
              if (elm[objValue] != null)
                formData.append(`${key}[${index}][${objValue}]`, elm[objValue]);
            }
          } else {
            if (elm) formData.append(`${key}[]`, elm);
          }
        });
      } else if (value instanceof Object) {
        if (value.name && value.size && value.lastModified) {
          // Files
          formData.append(key, value);
        } else {
          // Object
          for (const objValue in value) {
            // key : { key : value}
            if (value[objValue] != null)
              formData.append(`${key}[${objValue}]`, value[objValue]);
          }
        }
      } else {
        // { key : value}
        formData.append(key, value);
      }
    }
  }
  return formData;
};

export const THROW_ERROR_MESSAGES = (
  type = 'NOT AN OBJECT',
  varName = '',
  currentValue = null
) => {
  let errorMessage = '';
  switch (type) {
    case 'NOT AN OBJECT':
      errorMessage = `${varName} is not an OBJECT. CURRENT VALUE : ${currentValue}`;
      break;
  }
  throw { ERROR: errorMessage };
};
