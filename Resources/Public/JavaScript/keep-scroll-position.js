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

	const getScrollContainer = () => document.querySelector('.t3js-module-body')

	const storageKey = () => STORAGE_KEY_PREFIX + getModuleName()

	const restoreScroll = () => {
		const stored = window.sessionStorage.getItem(storageKey())
		if (stored === null) {
			return
		}
		window.sessionStorage.removeItem(storageKey())
		const container = getScrollContainer()
		if (container) {
			container.scrollTop = parseInt(stored, 10) || 0
		}
	}

	const rememberScroll = () => {
		const container = getScrollContainer()
		window.sessionStorage.setItem(storageKey(), String(container ? container.scrollTop : 0))
	}

	document.addEventListener('DOMContentLoaded', () => {
		if (!isEnabledForCurrentModule()) {
			return
		}
		const container = getScrollContainer()
		if (!container) {
			return
		}
		container.querySelectorAll('a[href]').forEach(link => {
			link.addEventListener('click', rememberScroll)
		})
		container.querySelectorAll('form').forEach(form => {
			form.addEventListener('submit', rememberScroll)
		})
	})

	window.addEventListener('load', () => {
		if (!isEnabledForCurrentModule()) {
			return
		}
		requestAnimationFrame(() => requestAnimationFrame(restoreScroll))
	})
})()
