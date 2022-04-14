import { Execute, paths } from '../types'
import { Signer } from 'ethers'
import { executeSteps, setParams } from '../utils'

type Data = {
  token: string | undefined
  signer: Signer | undefined
  apiBase: string | undefined
  setState: (steps: Execute['steps']) => any
  handleError?: (err: any) => any
  handleSuccess?: () => any
}

/**
 * Accept an offer to buy your token
 * @param data
 */
export async function acceptOffer(data: Data) {
  const { token, signer, apiBase, setState, handleSuccess, handleError } = data

  if (!token || !signer || !apiBase) {
    console.debug(data)
    throw new ReferenceError('Some data is missing')
  }

  try {
    // Construct an URL object for the `/execute/sell/v1` endpoint
    const url = new URL('/execute/sell/v1', apiBase)

    // Construct the query object to execute the trade
    const query: paths['/execute/sell/v1']['get']['parameters']['query'] = {
      token,
      taker: await signer.getAddress(),
    }

    setParams(url, query)

    await executeSteps(url, signer, setState)

    if (handleSuccess) handleSuccess()
  } catch (err: any) {
    if (handleError) handleError(err)
    console.error(err)
  }
}