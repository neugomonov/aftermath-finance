import { useSuiClient, useCurrentAccount } from "@mysten/dapp-kit";
import { useQuery } from "@tanstack/react-query";
import { formatSUI } from "shared/lib/format";

export function useWalletBalance() {
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();

  const {
    data: balance,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["wallet-balance", currentAccount?.address],
    queryFn: async () => {
      if (!currentAccount) {
        return null;
      }

      const coins = await client.getCoins({
        owner: currentAccount.address,
        coinType: "0x2::sui::SUI",
      });

      const totalBalance = coins.data.reduce(
        (sum, coin) => sum + BigInt(coin.balance),
        BigInt(0)
      );

      return {
        raw: totalBalance.toString(),
        formatted: formatSUI(Number(totalBalance) / 1e9),
        mist: totalBalance,
      };
    },
    enabled: !!currentAccount,
    refetchInterval: 10000,
  });

  return {
    balance,
    isLoading,
    error,
    formattedBalance: balance?.formatted || "0",
    rawBalance: balance?.raw || "0",
  };
}
