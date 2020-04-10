import { TransactionInterface } from "./types";

export class Transaction implements TransactionInterface {
  public from: string | null;
  public to: string;
  public amount: number;

  public constructor(from: string | null, to: string, amount: number) {
    this.from = from;
    this.to = to;
    this.amount = amount;
  }
}
