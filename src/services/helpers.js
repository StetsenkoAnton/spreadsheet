export const throttle = (func, time = 33) => {
  let inThrottle;
  return function () {
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, time);
    }
  };
};
