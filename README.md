# Keep Scroll Position for TYPO3

This extension restores the scroll position of a TYPO3 backend module's
content area after a full page reload (e.g. after clicking hide/delete/move/
localize links, which trigger a full navigation instead of an AJAX update).
Without this, TYPO3 always jumps back to the top of the module after such an
action, which is annoying in long lists/trees.

Features
--------
- Restores the scroll position of the backend module body after a full page
  reload triggered by hide/delete/move/localize actions and similar links.
- Works via a PSR-15 middleware plus a small JavaScript snippet, so it also
  reaches module content rendered inside the content container iframe.
- Configurable list of active modules via Page TSconfig.

Requirements
------------
- Composer for installation
- TYPO3 v13.4+

Installation
------------
Install via Composer in your TYPO3 project root:

```bash
composer require itx/keep-scroll-position
```

After installation, clear the TYPO3 caches and check the extension list in
the backend.

Usage
-----
1. Install the extension; no further action is required.
2. Navigate a configured backend module (by default "Web > Page") and trigger
   an action that causes a full page reload (e.g. hide/delete/move/localize).
3. The module content keeps its previous scroll position instead of jumping
   back to the top.

Configuration
-------------
By default, this is only active for the **Web > Page** module (`web_layout`).
You can change the list of active modules via Page TSconfig:

```
mod.keep_scroll_position.modules = web_layout,web_list
```

Use TYPO3's internal module names (as seen in `data-module-name` on the
`.module` container, or in `Configuration/Backend/Modules.php` of the
corresponding extension), comma-separated.

Development / Contributing
--------------------------
Contributions are welcome. Please open an issue or a pull request on the
repository. When contributing:

- Follow PSR-12 coding style where possible.
- Add tests for new functionality if applicable.
- Update `CHANGELOG` when creating releases.

Support
-------
If you encounter problems or bugs, please open an issue on the repository.

License
-------
This extension is licensed under the GPL-2.0-or-later.

Changelog
---------
See the `Changelog/` directory for release notes and history.

Notes
-----
- The extension installs as a Composer package and will be placed in
  `vendor/` by Composer. If you require installation into `typo3conf/ext/`,
  configure installer paths accordingly.
