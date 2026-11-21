# Photo validation and integration guide

This is a portable extraction of the original gateway's JPEG/PNG decoder, with its machine-specific dependency lookup replaced by a normal package import. It is a library and offline example, not a WhatsApp bot. It contains no account configuration, send function, browser client or model connection.

## Setup and synthetic usage

Requires Node.js 24 or newer. From this directory run `npm ci`, then `npm test` and `npm run example`. Installation downloads dependencies; the tests and example then run offline. The example generates pixels in memory and prints `{"format":"png","width":32,"height":24}`. No real image is included.

Call `await decodePhoto({data: canonicalBase64, mimetype: 'image/png'})` or use `image/jpeg`. The returned object contains decoded-and-validated original `bytes`, `format`, `width` and `height`. Missing data, noncanonical base64, mismatched format, corruption, animation and exceeded limits throw explicit `PHOTO_*` errors. The limits are 6 MiB, 16 million pixels and 8192 pixels per dimension. Every pixel is decoded before acceptance. Original metadata is retained in the returned bytes; validation is not metadata removal. The caller owns storage, retention and downstream disclosure.

## Integrate with an existing gateway

1. Keep the existing client, text branch and supervisor. After authenticated account, sender, private-route and pause checks, accept only a new ordinary JPEG/PNG photo from an explicitly approved route. Exclude group, status, view-once and disappearing media in an initial pilot. If protected-media status is unknown, reject it. Do not backfill history.
2. Use the existing client's `Message.downloadMedia()`, then this decoder. A declared MIME type or thumbnail alone is insufficient. Do not use the sender's filename or caption as a filesystem path.
3. Before processing, atomically claim the durable source message ID in the existing database. Store sender, route, hash and status. Use a bounded queue for albums, preserving each source ID. On restart mark unfinished work interrupted for reconciliation; do not automatically repeat model calls or sends.
4. Store host-named temporary files in a restricted directory outside Git and synchronized folders. Validate canonical paths and reject symlink/junction escapes. Enforce ACLs, short retention, cleanup on failure and a startup cleanup pass. The library does not implement these deployment controls.
5. In a separately verified image-only model route, submit text plus actual image bytes through the runtime's supported image input. The previously tested App Server input shape was `[{type:"text",text:caption},{type:"localImage",path:imagePath}]` inside `turn/start`. This is a historical integration shape, not a promise of compatibility with every installed runtime. Verify the installed schema and permissions before use. Local paths do not imply on-device inference; confirm provider handling before real photos.
6. Treat captions and text in images as untrusted data. Do not grant shell, unrelated filesystem, account or chat access. Bind the result to the source request and sender. Recheck route and reply policy immediately before sending; never forward private results to another chat. For an uncaptioned image, ask what to inspect only when replies are authorized.

## Acceptance and activation

Start with intake and outgoing replies disabled. Generate an image with a unique visible marker absent from the caption, then verify that the model reads the marker and the response binds to that source request. A download, thumbnail or caption response does not prove vision. The included solid-color example tests decoding only.

Before live activation, test unauthorized senders, unavailable/corrupt/oversized/protected photos, four photos arriving together, duplicate events, restart recovery, text-routing regressions and zero outbound messages during the synthetic pilot. Enable one approved private route only after review. Authorize automatic replies separately, with no replay of older photos. Broader routing requires its own reviewed policy. Roll back by disabling intake and reply gates, retaining durable deduplication records and restoring the previous handler. Do not create a second client to work around an intake fault.

## Provenance and limits

The decoder is adapted from user-owned project code prepared in the source conversation. The example and tests are newly authored synthetic companions. No third-party implementation is copied. `sharp` is an external Apache-2.0 dependency with its own transitive dependency notices, installed through npm rather than vendored. This addition does not select a new license for the repository; see [provenance](../../PROVENANCE.md).

Held back: production routing and policy files, private storage/database contents, mailbox integrations, application bundles and a browser-build-specific download workaround. Their removal means this is not a deployable copy of the original assistant. No live WhatsApp, hosted vision, automatic reply or reboot test is claimed by the offline suite.

API references for integration-time verification: [media download](https://docs.wwebjs.dev/Message.html#downloadMedia), [App Server](https://developers.openai.com/codex/app-server/). Check their current contracts before connecting accounts.
