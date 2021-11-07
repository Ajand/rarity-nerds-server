const Token = require("../db/Token");

const addToken = (collectionId, tokenId, tokenData) => {
  return new Promise((resolve, reject) => {
    Token.findOne({ collectionId, tokenId }, (err, token) => {
      if (err) return reject(err);
      if (token) {
        Token.updateOne(
          { _id: token._id },
          { $set: { ...tokenData } },
          (err) => {
            if (err) return reject(err);
            return resolve("updated.");
          }
        );
      } else {
        const token = new Token({
          ...tokenData,
          tokenUnique: `${collectionId}:${tokenId}`,
          collectionId
        });

        return token
          .save()
          .then((token) => resolve(token))
          .catch((err) => console.log(err));
      }
    });
  });
};

module.exports = addToken;
