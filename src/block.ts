import { SHA256 } from "crypto-js";
import { BlockInterface } from "./types";
import { Transaction } from "./transaction";

export class Block implements BlockInterface {
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
