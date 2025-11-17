import { useState, useRef } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { motion, AnimatePresence } from "framer-motion";
import { formatSUI } from "shared/lib/format";
import { EstimateSkeleton, Spacer } from "shared/ui";
import { useWalletBalance } from "entities/wallet";
import { useTransactionHistory } from "entities/transaction";
import {
  useStakeTransaction,
  useStakeForm,
  useEstimate,
} from "features/stake-form";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as const,
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 15,
    },
  },
};

export function StakePage() {
  const currentAccount = useCurrentAccount();
  const {
    balance,
    isLoading: isLoadingBalance,
    formattedBalance,
  } = useWalletBalance();
  const { transactions, addTransaction, updateTransaction } =
    useTransactionHistory();

  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    amountIn,
    handleInputChange,
    handleMaxClick,
    clearAmount,
    isValidInput,
  } = useStakeForm({
    balance,
    onValidationError: setValidationError,
  });

  const { estimatedAfSUI, isLoadingEstimate, estimateError } = useEstimate({
    amount: amountIn,
    balance,
  });

  const { executeStake, isExecuting } = useStakeTransaction({
    balance,
    onTransactionAdd: addTransaction,
    onTransactionUpdate: updateTransaction,
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const onStakeClick = async () => {
    const success = await executeStake(amountIn);
    if (success) {
      clearAmount();
    }
  };

  const displayError = validationError || estimateError;
  const isLoading = isLoadingEstimate || isExecuting;

  return (
    <motion.div
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="card stake-page-card" variants={itemVariants}>
        <div>
          {currentAccount && (
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm text-gray-300 font-medium">
                Available Balance:
              </span>
              <span className="text-base sm:text-xl font-bold gradient-text">
                {isLoadingBalance ? (
                  <span className="inline-block w-16 sm:w-24 h-5 sm:h-6 bg-slate-700/50 rounded animate-pulse" />
                ) : (
                  `${formattedBalance} SUI`
                )}
              </span>
            </div>
          )}

          <Spacer height={20} />

          <motion.div variants={itemVariants}>
            <label
              htmlFor="amount-input"
              className="block text-xs sm:text-sm font-semibold text-gray-200"
            >
              Amount In (SUI)
            </label>
            <Spacer height={8} />
            <div
              className={`flex items-center input-field overflow-hidden ${
                displayError ? "border-red-500/50" : ""
              } ${!currentAccount || isExecuting ? "opacity-50" : ""}`}
              onClick={() => inputRef.current?.focus()}
            >
              <motion.input
                ref={inputRef}
                id="amount-input"
                type="text"
                value={amountIn}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="1"
                disabled={!currentAccount || isExecuting}
                className={`flex-1 bg-transparent border-none outline-none focus:ring-0 focus:outline-none min-w-0 pr-2 ${
                  !currentAccount || isExecuting ? "cursor-not-allowed" : ""
                }`}
                aria-invalid={!!displayError}
                aria-describedby={displayError ? "error-message" : undefined}
                whileFocus={{ scale: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.button
                type="button"
                onClick={handleMaxClick}
                disabled={!currentAccount || isExecuting || isLoadingBalance}
                className="btn-secondary flex-shrink-0 mr-2"
                whileHover={
                  !currentAccount || isExecuting || isLoadingBalance
                    ? {}
                    : { scale: 1.05 }
                }
                whileTap={
                  !currentAccount || isExecuting || isLoadingBalance
                    ? {}
                    : { scale: 0.95 }
                }
              >
                MAX
              </motion.button>
            </div>
            <AnimatePresence>
              {displayError && (
                <>
                  <Spacer height={8} />
                  <motion.p
                    id="error-message"
                    className="text-xs sm:text-sm text-red-400 font-medium"
                    role="alert"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {displayError}
                  </motion.p>
                </>
              )}
            </AnimatePresence>
          </motion.div>

          <Spacer height={20} />

          <AnimatePresence mode="wait">
            {isLoadingEstimate && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EstimateSkeleton />
              </motion.div>
            )}

            {estimatedAfSUI && !isLoadingEstimate && (
              <motion.div
                key="estimate"
                className="p-4 sm:p-6 bg-gradient-to-br from-teal-400/20 via-cyan-400/20 to-emerald-400/20 rounded-lg sm:rounded-xl backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <div className="text-xs sm:text-sm text-gray-300 font-medium">
                  Estimated afSUI to receive:
                </div>
                <Spacer height={8} />
                <motion.div
                  className="text-2xl sm:text-3xl font-bold gradient-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {formatSUI(estimatedAfSUI)} afSUI
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <Spacer height={20} />

          <motion.button
            onClick={onStakeClick}
            disabled={!isValidInput || isLoading}
            className="btn-primary w-full"
            whileHover={!isValidInput || isLoading ? {} : { scale: 1.02 }}
            whileTap={!isValidInput || isLoading ? {} : { scale: 0.98 }}
          >
            {isExecuting ? (
              <span className="flex items-center justify-center">
                <motion.svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  style={{
                    width: 24,
                    height: 24,
                  }}
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </motion.svg>
                Staking...
              </span>
            ) : (
              "Stake"
            )}
          </motion.button>

          <Spacer height={20} />

          <AnimatePresence>
            {!currentAccount && (
              <motion.div
                className="status-card-warning"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className="text-xs sm:text-sm text-yellow-300 text-center font-medium">
                  Please connect your wallet to stake
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {transactions.length > 0 && (
        <>
          <Spacer height={20} />
          <motion.div className="card" variants={itemVariants}>
            <h2 className="text-lg sm:text-xl font-bold gradient-text">
              Recent Transactions
            </h2>
            <Spacer height={20} />
            <div>
              <AnimatePresence>
                {transactions.slice(0, 5).map((tx) => (
                  <motion.div
                    key={tx.id}
                    className="flex items-center justify-between p-3 sm:p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg sm:rounded-xl backdrop-blur-sm hover:border-purple-500/30 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-semibold text-gray-100 truncate">
                        Staked {formatSUI(tx.amount)} SUI
                      </div>
                      <div className="text-[10px] sm:text-xs text-gray-400">
                        {new Date(tx.timestamp).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                      {tx.status === "pending" && (
                        <motion.div
                          className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50"
                          animate={{ opacity: [1, 0.5, 1], scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                      )}
                      {tx.status === "success" && (
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-green-400 rounded-full shadow-lg shadow-green-400/50" />
                      )}
                      {tx.status === "failed" && (
                        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-red-400 rounded-full shadow-lg shadow-red-400/50" />
                      )}
                      <span
                        className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider ${
                          tx.status === "pending"
                            ? "text-yellow-400"
                            : tx.status === "success"
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
