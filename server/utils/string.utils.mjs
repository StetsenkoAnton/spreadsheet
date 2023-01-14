function _toEmptyString(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return value;
}

export const toEmptyString = _toEmptyString;
