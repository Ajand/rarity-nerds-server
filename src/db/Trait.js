const mongoose = require("mongoose");

const TraitSchema = new mongoose.Schema({
  collectionId: {
    type: mongoose.Types.ObjectId,
    required: true,
    lowercase: true,
    index: true,
  },
  trait_type: { type: String, required: true, index: true },
  value: {
    type: String,
    required: true,
    index: true,
  },
  amount: {
    type: Number,
    required: true,
  },
});

const Trait = mongoose.model("trait", TraitSchema);

module.exports = Trait;
