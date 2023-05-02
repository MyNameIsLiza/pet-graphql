const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} = require("graphql");

const Pets = require("../models/pet");

const PetType = new GraphQLObjectType({
  name: "Pet",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    img: { type: GraphQLString },
    patCount: { type: GraphQLInt },
  }),
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addPet: {
      type: PetType,
      args: {
        name: { type: GraphQLString },
        img: { type: GraphQLString },
        patCount: { type: GraphQLInt },
      },
      resolve(parent, args) {
        const pet = new Pets({
          name: args.name,
          img: args.img,
          patCount: args.patCount ?? 0,
        });
        return pet.save();
      },
    },
    deletePet: {
      type: PetType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Pets.findByIdAndRemove(args.id);
      },
    },
    updatePet: {
      type: PetType,
      args: {
        id: { type: GraphQLID },
        name: { type: new GraphQLNonNull(GraphQLString) },
        img: { type: new GraphQLNonNull(GraphQLString) },
        patCount: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        return Pets.findByIdAndUpdate(
          args.id,
          { $set: { name: args.name, img: args.img, patCount: args.patCount } },
          { new: true }
        );
      },
    },
    patPet: {
      type: PetType,
      args: { id: { type: GraphQLID } },
      async resolve(parent, args) {
        const oldPet = await Pets.findById(args.id);
        if (!oldPet) return new Error("Pet with this id is missing");
        const pet = Pets.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: oldPet.name,
              img: oldPet.img,
              patCount: oldPet.patCount + 1,
            },
          },
          { new: true }
        );
        return pet;
      },
    },
  },
});

const Query = new GraphQLObjectType({
  name: "Query",
  fields: {
    pet: {
      type: PetType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Pets.findById(args.id);
      },
    },
    pets: {
      type: new GraphQLList(PetType),
      resolve(parent, args) {
        return Pets.find({});
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation,
});
