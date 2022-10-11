import {Viewport, WebView} from '../components';

/**
 * Initializes viewport information.
 */
export async function initViewport() {
  // In case, viewport was changed from external environment, apply it.
  WebView.on('viewport_changed', (height, isExpanded, isStateStable) => {
    Viewport.applyViewportInfo({height, isExpanded, isStateStable});
  });

  // TODO: Not sure, this function should exist. It looks like, native
  //  environment should call call viewport_changed event. So we will be sure,
  //  we have correct viewport size. Additionally, this will lead to less
  //  errors as long as only native app will control information about
  //  viewport's size.
  window.addEventListener('resize', () => Viewport.applyViewportInfo({
    height: window.innerHeight,
    isStateStable: true,
    isExpanded: true,
  }));

  await Viewport.sync();
}