/** Vendors */
import { merge } from "lodash-es";

/** Types */
import type { IAnyObject } from "../types";

const useStorage = () => {
  const _formatResponse = (response) => {
    for (const key in response) {
      const sObj = new String(response[key]);
      response[key] = sObj.valueOf();
      console.log(sObj);
    }
    return response;
  };

  const clear = async () => {
    try {
      await localStorage.clear();
      return true;
    } catch (e) {
      return false;
    }
  };

  const getItem = async ({ key }: { key: string }) => {
    const value = await localStorage.getItem(`@:)${key}(:@`);

    const response =
      value !== null
        ? value.includes("{")
          ? JSON.parse(value)
          : value
        : false;

    if (typeof response === "string") {
      return response === "false"
        ? false
        : response === "true"
        ? true
        : response.replace(/[^\w\s]/gi, "");
    }
    return _formatResponse(response);
  };

  const mergeItem = async ({ key, value }: { key: string; value: any }) => {
    try {
      /** Step 1. Ensure key exists first. */
      const previous = await getItem({ key }).then(async (value) => {
        if (value !== "false") {
          return value;
        }
        await setItem({ key, value });
        return {};
      });

      /** Step 2. Merge Items. */
      await setItem({ key, value: merge(previous, value) });
    } catch (error) {
      console.log({ error });
    }
  };

  const removeItem = async ({ key }: { key: string }) => {
    try {
      await localStorage.removeItem(`@:)${key}(:@`);
    } catch (error) {
      console.log({ error });
    }
  };

  const setItem = async ({
    key,
    value,
  }: {
    key: string;
    value: IAnyObject;
  }) => {
    try {
      await localStorage.setItem(`@:)${key}(:@`, JSON.stringify(value));
    } catch (error) {
      console.log({ error });
    }
  };

  return {
    clear,
    getItem,
    mergeItem,
    removeItem,
    setItem,
  };
};

export default useStorage;
