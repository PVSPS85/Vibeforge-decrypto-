import { useState, useCallback } from 'react'
import { ethers } from 'ethers'
import { useWeb3 } from '../context/Web3Context'
import { CONTRACT_ABI } from '../constants/contractABI'
import { getContractAddress } from '../constants/contractAddress'

export function useContract() {
  const { signer, provider } = useWeb3()
  const [loading, setLoading] = useState(false)
  const [txHash, setTxHash] = useState(null)
  const [txError, setTxError] = useState(null)

  const getContract = useCallback(async () => {
    if (!signer && !provider) return null
    const network = await (signer || provider).provider?.getNetwork()
    const chainId = network ? Number(network.chainId) : 1337
    const address = getContractAddress(chainId)
    if (!address) return null
    return new ethers.Contract(address, CONTRACT_ABI, signer || provider)
  }, [signer, provider])

  const createGroup = useCallback(async (groupName, memberAddresses) => {
    setLoading(true)
    setTxError(null)
    try {
      const contract = await getContract()
      if (!contract) throw new Error('Contract not found')
      const tx = await contract.createGroup(groupName, memberAddresses)
      setTxHash(tx.hash)
      await tx.wait()
      return tx.hash
    } catch (err) {
      setTxError(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [getContract])

  const addExpense = useCallback(async (groupId, description, amountInWei, splitAmong) => {
    setLoading(true)
    setTxError(null)
    try {
      const contract = await getContract()
      if (!contract) throw new Error('Contract not found')
      const tx = await contract.addExpense(groupId, description, amountInWei, splitAmong)
      setTxHash(tx.hash)
      await tx.wait()
      return tx.hash
    } catch (err) {
      setTxError(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [getContract])

  const settleDebt = useCallback(async (groupId, toAddress, amountInWei) => {
    setLoading(true)
    setTxError(null)
    try {
      const contract = await getContract()
      if (!contract) throw new Error('Contract not found')
      const tx = await contract.settleDebt(groupId, toAddress, { value: amountInWei })
      setTxHash(tx.hash)
      await tx.wait()
      return tx.hash
    } catch (err) {
      setTxError(err.message)
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [getContract])

  return {
    loading,
    txHash,
    txError,
    createGroup,
    addExpense,
    settleDebt,
  }
}
