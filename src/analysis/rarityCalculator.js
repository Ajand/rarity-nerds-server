const Token = require("../db/Token");
const Trait = require("../db/Trait");


const rarityCalculator = rarityDBQueue => (collectionId) => {
  return new Promise((resolve, reject) => {
    Token.find({ collectionId: collectionId }, (err, tokens) => {
      if (err) return reject(err);
      if (tokens) {
        Trait.find({ collectionId: collectionId }, (err, traits) => {
          tokens
            .map((token) => {
              const findTraitCategoryDensity = () => {
                const traitsOfContract = traits;

                var traitsCategories = [];
                traitsOfContract.forEach((trait) => {
                  if (traitsCategories[trait.trait_type]) {
                    traitsCategories[trait.trait_type] =
                      traitsCategories[trait.trait_type] + 1;
                  } else {
                    traitsCategories[trait.trait_type] = 1;
                  }
                });

                return traitsCategories;
              };

              const traitsCategories = findTraitCategoryDensity();

              const findTraitAmount = (trait_type, value) =>
                traits.find(
                  (tt) => tt.trait_type === trait_type && tt.value === value
                )
                  ? traits.find(
                      (tt) => tt.trait_type === trait_type && tt.value === value
                    ).amount
                  : 1;

              const calculateNormalized = (token) => {
                return token.attributes.reduce((pV, cV) => {
                  const trait_amount = findTraitAmount(cV.trait_type, cV.value);

                  return (
                    pV +
                    (tokens.length / trait_amount) *
                      (1 / traitsCategories[cV.trait_type])
                  );
                }, 0);
              };

              const normalizeScore = token.attributes
                ? calculateNormalized(token)
                : 0;

              return {
                tokenId: token.tokenId,
                normalizeScore,
              };
            })
            .sort((b, a) => a.normalizeScore - b.normalizeScore)
            .forEach((token, index) => {
              // add {...token, rarityRank, scoreRank: index+1}
              //  console.log(token);


              rarityDBQueue.add({
                collectionId: collectionId,
                tokenId: token.tokenId,
                normalizeScore: token.normalizeScore,
                scoreRank: index + 1,
              });
            });
        });
      }
    });
  });
};

module.exports = rarityCalculator;
