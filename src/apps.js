'use strict';

var assign = require('object-assign');

module.exports = Apps;

function Apps( service ){
	this.service = service;
}

assign(Apps.prototype, {
	// https://github.com/paylike/api-docs#fetch-current-app
	findOne: function( cb ){
		return this.service.request('GET', '/me')
			.get('identity')
			.nodeify(cb);
	},
})