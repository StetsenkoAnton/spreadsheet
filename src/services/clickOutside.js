export default function clickOutside(openerEl, watchEl, callBack = () => {}) {
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
