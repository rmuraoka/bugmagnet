module.exports = function ChromeMenuBuilder(chrome) {
	'use strict';
	let itemValues = {},
		itemHandlers = {};
	const self = this,
		contexts = ['editable'];
	self.rootMenu = function (title) {
		const context_title = chrome.i18n.getMessage(title) === '' ? title : chrome.i18n.getMessage(title);
		return chrome.contextMenus.create({'id': title, 'title': context_title, 'contexts': contexts});
	};
	self.subMenu = function (title, parentMenu, index) {
		const context_title = chrome.i18n.getMessage(title) === '' ? title : chrome.i18n.getMessage(title);
		return chrome.contextMenus.create({'id': title + index, 'title': context_title, 'parentId': parentMenu, 'contexts': contexts});
	};
	self.separator = function (parentMenu) {
		return chrome.contextMenus.create({'id': 'separator', 'type': 'separator', 'parentId': parentMenu, 'contexts': contexts});
	};
	self.menuItem = function (title, parentMenu, clickHandler, value, index) {
		const context_title = chrome.i18n.getMessage(title) === '' ? title : chrome.i18n.getMessage(title),
			id = chrome.contextMenus.create({'id': title + value + index, 'title': context_title, 'parentId': parentMenu, 'contexts': contexts});
		itemValues[id] = value;
		itemHandlers[id] = clickHandler;
		return id;
	};
	self.choice  = function (title, parentMenu, clickHandler, value) {
		const id = chrome.contextMenus.create({'id': title, type: 'radio', checked: value, title: title, parentId: parentMenu, 'contexts': contexts});
		itemHandlers[id] = clickHandler;
		return id;
	};
	self.removeAll = function () {
		itemValues = {};
		itemHandlers = {};
		return new Promise(resolve => chrome.contextMenus.removeAll(resolve));
	};
	// eslint-disable-next-line one-var
	const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
	self.selectChoice = function (menuId) {
		return chrome.contextMenus.update(menuId, {checked: true});
	};
	// eslint-disable-next-line one-var
	const wait = async () => {
		await sleep(30);
		return new Promise((resolve) => {
			resolve();
		});
	};
	chrome.contextMenus.onClicked.addListener(async (info, tab) => {
		await wait();
		const itemId = info && info.menuItemId;
		if (itemHandlers[itemId]) {
			itemHandlers[itemId](tab.id, itemValues[itemId]);
		}
	});
};
