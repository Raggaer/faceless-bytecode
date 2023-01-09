pragma solidity ^0.8.4;

// Contract used only for testing and comparing gas usage
contract SimpleSVG {
  function getSvg(address _addr) public view returns (string memory) {
    bytes memory c = _addr.code;

    // Cast bytes to string
    return string(c);
  }
}
