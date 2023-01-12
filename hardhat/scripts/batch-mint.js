const hre = require("hardhat");
const mintsPerBatch = 25;
const bytecode =
  "0x610100600f6000396101006000f300f7072377696474683d223122206865696768743d2231372220783d22302220793d2230222f3e2377696474683d22313722206865696768743d22312220783d22302220793d2230222f3e2477696474683d223122206865696768743d2231372220783d2231362220793d2230222f3e2477696474683d22313722206865696768743d22312220783d22302220793d223136222f3e2277696474683d223322206865696768743d22342220783d22322220793d2232222f3e2477696474683d22313322206865696768743d22312220783d22322220793d223130222f3e2377696474683d223322206865696768743d22342220783d2231322220793d2232222f3e";
const batches = 1;

async function main() {
  const [owner, addr1] = await ethers.getSigners();
  const provider = owner.provider;

  const bytecodeDeployed = await owner.sendTransaction({
    data: bytecode,
  });

  const factory = await ethers.getContractFactory("Faceless");
  const s = await factory.deploy(bytecodeDeployed.creates);

  const mint = await s.mintBatch(
    mintsPerBatch,
    generateColorData(mintsPerBatch)
  );
  const svg = await s.tokenURI(24);
  console.log(svg);
}

function generateColorData(total) {
  // Generate random colors for each part of the svg
  const buff = Buffer.alloc(24 * total);
  let i = 0;
  for (let x = 0; x < total; x++) {
    writeRandomColor(buff, i);
    writeRandomColor(buff, i + 3);
    writeRandomColor(buff, i + 6);
    writeRandomColor(buff, i + 9);
    writeRandomColor(buff, i + 12);
    writeRandomColor(buff, i + 15);
    writeRandomColor(buff, i + 18);
    writeRandomColor(buff, i + 21);
    i += 24;
  }

  // Batch mint
  return "0x" + buff.toString("hex");
}

function writeRandomColor(buff, i) {
  const [r, g, b] = getRandomColor();
  buff.writeUint8(r, i);
  buff.writeUint8(g, i + 1);
  buff.writeUint8(b, i + 2);
}

function getRandomColor() {
  return [rand(), rand(), rand()];
}

function rand() {
  return Math.floor(Math.random() * (255 - 0 + 1));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
