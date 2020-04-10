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
    this.hash = this.genHash();
  }

  public genHash() {
    return SHA256(
      this.index +
        this.previousHash +
        this.timestamp +
        JSON.stringify(this.data)
    ).toString();
  }
}

class Blockchain {
  private chain: Block[];

  public constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  private createGenesisBlock() {
    return new Block(0, new Date(), "Genesis block", "0");
  }

  public getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  public addBlock(block: Block) {
    block.previousHash = this.getLatestBlock().hash;
    block.hash = block.genHash();
    this.chain.push(block);
  }

  public isValid() {
    // We don't want to start with the
    // block 0, because that is the genesis
    // block.
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.genHash()) {
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

coin.addBlock(
  new Block(blockIndex, new Date(), {
    amount: 100,
    sender: "Marcelo Cardoso",
    receiver: "Cardoso Marcelo",
  })
);
coin.addBlock(
  new Block(blockIndex++, new Date(), {
    amount: 80,
    sender: "Cardoso Marcelo",
    receiver: "Marcelo Cardoso",
  })
);
coin.addBlock(
  new Block(blockIndex++, new Date(), {
    amount: 20,
    sender: "Cardoso Marcelo",
    receiver: "Marcelo Cardoso",
  })
);
