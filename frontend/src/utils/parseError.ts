// catch error 
const parseError = (error: any) => {
  console.log(error.code)
  console.log(error.message)
  const errorMessage = error.message as string
  switch (error.code) {
    case 'ACTION_REJECTED':
      return 'User denied transaction signature.'

    case 'UNPREDICTABLE_GAS_LIMIT':
      return 'Transaction may fail or may require manual gas limit.'

    case 'NUMERIC_FAULT':
      return `Too many decimals.`

    case 'INVALID_ARGUMENT':
      return 'The input value is invalid.'

    case 'UNEXPECTED_ARGUMENT':
      return 'Too many arguemnts: types/values length mismatch'

    case 'TRANSACTION_REPLACED':
      return 'The transaction has been replaced by others.'

    case 'INSUFFICIENT_FUNDS':
      return 'Please make sure your funds are sufficient.'

    case 'CALL_EXCEPTION':
      if (error.errorName === 'Panic') {
        return 'Unknown error. Please check your inputs. Maybe you don\'t have enough tokens.'
      }
      if (error.errorName === 'Error' && error.reason !== null) {
        return `The smart contract reject the transaction${error.reason ? `. ${error.reason}.` : '. Please check your input.'}`
      }
      if (error.errorName) {
        return `The smart contract reject the transaction because ${error.errorName}.`
      }

    case 'CUSTOM_ERROR':
      return errorMessage


    default:
      if (
        errorMessage.includes('Unauthorized') ||
        errorMessage.includes('Rate limit exceeded, retry in 2 hours')
      ) {
        return 'Network busy. Please try again later.'
      }

      // ArgentX exception when user reject transaction.
      if (errorMessage.includes('User abort')) {
        return 'User denied transaction signature.'
      }

      if (errorMessage.includes('No available quotes for the requested transfer')) {
        return `Single-coin deposit/withdrawal is currently unavailable. Try again with the Multi-coin option. If the issue persists, submit a ticket with Mr. T, who's in the lower right corner.`
      }

      if (
        errorMessage.includes('Unable to find a quote for the requested transfer')
      ) {
        return "Deposit/Withdrawal amount is too large. Consider splitting it into 2-3 transactions. If the issue persists, submit a ticket with Mr. T, who's in the lower right corner."
      }

      if (error.shortMessage) return `${error.shortMessage} ${error?.cause?.data?.errorName ?? ''}`
      if (errorMessage) return errorMessage
      return "Adjust the Slippage Tolerance and try again. If the issue persists, submit a ticket with Mr. T, who's in the lower right corner."
  }
}

export default parseError


export class CustomError extends Error {
  code: string
  constructor(message: string) {
    super(message)
    this.code = 'CUSTOM_ERROR'
  }
}