import { Aftermath } from "aftermath-ts-sdk";
import { Transaction } from "@mysten/sui/transactions";

type Network = "MAINNET" | "TESTNET";

export class StakingService {
  private aftermath: Aftermath | null = null;
  private initialized = false;
  private cachedValidatorAddress: string | null = null;

  async initialize(network: "MAINNET" | "TESTNET" = "MAINNET"): Promise<void> {
    if (this.initialized && this.aftermath) {
      return;
    }

    try {
      this.aftermath = new Aftermath(network);
      await this.aftermath.init();
      this.initialized = true;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to initialize Aftermath SDK: ${errorMessage}`);
    }
  }

  private async getValidatorAddress(): Promise<string> {
    if (this.cachedValidatorAddress) {
      return this.cachedValidatorAddress;
    }

    if (!this.aftermath || !this.initialized) {
      await this.initialize();
    }

    const staking = this.aftermath!.Staking();
    const validators = await staking.getActiveValidators();

    console.log("Active validators:", validators);

    if (validators.length === 0) {
      throw new Error("No active validators found");
    }

    const validator = validators[0];
    console.log("Selected validator:", validator);

    if (!validator.suiAddress) {
      throw new Error("Validator address is missing");
    }

    this.cachedValidatorAddress = validator.suiAddress;
    return this.cachedValidatorAddress;
  }

  async estimateAfSUI(amountInSUI: string): Promise<string> {
    if (!this.aftermath || !this.initialized) {
      await this.initialize();
    }

    const staking = this.aftermath!.Staking();
    const exchangeRate = await staking.getAfSuiToSuiExchangeRate();

    const amountInSui = parseFloat(amountInSUI);
    const estimatedAfSUI = amountInSui / exchangeRate;

    return estimatedAfSUI.toFixed(9);
  }

  async buildStakeTransaction(
    amountInSUI: string,
    senderAddress: string
  ): Promise<Transaction> {
    if (!this.aftermath || !this.initialized) {
      await this.initialize();
    }

    const staking = this.aftermath!.Staking();
    const amountInMist = BigInt(this.suiToMist(amountInSUI));

    if (amountInMist <= BigInt(0)) {
      throw new Error("Amount must be greater than 0");
    }

    const validatorAddress = await this.getValidatorAddress();

    if (!validatorAddress || validatorAddress.length === 0) {
      throw new Error("Invalid validator address");
    }

    try {
      console.log("Building stake transaction with:", {
        walletAddress: senderAddress,
        suiStakeAmount: amountInMist.toString(),
        amountInSUI,
        validatorAddress,
      });

      const txb = await staking.getStakeTransaction({
        walletAddress: senderAddress,
        suiStakeAmount: amountInMist,
        validatorAddress: validatorAddress,
      });

      console.log("Transaction built successfully:", txb);
      return txb;
    } catch (error) {
      console.error("Error building stake transaction:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to build stake transaction: ${errorMessage}`);
    }
  }

  private suiToMist(sui: string): string {
    const suiAmount = parseFloat(sui);
    if (isNaN(suiAmount)) {
      throw new Error("Invalid SUI amount");
    }
    return (suiAmount * 1e9).toString();
  }

  private mistToSui(mist: string): string {
    const mistAmount = BigInt(mist);
    const suiAmount = Number(mistAmount) / 1e9;
    return suiAmount.toFixed(9);
  }
}

export const stakingService = new StakingService();
