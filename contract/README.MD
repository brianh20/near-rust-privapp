# Secret Safe Dapp

## How To run and other commands:

- Compile: `RUSTFLAGS='-C link-arg=-s' cargo build --target wasm32-unknown-unknown --release`
- Login to your account: `near login` -> use the logged in account for _{accountId}_ below
- Deploy contract: `near deploy --wasmFile target/wasm32-unknown-unknown/release/secret_safe.wasm --accountId {accountId})`
- Instatiate contract: `near call {accountId} new --accountId {accountId})`
- Check that you are the contract owner: `near view {accountId} get_contract_owner --accountId {accountId}`
- Check secret count: `near view {accountId} get_count --accountId {accountId}`
- Get all secrets: `near view {accountId} get_secrets --accountId {accountId}`
- Get secrets filter by accountId: `near view {accountId} get_secrets_by_asker '{"asker": "{accountId filter}"}' --accountId {accountId}`
- Create secret: `near call {accountId} store_secret '{"title": "First secret stored!", "content": "https://www.near-sdk.io/assets/images/erase-recreate-subaccount--3one9.near--3one92-7d5e385b4a5b788168a2419d108180f8.gif", "price": 1.234}' --accountId {buyer accountId}` Price includes 5 decimals so 1 is actually 0.00001
- Buy secret: `near call {accountId} buy_secret '{"_key": "{id for secret}"}' --accountId {signer accountId} --amount 1.234`

## NOTES
Magnitudes might be off due to changes for integration with Dapp in `/react` folder involving differences in amounts. Look at logs if you can't purchase. thanks for the feedback.

## Improvements - Things noticed during POC
- Keys should not be usize with a counter but a Hash (will be available in next POC for Real Estate)
- Smart contract is missing tests, moving on to the next excercise
- Secret owners can't delete or update prices - we already make updates to block info so it doesn't seem necessary
- We could add the block link from receipt somewhere (https://testnet.nearblocks.io/txns/`{block}`)
- Not listening to events, so all non organic updates will require a refresh