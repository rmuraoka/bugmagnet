/* global jasmine, window */
module.exports = function FakeChromeApi() {
	'use strict';
	const self = this,
		event = function (name) {
			return jasmine.createSpyObj(name, ['addListener', 'removeListener']);
		};
	self.runtime = {
		onMessage: event('onMessage')
	};
	self.contextMenus = jasmine.createSpyObj('chrome.contextMenus', ['create', 'removeAll']);
	self.i18n = jasmine.createSpyObj('chrome.i18n', ['getMessage']);
	self.contextMenus.onClicked = event('onClicked');
	self.extension = jasmine.createSpyObj('chrome.extension', ['getURL']);
	self.tabs = jasmine.createSpyObj('chrome.tabs', ['sendMessage', 'executeScript']);

	self.storage = {
		onChanged: event('onChanged')
	};
	self.storage.sync = jasmine.createSpyObj('chrome.storage.sync', ['get']);
};
