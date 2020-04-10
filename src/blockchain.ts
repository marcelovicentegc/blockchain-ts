import { BlockchainInterface } from "./types";
import { Transaction } from "./transaction";
import { Block } from "./block";

export class Blockchain implements BlockchainInterface {
  private chain: Block[];
  private difficulty: number;
  public pendingTransactions: Transaction[];
  public miningReward: number;

  public constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 10;
  }

  private createGenesisBlock() {
    return new Block(new Date(), "Genesis block", "0");
  }

  public getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  public minePendingTransactions(miningRewardAddress: string) {
    let block = new Block(new Date(), this.pendingTransactions);
    block.mine(this.difficulty);
    console.log("Block successfully mined!");
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningReward),
    ];
  }

  public createTransaction(transaction: Transaction) {
    this.pendingTransactions.push(transaction);
  }

  public getBalance(address: string) {
    let balance = 0;

    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if ((transaction as Transaction).from === address) {
          balance -= (transaction as Transaction).amount;
        }

        if ((transaction as Transaction).to === address) {
          balance += (transaction as Transaction).amount;
        }
      }
    }

    return balance;
  }

  public isValid() {
    // We don't want to start with the
    // block 0, because that is the genesis
    // block.
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }

    return true;
  }
}
