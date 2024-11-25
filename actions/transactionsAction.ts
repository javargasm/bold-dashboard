'use server'

import { Transaction } from "@models/transaction.model";

const API_BASE_URL = "https://bold-fe-api.vercel.app";

export const transactionsAction = async () => {
  const response = await fetch(`${API_BASE_URL}/api`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });
  const content = await response?.json();
  return content?.data as Transaction[];
};
