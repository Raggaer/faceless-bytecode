pragma solidity ^0.8.4;

contract SimpleSVG {
  function getSvg(address _addr) public view returns (string memory) {
    bytes memory c = _addr.code;

    // Cast bytes to string
    return string(c);
  }
}
