export function addBalance(balance: string, amount: number) {
  const balanceAsNumber = Number(balance);

  if (amount < 0 || balanceAsNumber < 0) throw new Error("Invalid operation");

  const result = Number(balance) + amount;

  if (!result) throw new Error("Invalid operation");

  return String(result.toFixed(2));
}
