const tokenMiner = (response, id, contract) => {
    return {
      ...response,
      attributes: response.attributes
        ? [
            ...response.attributes,
            {
              trait_type: "trait_count",
              value: response.attributes.length,
            },
          ]
        : response.traits
        ? [
            ...response.traits,
            { trait_type: "trait_count", value: response.traits.length },
          ]
        : [],
      traits: response.attributes
        ? {
            ...response.attributes.reduce((pV, cV) => {
              let retObj = {
                ...pV,
              };
              retObj[cV.trait_type] = cV.value;
              return retObj;
            }, {}),
            trait_count: response.attributes.length,
          }
        : response.traits
        ? {
            ...response.traits.reduce((pV, cV) => {
              let retObj = {
                ...pV,
              };
              retObj[cV.trait_type] = cV.value;
              return retObj;
            }, {}),
            trait_count: response.traits.length,
          }
        : {
            trait_count: 0,
          },
      tokenId: id,
      contract
    };
  };
  
  module.exports = tokenMiner;
  