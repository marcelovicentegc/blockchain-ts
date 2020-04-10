import { SHA256 } from "crypto-js";
import {
  TransactionInterface,
  BlockInterface,
  BlockchainInterface,
} from "./types";

class Transaction implements TransactionInterface {
  public from: string | null;
  public to: string;
  public amount: number;

  public constructor(from: string | null, to: string, amount: number) {
    this.from = from;
    this.to = to;
    this.amount = amount;
  }
}

class Block implements BlockInterface {
  private timestamp: Date;
  private nonce: number;
  public transactions: Transaction[] | string;
  public previousHash: string;
  public hash: string;

  public constructor(
    timestamp: Date,
    transactions: Transaction[] | string,
    previousHash = ""
  ) {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  public calculateHash() {
    return SHA256(
      this.previousHash +
        this.timestamp +
        this.nonce +
        JSON.stringify(this.transactions)
    ).toString();
  }

  public mine(difficulty: number) {
    while (
      this.hash.substr(0, difficulty) !== Array(difficulty + 1).join("0")
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log("Block mined: ", this.hash);
  }
}

class Blockchain implements BlockchainInterface {
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

const coin = new Blockchain();

// Client
coin.createTransaction(new Transaction("maria-addr", "john-addr", 100));
coin.createTransaction(new Transaction("john-addr", "maria-addr", 80));
coin.createTransaction(new Transaction("maria-addr", "john-addr", 25));

console.log("\nStarting the miner...");
coin.minePendingTransactions("pedro-addr");

console.log("\nPedro's balance: ", coin.getBalance("pedro-addr"));
console.log("\nMaria's balance: ", coin.getBalance("maria-addr"));
console.log("\nJohn's balance: ", coin.getBalance("john-addr"));

console.log("\nStarting the miner again...");
coin.minePendingTransactions("pedro-addr");

console.log("\nPedro's balance: ", coin.getBalance("pedro-addr"));
