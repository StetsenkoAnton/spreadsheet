import { CONST } from "../../core/constant.js";

function _error(code, message) {
  return {
    success: false,
    data: null,
    message: message || "",
    code: code || CONST.RESPONSE.CODE.BAD_REQUEST,
  };
}

function _success(data) {
  return {
    success: true,
    data: data || {},
    message: "",
    code: CONST.RESPONSE.CODE.SUCCESS,
  };
}

export { _error as error, _success as success };
