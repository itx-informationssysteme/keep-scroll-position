/**
 * Preserves the vertical scroll position of a TYPO3 backend module's content
 * area across full page reloads (e.g. after clicking hide/delete/move/localize
 * links, which cause a full navigation rather than an AJAX update).
 *
 * The scrollable element in the TYPO3 backend is not the window itself but the
 * ".t3js-module-body" container (see backend.css: ".module-body{overflow:auto}").
 */
;(() => {
	const STORAGE_KEY_PREFIX = 'keepScrollPosition.'

	const getModuleName = () => {
		const moduleEl = document.querySelector('[data-module-name]')
		return moduleEl ? moduleEl.getAttribute('data-module-name') : null
	}

	const isEnabledForCurrentModule = () => {
		const configuredAttr = document.body?.dataset?.keepScrollPositionModules || ''
		const configured = configuredAttr
			.split(',')
			.map(m => m.trim())
			.filter(Boolean)
		const moduleName = getModuleName()
		return moduleName !== null && configured.includes(moduleName)
	}

	const getScrollContainer = () => {
		const moduleBody = document.querySelector('.t3js-module-body')
		if (moduleBody) {
			const overflowY = getComputedStyle(moduleBody).overflowY
			if (overflowY === 'auto' || overflowY === 'scroll') {
				return moduleBody
			}
		}
		return document.scrollingElement || document.documentElement
	}

	const storageKey = () => STORAGE_KEY_PREFIX + getModuleName()

	let lastScrollTop = 0

	document.addEventListener('DOMContentLoaded', () => {
		if (!isEnabledForCurrentModule()) {
			return
		}
		const container = getScrollContainer()
		lastScrollTop = container.scrollTop

		document.addEventListener('scroll', event => {
			const current = getScrollContainer()
			if (event.target === current || event.target === document) {
				lastScrollTop = current.scrollTop
			}
		}, true)
	})

	window.addEventListener('pagehide', () => {
		if (!isEnabledForCurrentModule()) {
			return
		}
		window.sessionStorage.setItem(storageKey(), String(lastScrollTop))
	})

	window.addEventListener('load', () => {
		if (!isEnabledForCurrentModule()) {
			return
		}
		const stored = window.sessionStorage.getItem(storageKey())
		if (stored === null) {
			return
		}
		window.sessionStorage.removeItem(storageKey())
		requestAnimationFrame(() => requestAnimationFrame(() => {
			const container = getScrollContainer()
			container.scrollTo({ top: parseInt(stored, 10) || 0, behavior: 'instant' })
		}))
	})
})()
