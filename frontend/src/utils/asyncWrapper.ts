
import React from "react";
import parseError from "./parseError";
import toast from "react-hot-toast";

type Options = {
  name: string,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  asyncFn: () => Promise<any>,
  onFinish?: () => void
  onError?: (e: any) => void
  onSuccess?: () => void
  shouldToast?: boolean
}

type AsyncWrapper = (arg: Options) => Promise<void>

export const asyncWrapper: AsyncWrapper = async ({ name, setIsLoading, asyncFn, onFinish, onSuccess, onError, shouldToast }) => {
  setIsLoading(true)
  try {
    const result = await asyncFn()
    onSuccess?.()
    return result
  } catch (e) {
    console.log(name + ' error, ', e)
    onError?.(e)
    shouldToast && toast.error(parseError(e))
  } finally {
    onFinish?.()
    setTimeout(() => {
      setIsLoading(false)
    }, 300);
  }
}