export function throttle(func, time = 33) {
  let lastArgs = null;
  let inThrottle = false;
  return function () {
    // eslint-disable-next-line prefer-rest-params
    lastArgs = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, lastArgs);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
        // TODO can call twice
        func.apply(context, lastArgs);
      }, time);
    }
  };
}
