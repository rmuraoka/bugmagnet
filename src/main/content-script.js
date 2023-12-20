/*global chrome */
chrome.runtime.onMessage.addListener(function (request) {
	'use strict';
	if (request.action === 'copyToClipboard') {
		const handler = function (e) {
			e.clipboardData.setData('text/plain', request.text);
			e.preventDefault();
		};
		document.addEventListener('copy', handler);
		document.execCommand('copy');
		document.removeEventListener('copy', handler);
	}
});
