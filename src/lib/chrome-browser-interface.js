module.exports = function ChromeBrowserInterface(chrome) {
	'use strict';
	const self = this;
	self.saveOptions = function (options) {
		chrome.storage.sync.set(options);
	};
	self.getOptionsAsync = function () {
		return new Promise((resolve) => {
			chrome.storage.sync.get(null, resolve);
		});
	};
	self.openSettings = function () {
		if (chrome.runtime.openOptionsPage) {
			chrome.runtime.openOptionsPage();
		} else {
			window.open(chrome.runtime.getURL('options.html'));
		}
	};
	self.openUrl = function (url) {
		chrome.tabs.create({ url: url });
	};
	self.addStorageListener = function (listener) {
		chrome.storage.onChanged.addListener(function (changes, areaName) {
			if (areaName === 'sync') {
				listener(changes);
			};
		});
	};
	self.getRemoteFile = function (url) {
		return fetch(url, {mode: 'cors'}).then(function (response) {
			if (response.ok) {
				return response.text();
			}
			throw new Error('Network error reading the remote URL');
		});
	};
	self.closeWindow = function () {
		window.close();
	};
	self.readFile = function (fileInfo) {
		return new Promise((resolve, reject) => {
			const oFReader = new FileReader();
			oFReader.onload = function (oFREvent) {
				try {
					resolve(oFREvent.target.result);
				} catch (e) {
					reject(e);
				}
			};
			oFReader.onerror = reject;
			oFReader.readAsText(fileInfo, 'UTF-8');
		});
	};
	self.executeScript = function (tabId, source) {
		return new Promise((resolve) => {
			chrome.scripting.executeScript({
				target: {tabId: tabId},
				files: [source]
			}, (result) => {
				resolve(result && result.length ? result[0] : null);
			});
		});
	};
	self.sendMessage = function (tabId, message) {
		return chrome.tabs.sendMessage(tabId, message);
	};

	self.requestPermissions = function (permissionsArray) {
		return new Promise((resolve, reject) => {
			try {
				chrome.permissions.request({permissions: permissionsArray}, function (granted) {
					if (granted) {
						resolve();
					} else {
						reject();
					}
				});
			} catch (e) {
				console.log(e);
				reject(e);
			}
		});
	};
	self.removePermissions = function (permissionsArray) {
		return new Promise((resolve) => chrome.permissions.remove({permissions: permissionsArray}, resolve));
	};
	self.copyToClipboard = function (text, tabId) {
		chrome.tabs.sendMessage(tabId, {action: 'copyToClipboard', text: text});
	};
	function alertFunction(text) {
		alert(text);
	}
	self.showMessage = function (text) {
		chrome.scripting.executeScript({
			target: null,
			func: alertFunction,
			args: [text]
		});
	};
};

