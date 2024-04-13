/**
 * Register layouts in the app instance
 *
 * @param {App<Element>} app
 */
export function registerLayouts(app) {
  const layouts = import.meta.globEager("./*.vue");
  Object.entries(layouts).forEach(([, layout]) => {
    app.component(layout?.default?.__name, layout?.default);
  });
}