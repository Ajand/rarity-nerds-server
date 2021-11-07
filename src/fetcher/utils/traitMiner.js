

const traitMiner = traitDBQueue => (response, collectionId, id) => {
  console.log('mining trait for id: ', id)
  if (response.attributes) {
    [
      ...response.attributes,
      { trait_type: "trait_count", value: response.attributes.length },
    ].forEach((trait) => {
      traitDBQueue.add({collectionId, trait})});
  } else if (response.traits) {
    [
      ...response.traits,
      { trait_type: "trait_count", value: response.traits.length },
    ].forEach((trait) => traitDBQueue.add({collectionId, trait}));
  } else {
    throw new Error("Not Revealed Yet!");
  }
};

module.exports = traitMiner;
