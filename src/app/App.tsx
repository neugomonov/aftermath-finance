import { motion, useScroll, useSpring } from "framer-motion";
import { WalletConnection } from "widgets/wallet-connection";
import { StakePage } from "pages/stake";
import { ThemeIndicator } from "./components/ThemeIndicator";

export default function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="app-container">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-500 origin-left z-[2000]"
        style={{ scaleX }}
      />

      <ThemeIndicator />

      <motion.div
        className="container-main app-content"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="gap-app flex flex-col">
          <WalletConnection />
          <StakePage />
        </div>
      </motion.div>
    </div>
  );
}
