import { viewMethodOnContract, DEFAULT_FUNCTION_CALL_GAS } from '../utils/utils';

export const signIn = (nearConfig, walletConnection) => {
  walletConnection.requestSignIn(
    nearConfig.contractName,
    '', // title. Optional, by the way
    '', // successUrl. Optional, by the way
    '', // failureUrl. Optional, by the way
  );
};

export const signOut = (walletConnection) => {
  walletConnection.signOut();
  window.location.reload();
};

export const getData = async (nearConfig, currentUser) => {
  const allData = (await viewMethodOnContract(nearConfig, 'get_secrets', '{}')).map(value => JSON.parse(value));
  const ownData = currentUser && (await viewMethodOnContract(nearConfig, 'get_secrets_by_asker', `{"asker": "${currentUser}"}`)).map(value => JSON.parse(value).id) || []
  let data = [];

  if (allData) {
    data = allData
      .reverse()
      .map(secret => ({
        ...secret,
        visible: ownData.includes(secret.id),
        owned: secret.owner === currentUser,
        price: parseFloat(secret.price / 100000)
      }));
    return data
  } else {
    console.log("Oof, there aren't any secrets.");
  }
  return data;
}

export const postSecret = async (nearConfig, walletConnection, { title, content, price }) => {
  try {
    let functionCallResult = await walletConnection.account().functionCall({
      contractId: nearConfig.contractName,
      methodName: 'store_secret',
      args: { title, content, price },
      gas: DEFAULT_FUNCTION_CALL_GAS, // optional param, by the way
      attachedDeposit: 0,
      walletMeta: '', // optional param, by the way
      walletCallbackUrl: '' // optional param, by the way
    });
    if (functionCallResult && functionCallResult.transaction && functionCallResult.transaction.hash) {
      console.log('Transaction hash for explorer', functionCallResult.transaction.hash)
    }
  } catch (e) {
    console.log('Something went wrong!', e);
  } finally {
    return true;
  }
}

export const getSecretContent = async (nearConfig, currentUser, id) => {
  const secretData = (await viewMethodOnContract(nearConfig, 'get_secret_by_asker_by_id', `{"asker": "${currentUser}", "_key":"${id}"}`));
  if (secretData) {
    return secretData
  } else {
    console.log("Oof, looks like you don't have access.");
  }
}

export const buySecretContent = async (nearConfig, walletConnection, id, price) => {
  try {
    let functionCallResult = await walletConnection.account().functionCall({
      contractId: nearConfig.contractName,
      methodName: 'buy_secret',
      args: { _key: String(id) },
      gas: DEFAULT_FUNCTION_CALL_GAS, // optional param, by the way
      attachedDeposit: `${Math.round(price * 100000)}0000000000000000000`,
      walletMeta: '', // optional param, by the way
      walletCallbackUrl: '' // optional param, by the way
    });
    if (functionCallResult && functionCallResult.transaction && functionCallResult.transaction.hash) {
      console.log('Transaction hash for explorer', functionCallResult.transaction.hash)
    }
  } catch (e) {
    console.log('Something went wrong!', e);
  } finally {
    return true;
  }
}
