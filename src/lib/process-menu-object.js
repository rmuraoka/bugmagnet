module.exports = function processMenuObject(configObject, menuBuilder, parentMenu, onClick, index) {
	'use strict';
	if (index === undefined) {
		index = 0;
	}
	const getTitle = function (key) {
		if (configObject instanceof Array) {
			return configObject[key];
		}
		return key;
	};
	if (!configObject) {
		return;
	}
	Object.keys(configObject).forEach(function (key) {
		const value = configObject[key],
			title = getTitle(key);
		let result;
		if (typeof (value) === 'string' || (typeof (value) === 'object' && value.hasOwnProperty('_type'))) {
			menuBuilder.menuItem(title, parentMenu, onClick, value, index);
			index++;
		} else if (typeof (value) === 'object') {
			result = menuBuilder.subMenu(title, parentMenu, index);
			index++;
			index = processMenuObject(value, menuBuilder, result, onClick, index);
		}
	});
	return index;
};

