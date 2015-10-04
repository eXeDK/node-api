# Paylike client (Node.js)

Manage your Paylike transactions and account easily.

With [browserify](https://github.com/substack/node-browserify/) you can use
this library in the browser as well. Be aware that you should not bundle your
private API keys for public websites though.

## Getting an API key

An API key can be obtained by creating a merchant and adding an app through our [dashboard](https://app.paylike.io). If your app's target audience is third parties, please reach out and we will make your app's API key hidden.

## Install

```shell
npm install paylike --save
```

```js
var paylike = require('paylike')(appKey);
```

## Promises or callbacks (we support both)

All asynchronous methods will return [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) or accept a callback as the last argument (node style).

```js
paylike.capture(transactionPkA, {
	amount: 100,
})
	.then(function(){
		// capture is successfully done
	}, function(){
		// capture failed
	});

paylike.refund(transactionPkB, {
	amount: 100,
}, function( err ){
	if (err)
		return console.error(err);	// refund failed

	// refund was successful
});
```

## Cursors

TODO

## Error handling

The API will throw errors when things do not fly. All errors inherit from
`PaylikeError`. A very verbose example of catching all types of errors:

```js
paylike.capture(transactionPk, {
	amount: 100,
	currency: 'EUR',
})
	.catch(paylike.NotFoundError, function(){
		console.error('The transaction was not found');
	})
	.catch(paylike.AuthorizationError, paylike.PermissionsError, function(){
		console.error('The API key does not have access to the transaction');
	})
	.catch(paylike.ValidationError, function( e ){
		console.error('The capture failed:', e.data);
	})
	.catch(paylike.PaylikeError, function( e ){
		console.error('Something went wrong', e);
	});
```

In most cases catching `NotFoundError` and `ValidationError` as client errors
and logging `PaylikeError` would suffice.

## Methods

```
findApp() -> Promise(App)
createMerchant(opts) -> Promise(pk)
invite(email) -> Promise
findMerchants(appPk) -> Cursor
findMerchant(merchantPk) -> Promise(Merchant)
createTransaction(merchantPk, opts) -> Promise(pk)
capture(transactionPk, opts) -> Promise
refund(transactionPk, opts) -> Promise
void(transactionPk, opts) -> Promise
findTransactions(merchantPk) -> Cursor
findTransaction(transactionPk) -> Promise(Transaction)
saveCard(merchantPk, opts) -> pk
```

A webshop would typically need only `capture`, `refund` and `void`. Some might
as well use `findTransaction` and for recurring subscriptions
`createTransaction`.

### Example (capturing a transaction)

```js
paylike.capture(transactionPk, {
	amount: 1200,
	currency: 'USD',
	descriptor: 'Awesome #5011',
})
	.then(function(){
		console.log('Captured USD 12.00 appearing as "Awesome #5011" on customers bank statement');
	});
```