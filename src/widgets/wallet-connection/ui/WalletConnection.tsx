import {
  ConnectButton,
  useCurrentAccount,
  useWallets,
  useDisconnectWallet,
} from "@mysten/dapp-kit";
import { motion, AnimatePresence } from "framer-motion";
import { truncateAddress } from "shared/lib/format";
import { Spacer } from "shared/ui";

const containerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -10, scale: 0.95 },
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

export function WalletConnection() {
  const currentAccount = useCurrentAccount();
  const wallets = useWallets();
  const { mutate: disconnect } = useDisconnectWallet();

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <motion.div
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between"
        variants={itemVariants}
      >
        <motion.h1
          className="text-responsive-xl gradient-text"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          Stake SUI → afSUI
        </motion.h1>
        <motion.div
          className="w-full sm:w-auto flex gap-2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          {!currentAccount && (
            <div className="connect-button-wrapper">
              <ConnectButton />
            </div>
          )}
          {currentAccount && (
            <>
              <motion.button
                onClick={() => disconnect()}
                className="btn-secondary px-4 py-2 text-sm font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Disconnect
              </motion.button>
            </>
          )}
        </motion.div>
      </motion.div>

      <Spacer height={16} />

      <AnimatePresence mode="wait">
        {currentAccount && (
          <motion.div
            className="status-card-success"
            variants={itemVariants}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <div className="flex items-center">
              <motion.div
                className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full neon-glow-green flex-shrink-0"
                style={{ marginRight: "8px" }}
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <span className="text-xs sm:text-sm font-semibold text-green-300 truncate">
                Connected:{" "}
                <span className="text-green-200 font-mono">
                  {truncateAddress(currentAccount.address)}
                </span>
              </span>
            </div>
          </motion.div>
        )}

        {!currentAccount && wallets.length === 0 && (
          <motion.div
            className="status-card-warning"
            variants={itemVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-xs sm:text-sm text-yellow-300">
              <strong className="text-yellow-200">No wallets detected.</strong>{" "}
              Please install a Sui wallet extension to connect.
            </p>
          </motion.div>
        )}

        {!currentAccount && wallets.length > 0 && (
          <motion.div
            className="status-card-info"
            variants={itemVariants}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-xs sm:text-sm text-blue-300">
              <strong className="text-blue-200">Wallets detected:</strong>{" "}
              {wallets.map((w) => w.name).join(", ")}. Click Connect above.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <Spacer height={32} />
    </motion.div>
  );
}
