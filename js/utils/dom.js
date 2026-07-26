window.VesakDom = {
  $(id) {
    return document.getElementById(id);
  },
  on(el, evt, fn) {
    if (el) el.addEventListener(evt, fn);
  },
  setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  }
};
