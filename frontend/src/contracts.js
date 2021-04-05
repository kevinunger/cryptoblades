import abi from '../../build/ABI.json';
import { abi as cryptoBladesAbi } from '../../build/contracts/CryptoBlades.json';
import { abi as charactersAbi } from '../../build/contracts/Characters.json';
import { abi as weaponsAbi } from '../../build/contracts/Weapons.json';

export { abi };

function createContracts(web3) {
  const at = abi => addr => new web3.eth.Contract(abi, addr);

  const CryptoBlades = new web3.eth.Contract(cryptoBladesAbi, process.env.VUE_APP_CRYPTOBLADES_CONTRACT_ADDRESS);

  const Characters = { at: at(charactersAbi) };
  const Weapons = { at: at(weaponsAbi) };

  return { CryptoBlades, Characters, Weapons };
}

export async function setUpContracts(web3) {
  const contracts = createContracts(web3);

  const CryptoBlades = contracts.CryptoBlades;
  const [charactersAddr, weaponsAddr] = await Promise.all([
    contracts.CryptoBlades.methods.getCharactersAddress().call(),
    contracts.CryptoBlades.methods.getWeaponsAddress().call(),
  ]);
  const Characters = contracts.Characters.at(charactersAddr);
  const Weapons = contracts.Weapons.at(weaponsAddr);

  return { CryptoBlades, Characters, Weapons };
}