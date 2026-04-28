export const CONTRACT_ADDRESS = {
  localhost: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  sepolia: "0x0000000000000000000000000000000000000000",
}

export const NETWORK_NAMES = {
  1337: "localhost",
  11155111: "sepolia",
}

export function getContractAddress(chainId) {
  const network = NETWORK_NAMES[chainId]
  if (!network) return null
  return CONTRACT_ADDRESS[network] || null
}
