const ipfsConvert = (tokenURL) => {
  let target = tokenURL?.includes("ipfs")
    ? tokenURL.replace("ipfs://", "https://ipfs.io/ipfs/")
    : tokenURL;
  return target;
};

module.exports = ipfsConvert;
