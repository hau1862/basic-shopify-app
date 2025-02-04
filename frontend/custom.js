"use strict";

//prettier-ignore
[Number, Boolean, String, BigInt, Symbol, RegExp, Object, Array, Set, Map, Function].map(function (dataType) {
	return {
		target: Object.prototype,
		name: `is${dataType.name}`,
		value: function () {
			return this.constructor === dataType;
		}
	};
}).concat([
	{
		target: Object.prototype,
		name: "copy",
		value: function () {
			switch (this.constructor) {
				case Symbol: {
					const source = this, constructorKeys = ["description"];

					return Symbol(...constructorKeys.map(function (key) {
						return source[key] && source[key].copy();
					}));
				}
				case RegExp: {
					const source = this, constructorKeys = ["source", "flags"], attributeKeys = ["lastIndex"];
					const result = new RegExp(...constructorKeys.map(function (key) {
						return source[key] && source[key].copy();
					}));

					attributeKeys.forEach(function (key) {
						result[key] = source[key] && source[key].copy();
					});

					return result;
				}
				case Object: {
					const result = {};

					for (const key in this) {
						const resultKey = key && key.copy();
						result[resultKey] = this[resultKey] && this[resultKey].copy();
					}

					return result;
				}
				case Array: {
					return this.map(function (item) {
						return item && item.copy();
					});
				}
				case Set: {
					const keys = Array.from(this.keys());
					return new Set(keys.copy());
				}
				case Map: {
					const result = new Map();

					this.forEach(function (value, key) {
						result.set(key && key.copy(), value && value.copy());
					});

					return result;
				}
				default: {
					return this;
				}
			}
		}
	},
	{
		target: Object.prototype,
		name: "equalTo",
		value: function (target) {
			if (this === target) {
				return true;
			} else if (target && this.constructor === target.constructor) {
				switch (this.constructor) {
					case Symbol: {
						const source = this, keys = ["description"];

						return keys.every(function (key) {
							const sourceValue = source[key], targetValue = target[key];
							return sourceValue ? sourceValue.equalTo(targetValue) : sourceValue === targetValue;
						});
					}
					case RegExp: {
						const source = this, keys = ["source", "flags", "lastIndex"];

						return keys.every(function (key) {
							const sourceValue = source[key], targetValue = target[key];
							return sourceValue ? sourceValue.equalTo(targetValue) : sourceValue === targetValue;
						});
					}
					case Object: {
						const source = this, sourceKeys = Object.keys(this), targetKeys = Object.keys(target);

						return sourceKeys.length === targetKeys.length && sourceKeys.every(function (key) {
							if (Object.hasOwn(target, key)) {
								const sourceValue = source[key], targetValue = target[key];
								return sourceValue ? sourceValue.equalTo(targetValue) : sourceValue === targetValue;
							} else {
								return false;
							}
						});
					}
					case Array: {
						return this.length === target.length && this.every(function (sourceItem, index) {
							const targetItem = target[index];
							return sourceItem ? sourceItem.equalTo(targetItem) : sourceItem === targetItem;
						});
					}
					case Set: {
						const sourceItems = Array.from(this.keys()), targetItems = Array.from(target.keys());

						return this.size === target.size && sourceItems.every(function (sourceItem) {
							return sourceItem ? targetItems.some((targetItem) => sourceItem.equalTo(targetItem)) : target.has(sourceItem);
						});
					}
					case Map: {
						const source = this, sourceKeys = Array.from(this.keys());

						return this.size === target.size && sourceKeys.every(function (key) {
							if (target.has(key)) {
								const sourceValue = source.get(key), targetValue = target.get(key);
								return sourceValue ? sourceValue.equalTo(targetValue) : sourceValue === targetValue;
							} else {
								return false;
							}
						});
					}
					default: {
						return false;
					}
				}
			} else {
				return false;
			}
		}
	},
	{
		target: String.prototype,
		name: "toCapitalize",
		value: function () {
			const regexp = /(\b|[.,; ])([a-z])/g;
			return this.replace(regexp, function (_match, digit, letter) {
				return digit + letter.toUpperCase();
			});
		}
	},
	{
		target: String.prototype,
		name: "toPascalCase",
		value: function () {
			const regexp = /(\b|[_-])([a-z])/g;
			return this.replace(regexp, function (_match, _digit, letter) {
				return letter.toUpperCase();
			});
		}
	},
	{
		target: String.prototype,
		name: "toCamelCase",
		value: function () {
			const regexp = /[_-]([a-z])/g;
			return this.replace(regexp, function (_match, letter) {
				return letter.toUpperCase();
			});
		}
	},
	{
		target: String.prototype,
		name: "toSnakeCase",
		value: function () {
			const regexp = /(.?)([A-Z])/g;
			return this.replace(regexp, function (_match, digit, letter) {
				return (digit ? digit + "_" : "") + letter.toLowerCase();
			});
		}
	},
	{
		target: String.prototype,
		name: "format",
		value: function (data = {}) {
			const regexp = /{([A-Za-z0-9_-]+)}/g;
			return data.constructor === Object ? this.replace(regexp, function (match, key) {
				return Object.hasOwn(data, key) ? data[key] : match;
			}) : this;
		}
	},
	{
		target: String.prototype,
		name: "isEmail",
		value: function () {
			const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return regexp.test(this);
		}
	},
	{
		target: String.prototype,
		name: "isPhoneNumber",
		value: function () {
			const regexp = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s/0-9]*$/;
			return regexp.test(this);
		}
	}
]).forEach(function (item) {
	const data = { value: item.value, configurable: false, enumerable: false, writable: false };
	Object.defineProperty(item.target, item.name, data);
});
