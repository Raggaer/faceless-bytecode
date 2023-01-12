// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "hardhat/console.sol";

contract Faceless is ERC721Enumerable {
  struct color {
    uint8 r;
    uint8 g;
    uint8 b;
  }

  mapping(uint256 => color[8]) public colorData;

  address private _owner;
  address private _data;

  modifier onlyOwner() {
    require(msg.sender == _owner);
    _;
  }

  constructor(address _d) ERC721("Faceless", "FCLS") {
    _owner = msg.sender;
    _data = _d;
  }

  function mintBatch(uint8 total, bytes memory _colorData) public onlyOwner {
    unchecked {
      for(uint i = 0; i < total; i++) {
        uint256 tokenId = totalSupply();

        colorData[tokenId][0] = decodeColorData(i, _colorData);
        colorData[tokenId][1] = decodeColorData(i + 3, _colorData);
        colorData[tokenId][2] = decodeColorData(i + 6, _colorData);
        colorData[tokenId][3] = decodeColorData(i + 9, _colorData);
        colorData[tokenId][4] = decodeColorData(i + 12, _colorData);
        colorData[tokenId][5] = decodeColorData(i + 15, _colorData);
        colorData[tokenId][6] = decodeColorData(i + 18, _colorData);
        colorData[tokenId][7] = decodeColorData(i + 21, _colorData);

        _mint(msg.sender, tokenId);
      }  
    }
  }

  function tokenURI(uint256 _id) public view override returns (string memory) {
    bytes memory rect;

    unchecked {
      for(uint8 i = 0; i < 7; i++) {
        rect = abi.encodePacked(
          rect,
          "<rect ",
          retrieveSvgColor(_id, i + 1),
          retrieveSvgData(i)
        );
      }
    }

    return string(
      abi.encodePacked(
        "<?xml version='1.0' encoding='UTF-8' standalone='no'?>",
        "<svg width='600' height='600' viewBox='0 0 17 17' xmlns='http://www.w3.org/2000/svg' xmlns:svg='http://www.w3.org/2000/svg' ",
        retrieveSvgBackground(_id, 0),
        ">",
        "<g>",
        rect,
        "</g>",
        "</svg>"
      )
    );
  }

  function retrieveSvgBackground(uint256 _id, uint8 _i) private view returns (bytes memory) {
    color memory c = colorData[_id][_i];
    bytes memory r = abi.encodePacked(
      "style='background:rgb(",
      uint8ToString(c.r),
      ",",
      uint8ToString(c.g),
      ",",
      uint8ToString(c.b),
      ")' "
    ); 
    return r;
  }

  function retrieveSvgColor(uint256 _id, uint8 _i) private view returns (bytes memory) {
    color memory c = colorData[_id][_i];
    bytes memory r = abi.encodePacked(
      "fill='rgb(",
      uint8ToString(c.r),
      ",",
      uint8ToString(c.g),
      ",",
      uint8ToString(c.b),
      ")' "
    ); 
    return r;
  }

  function uint8ToString(uint8 _v) private pure returns (bytes memory) {
    bytes memory buff = new bytes(3);
    buff[2] = bytes1(48 + (_v % 10));
    _v /= 10;
    buff[1] = bytes1(48 + (_v % 10));
    _v /= 10;
    buff[0] = bytes1(48 + (_v % 10));
    return buff;
  }

  function retrieveSvgData(uint8 _i) private view returns (bytes memory) {
    bytes memory buff = bytes(_data.code);

    uint256 r = 2;
    uint8 total = uint8(buff[1]);

    unchecked {
      for(uint8 i = 0; i < total; i++) {
        uint8 len = uint8(buff[r]); 

        if(i == _i) {
          bytes memory ret = new bytes(len);
          for(uint8 x = 0; x < len; x++) {
            ret[x] = buff[r + 1 + x];
          }
          return ret;
        }
        r += 1 + len;
      }
    }
  }

  function decodeColorData(uint256 i, bytes memory _data) private view returns (color memory) {
    color memory c;
    c.r = uint8(_data[i]);
    c.g = uint8(_data[i + 1]);
    c.b = uint8(_data[i + 2]);
    return c;
  }
}
