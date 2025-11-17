import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../providers";

export function ThemeIndicator() {
  const { theme } = useTheme();
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    setShowIndicator(true);

    const timer = setTimeout(() => {
      setShowIndicator(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [theme]);

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-[1000] px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl backdrop-blur-xl border-2"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border-card)",
            color: "var(--text-secondary)",
          }}
          initial={{ opacity: 0, y: -20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.8 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <div className="flex items-center gap-2">
            {theme === "dark" ? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-purple-400"
              >
                <path
                  d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="currentColor"
                />
              </svg>
            ) : (
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-yellow-500"
              >
                <path
                  d="M10 3V1M10 19V17M17 10H19M1 10H3M15.657 4.343L17.071 2.929M2.929 17.071L4.343 15.657M15.657 15.657L17.071 17.071M2.929 2.929L4.343 4.343M14 10C14 12.2091 12.2091 14 10 14C7.79086 14 6 12.2091 6 10C6 7.79086 7.79086 6 10 6C12.2091 6 14 7.79086 14 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="currentColor"
                />
              </svg>
            )}
            <span className="text-xs sm:text-sm font-medium">
              {theme === "dark" ? "Dark" : "Light"} mode
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
