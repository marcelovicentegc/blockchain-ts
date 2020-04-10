import { SHA256 } from "crypto-js";

interface Data {
  receiver: string;
  sender: string;
  amount: number;
}

class Block {
  private index: number;
  private timestamp: Date;
  private data: Data | string;
  private nonce: number;
  public previousHash: string;
  public hash: string;

  public constructor(
    index: number,
    timestamp: Date,
    data: Data | string,
    previousHash = ""
  ) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  public calculateHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        this.nonce +
        JSON.stringify(this.data)
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

class Blockchain {
  private chain: Block[];
  private difficulty: number;

  public constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  private createGenesisBlock() {
    return new Block(0, new Date(), "Genesis block", "0");
  }

  public getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  public addBlock(block: Block) {
    block.previousHash = this.getLatestBlock().hash;
    block.mine(this.difficulty);
    this.chain.push(block);
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
let blockIndex = 1;

console.log(`Mining block ${blockIndex}`);
coin.addBlock(
  new Block(blockIndex, new Date(), {
    amount: 100,
    sender: "Marcelo Cardoso",
    receiver: "Cardoso Marcelo",
  })
);

console.log(`Mining block ${blockIndex}`);
coin.addBlock(
  new Block(blockIndex++, new Date(), {
    amount: 80,
    sender: "Cardoso Marcelo",
    receiver: "Marcelo Cardoso",
  })
);

console.log(`Mining block ${blockIndex}`);
coin.addBlock(
  new Block(blockIndex++, new Date(), {
    amount: 20,
    sender: "Cardoso Marcelo",
    receiver: "Marcelo Cardoso",
  })
);
