  /**
   * Check if value is not null, undefined or empty string
   * @param {String} value - check value
   * @returns
   */
  function _isNotEmptyString(value) {
    if (
        value === undefined ||
        value === null ||
      (typeof value !== "string") ||
      value.trim() === ""
    ) {
      return false;
    }

    return true;
  }

  /**
   * Check that value is object
   * @param {Object} value 
   * @returns 
   */
  function _isObject(value) {
    if (
        value === undefined ||
        value === null ||
      (typeof value !== "object")      
    ) {
      return false;
    }

    return true;
  }

export const guard = {
    string: {
        isNotEmpty: _isNotEmptyString
    },
    object: {
        is: _isObject
    }
}