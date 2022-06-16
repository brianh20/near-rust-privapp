use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::UnorderedMap;
use near_sdk::{env, near_bindgen, AccountId, PanicOnDefault, Promise};
use serde_json::json;

near_sdk::setup_alloc!();

#[near_bindgen]
#[derive(BorshDeserialize, BorshSerialize, PanicOnDefault)]
pub struct Contract {
    contract_owner: AccountId,
    secrets: UnorderedMap<usize, Secret>,
    count: usize,
}

#[derive(BorshDeserialize, BorshSerialize, Debug)]
pub struct Secret {
    owner: AccountId,
    viewers: Vec<AccountId>,
    title: String,
    content: String,
    price: u32,
}

#[near_bindgen]
impl Contract {
    #[init]
    pub fn new() -> Self {
        let log_message = format!("Contract initialized");
        env::log(log_message.as_bytes());

        Self {
            contract_owner: env::predecessor_account_id(),
            count: 0,
            secrets: UnorderedMap::new(b"s".to_vec()),
        }
    }

    pub fn get_contract_owner(self) -> AccountId {
        let log_message = format!("Contract owner {}", self.contract_owner);
        env::log(log_message.as_bytes());

        self.contract_owner
    }

    pub fn get_count(self) -> usize {
        let log_message = format!("Quantity of secrets {}", self.count);
        env::log(log_message.as_bytes());

        self.count
    }

    pub fn get_transaction_details(self) {
        let mut log_message = format!("signer Account Id:: {}", env::signer_account_id());
        env::log(log_message.as_bytes());

        log_message = format!("predecessor Account Id:: {}", env::predecessor_account_id());
        env::log(log_message.as_bytes());

        log_message = format!("account balance:: {}", env::account_balance());
        env::log(log_message.as_bytes());

        log_message = format!("attached deposit:: {}", env::attached_deposit());
        env::log(log_message.as_bytes());
    }

    pub fn get_secrets(&self) -> Vec<String> {
        let mut secrets = vec![];
        for (index, value) in self.secrets.to_vec().iter() {
            let secret = json!({
                "id": index,
                "owner": value.owner,
                "price": value.price,
                "title": value.title
            });
            secrets.push(secret.to_string());
        }
        secrets
    }

    pub fn get_secrets_by_asker(&self, asker: AccountId) -> Vec<String> {
        let mut secrets = vec![];
        for (index, value) in self.secrets.to_vec().iter() {
            if &value.owner == &asker || value.viewers.contains(&asker) {
                let secret = json!({
                    "id": index,
                });
                secrets.push(secret.to_string());
            }
        }
        secrets
    }

    pub fn store_secret(&mut self, title: String, content: String, price: u32) {
        let secret_owner = env::signer_account_id();

        self.secrets.insert(
            &self.count,
            &Secret {
                owner: secret_owner,
                viewers: vec![],
                title,
                content,
                price, // includes 5 decimals so 100000(0000000000000000000)
            },
        );
        self.count += 1;
        env::log(b"Secret stored correctly.");
    }

    pub fn get_secret_by_asker_by_id(&self, asker: AccountId, _key: String) -> String {
        let key = _key.parse::<usize>().unwrap();
        let secret = self.secrets.get(&key).unwrap();
        if &secret.owner == &asker || secret.viewers.contains(&asker) {
            secret.content
        } else {
            String::from("Content forbidden")
        }
    }

    // check payable
    #[payable]
    pub fn buy_secret(&mut self, _key: String) {
        let buyer = env::signer_account_id();
        let key = _key.parse::<usize>().unwrap();

        let mut secret = self.secrets.get(&key).unwrap();
        if secret.owner == buyer {
            env::panic(b"Buyer is same as owner.");
        } else {
            if !secret.viewers.contains(&buyer) {
                let price = secret.price as u128 * 10000000000000000000;
                if price == env::attached_deposit() {
                    secret.viewers.push(buyer);
                    Promise::new(secret.owner.to_string()).transfer(near_sdk::env::attached_deposit());
                    env::log(b"Buyer purchase went through correctly.");
                    self.secrets.insert(&key, &secret);
                } else {
                    env::panic(format!(
                        "Buyer has sent incorrect price. Attached {} Price is {}",
                        env::attached_deposit(),
                        secret.price as u128 * 10000000000000000000
                    ).as_bytes());
                }
            } else {
                env::panic(b"Buyer has already bought this secret.");
            }
        }
    }

    // deprecate
    pub fn clear_secrets(&mut self) {
        if env::signer_account_id() == self.contract_owner {
            self.secrets = UnorderedMap::new(b"s".to_vec());
        }
    }
}
