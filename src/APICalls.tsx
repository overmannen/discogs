import { API_BASE_URL } from "./config";
import type { LpType } from "./LP";

type CollectionResponse = {
  lps: LpType[];
  collectionValue: string;
};

export const getCollection = async (): Promise<CollectionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/collection/`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    if (result.status === "error") {
      throw new Error(result.message);
    }

    const { collection, value } = result.data;
    const lps: LpType[] = [];

    collection.forEach((lp: LpType) => {
      lps.push(lp);
    });
    return { lps: lps, collectionValue: value };
  } catch (error) {
    console.error(error);
    throw error;
  }
};
