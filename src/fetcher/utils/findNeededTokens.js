const findNeededToken = (maxId, minId, notWanted) => {
  return Array(maxId - minId)
    .fill(0)
    .map((v, i) => i + minId)
    .filter((id) => !notWanted.includes(id));
};

module.exports = findNeededToken;
