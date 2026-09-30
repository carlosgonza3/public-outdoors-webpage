# Browser colors

The site's light tone is its existing warm white (`#f7f5ef`). Dark sections use their own background colors. These follow the displayed content, independently of the operating system's appearance.

`src/animation/pageTone.ts` synchronizes the document/body backgrounds, `--page-background`, `theme-color`, and `color-scheme`. Section scroll callbacks set the underlying tone. Dialogs use `usePageTone` with an overlay owner so background callbacks cannot replace the dialog's tone, and closing nested dialogs restores the current underlying tone. Updates are synchronous; no delayed frame can repaint an obsolete color.

Collection and availability pages set their tone on mount. Their generated HTML also includes a dark initial background and metadata to avoid a light loading flash. The `pageshow` listener reapplies the current tone after browser history restoration.

Safari uses the same `theme-color`, document background, and color-scheme hints as the other browsers. Do not add fixed viewport-edge tint strips: iOS Safari can paint bottom-fixed layers at the wrong vertical position when its floating toolbar expands or collapses, causing a strip to cross page content. `apple-mobile-web-app-status-bar-style` remains stable; changing it dynamically is not a reliable toolbar color mechanism.

## Browser expectations

- Chrome/Edge on Android: `theme-color` is the toolbar color hint.
- Safari: behavior varies with version, toolbar layout, website tint settings, and OS appearance. Backgrounds and viewport-edge surfaces matter in newer Safari versions.
- Desktop Chrome/Edge and Firefox: do not assume a website can recolor the entire native browser frame. Page backgrounds and native page controls still follow the site's scheme.

References: [Chrome theme-color](https://developer.chrome.com/blog/support-for-theme-color-in-chrome-39-for-android/), [Safari 15 theme-color](https://webkit.org/blog/11989/new-webkit-features-in-safari-15/), [WebKit explanation of Safari viewport-edge tinting](https://bugs.webkit.org/show_bug.cgi?id=301756), [WebKit fixed-position regression](https://bugs.webkit.org/show_bug.cgi?id=312149).

## Validation

Automated: `node scripts/check-page-tone.mjs`, `npm run check:release`, `npm run build`, and `npm run lint`.

In-app browser checks confirmed light homepage → dark contact dialog → restored light homepage at narrow and 1440px widths, plus the dark direct collection route. This does not validate native Safari or Android toolbar UI.

Device acceptance pass: Safari on iPhone/iPad/macOS, Chrome and Edge on Android, and desktop Chrome/Firefox. Try OS light and dark appearance; scroll from intro through dark sections, light team, dark history, and back; open/close contact, collection, availability, and image dialogs; directly reload each route; use browser Back/Forward; rotate a mobile device and collapse/expand its toolbar. Native toolbar testing remains pending on those devices.
