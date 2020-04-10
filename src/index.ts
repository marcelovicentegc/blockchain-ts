import { Blockchain } from "./blockchain";
import { Transaction } from "./transaction";

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
