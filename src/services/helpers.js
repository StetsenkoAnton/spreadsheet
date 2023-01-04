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

export function clickOutside(openerEl, watchEl, callBack = () => {}) {
  return (e) => {
    e.stopPropagation();
    let clickedOnExcludedEl = false;
    if (!clickedOnExcludedEl && openerEl) {
      const excludedEl = openerEl;
      clickedOnExcludedEl = excludedEl.contains(e.target);
    }
    if (!watchEl.contains(e.target) && !clickedOnExcludedEl) {
      callBack();
    }
  };
}
