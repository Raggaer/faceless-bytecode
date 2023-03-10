const { expect } = require("chai");
const { ethers } = require("hardhat");

const bytecode =
  "0x61027a600f60003961027a6000f3003c3f786d6c2076657273696f6e3d22312e302220656e636f64696e673d225554462d3822207374616e64616c6f6e653d226e6f223f3e3c7376672077696474683d2236303022206865696768743d22363030222076696577426f783d22302030203137203137222076657273696f6e3d22312e312220786d6c6e733d22687474703a2f2f7777772e77332e6f72672f323030302f737667223e3c673e3c72656374207374796c653d2266696c6c3a23303030303030222069643d2272656374333134222077696474683d223122206865696768743d2231372220783d22302220793d2230222f3e3c72656374207374796c653d2266696c6c3a233030303030303b222069643d2272656374333136222077696474683d22313722206865696768743d22312220783d22302220793d2230222f3e3c72656374207374796c653d2266696c6c3a233030303030303b222077696474683d223122206865696768743d2231372220783d2231362220793d2230222f3e3c72656374207374796c653d2266696c6c3a233030303030303b222077696474683d22313722206865696768743d22312220783d22302220793d223136222f3e3c72656374207374796c653d2266696c6c3a233030303030303b222077696474683d223322206865696768743d22342220783d22322220793d2232222f3e3c72656374207374796c653d2266696c6c3a233030303030303b222077696474683d22313322206865696768743d22312220783d22322220793d223130222f3e3c72656374207374796c653d2266696c6c3a233030303030303b222077696474683d223322206865696768743d22342220783d2231322220793d2232222f3e3c2f673e3c2f7376673e";
const svgString = `<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg width="600" height="600" viewBox="0 0 17 17" version="1.1" xmlns="http://www.w3.org/2000/svg"><g><rect style="fill:#000000" id="rect314" width="1" height="17" x="0" y="0"/><rect style="fill:#000000;" id="rect316" width="17" height="1" x="0" y="0"/><rect style="fill:#000000;" width="1" height="17" x="16" y="0"/><rect style="fill:#000000;" width="17" height="1" x="0" y="16"/><rect style="fill:#000000;" width="3" height="4" x="2" y="2"/><rect style="fill:#000000;" width="13" height="1" x="2" y="10"/><rect style="fill:#000000;" width="3" height="4" x="12" y="2"/></g></svg>`;

describe("Simple SVG", function () {
  it("Deploy svg data on contract bytecode", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const provider = owner.provider;

    // PUSH2 hex_length
    // PUSH1 code offset
    // PUSH1 0
    // CODECOPY
    // PUSH2 hex_length
    // PUSH 0
    // RETURN
    // HEX DATA
    const t = await owner.sendTransaction({
      data: bytecode,
    });
    const receipt = await t.wait();

    const simpleSvgFactory = await ethers.getContractFactory("SimpleSVG");
    const s = await simpleSvgFactory.deploy();
    const svg = await s.getSvg(receipt.contractAddress);

    // Check valid SVG image
    expect(svg.length).to.equal(634);
    expect(svg).to.equal(svgString);
  });

  it("Compare gas usage", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const provider = owner.provider;

    const simpleSvgFactoryData = await ethers.getContractFactory(
      "SimpleSVGData"
    );
    const s = await simpleSvgFactoryData.deploy();
    const svg = await s.getSvg();
    const receipt1 = await s.deployTransaction.wait();

    const t = await owner.sendTransaction({
      data: bytecode,
    });
    const receipt2 = await t.wait();

    expect(receipt1.gasUsed).to.above(receipt2.gasUsed);
  });
});
