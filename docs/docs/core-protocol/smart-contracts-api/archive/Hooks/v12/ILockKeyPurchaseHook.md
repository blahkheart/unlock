# Solidity API

## ILockKeyPurchaseHook

Functions to be implemented by a keyPurchaseHook.

_Lock hooks are configured by calling `setEventHooks` on the lock._

### keyPurchasePrice

```solidity
function keyPurchasePrice(address from, address recipient, address referrer, bytes data) external view returns (uint256 minKeyPrice)
```

Used to determine the purchase price before issueing a transaction.
This allows the hook to offer a discount on purchases.
This may revert to prevent a purchase.

_the lock's address is the `msg.sender` when this function is called via
the lock's `purchasePriceFor` function_

#### Parameters

| Name      | Type    | Description                                                        |
| --------- | ------- | ------------------------------------------------------------------ |
| from      | address | the msg.sender making the purchase                                 |
| recipient | address | the account which will be granted a key                            |
| referrer  | address | the account which referred this key sale                           |
| data      | bytes   | arbitrary data populated by the front-end which initiated the sale |

#### Return Values

| Name        | Type    | Description                                                            |
| ----------- | ------- | ---------------------------------------------------------------------- |
| minKeyPrice | uint256 | the minimum value/price required to purchase a key with these settings |

### onKeyPurchase

```solidity
function onKeyPurchase(uint256 tokenId, address from, address recipient, address referrer, bytes data, uint256 minKeyPrice, uint256 pricePaid) external
```

If the lock owner has registered an implementer then this hook
is called with every key sold.

_the lock's address is the `msg.sender` when this function is called_

#### Parameters

| Name        | Type    | Description                                                                                   |
| ----------- | ------- | --------------------------------------------------------------------------------------------- |
| tokenId     | uint256 | the id of the purchased key                                                                   |
| from        | address | the msg.sender making the purchase                                                            |
| recipient   | address | the account which will be granted a key                                                       |
| referrer    | address | the account which referred this key sale                                                      |
| data        | bytes   | arbitrary data populated by the front-end which initiated the sale                            |
| minKeyPrice | uint256 | the price including any discount granted from calling this hook's `keyPurchasePrice` function |
| pricePaid   | uint256 | the value/pricePaid included with the purchase transaction                                    |
