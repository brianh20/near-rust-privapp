secret_safe


Commands:

RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release

near login
near deploy --wasmFile target/wasm32-unknown-unknown/release/secret_safe.wasm --accountId {accountId})

near call {accountId} new --accountId {accountId})
near call ss-6.testnet new --accountId ss-6.testnet
near call ss-6.testnet get_contract_owner --accountId ss-6.testnet
near call ss-6.testnet get_count --accountId ss-6.testnet

near view ss-6.testnet get_secrets --accountId ss-6.testnet

near view ss-6.testnet get_secrets_by_asker '{"asker": "ss-6.tesnet"}' --accountId ss-6.testnet

near call ss-6.testnet store_secret '{"title": "First secret stored!", "content": "https://www.near-sdk.io/assets/images/erase-recreate-subaccount--3one9.near--3one92-7d5e385b4a5b788168a2419d108180f8.gif", "price": 1.234}' --accountId ss-6.testnet

near call ss-6.testnet buy_secret '{"_key": "1"}' --accountId sc-1.testnet --amount 1.234

NOTES: THIS IS UNSAFE CONTRACT

TODO:
- pagination
- upload to ipfs?

Improvements:
- keys should be hex
- missing tests
- update secret price
- add block link https://testnet.nearblocks.io/txns/37ugYLNJi3FXsQZNwzgoCxxVbTyuMEgVjP9Loq6uPd6z
- is it possible to listen to events?


