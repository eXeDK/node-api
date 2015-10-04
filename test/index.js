'use strict';

var Promise = require('bluebird');
var test = require('tape');

var paylike = require('../')('a2cca60d-d25e-407e-9177-a18ef6cfdc71');

var appPk = '560e4ae122146ace420c9ef8';

test('find app', function( t ){
	t.plan(1);

	paylike
		.findApp()
		.tap(function( app ){
			t.ok(app.pk, 'app pk');
		});
});

test('create a merchant', function( t ){
	t.test('validation error', function( t ){
		t.plan(2);

		paylike
			.createMerchant()
			.tap(function(){
				t.fail();
			})
			.catch(paylike.ValidationError, function( e ){
				t.ok(e.message, 'message');
				t.ok(Array.isArray(e.data), 'array of data');
			});
	});

	t.test(function( t ){
		t.plan(1);

		paylike
			.createMerchant({
				company: {
					country: 'DK',
				},
				currency: 'DKK',
				email: 'john@example.com',
				website: 'https://example.com',
				descriptor: 'Coffee & John',
				test: true,
			})
			.tap(function( pk ){
				t.equal(typeof pk, 'string', 'merchant pk');
			});
	});
});

test('find merchants', function( t ){
	t.plan(4);

	var cursor = paylike.findMerchants(appPk);

	t.ok(cursor instanceof paylike.Cursor, 'returned a cursor');

	var all = cursor
		.limit(10)
		.toArray();

	all.then(function( merchants ){
		t.ok(Array.isArray(merchants), 'toArray gives an array');
	});

	var selection = paylike
		.findMerchants(appPk)
		.filter({ test: true })
		.skip(2)
		.limit(2)
		.toArray();

	Promise
		.join(all, selection)
		.spread(function( merchants, selection ){
			t.equal(selection.length, 2);

			t.deepEqual(selection, merchants.splice(2, 2));
		});
});