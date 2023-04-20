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

/*
// All IDs set automatically by mLab
// Don't forget to update after creation
const directorsJson = [
  { "name": "Quentin Tarantino", "age": 55 }, // 63075e0f24323b53778e0881
  { "name": "Michael Radford", "age": 72 }, // 63075e5524323b53778e0882
  { "name": "James McTeigue", "age": 51 }, // 63075e7a24323b53778e0884
  { "name": "Guy Ritchie", "age": 50 }, // 63075e9324323b53778e0885
];
// directorId - it is ID from the directors collection
const moviesJson = [
  { "name": "Pulp Fiction", "genre": "Crime", "directorId": "63075e0f24323b53778e0881" },
  { "name": "1984", "genre": "Sci-Fi", "directorId": "5c84caebfb6fc0720131f9e4" },
  { "name": "V for vendetta", "genre": "Sci-Fi-Triller", "directorId": "5c84cb24fb6fc0720131f9e8" },
  { "name": "Snatch", "genre": "Crime-Comedy", "directorId": "5c84cb45fb6fc0720131f9ed" },
  { "name": "Reservoir Dogs", "genre": "Crime", "directorId": "5c84c9a3fb6fc0720131f9af" },
  { "name": "The Hateful Eight", "genre": "Crime", "directorId": "5c84c9a3fb6fc0720131f9af" },
  { "name": "Inglourious Basterds", "genre": "Crime", "directorId": "5c84c9a3fb6fc0720131f9af" },
  { "name": "Lock, Stock and Two Smoking Barrels", "genre": "Crime-Comedy", "directorId": "5c84cb45fb6fc0720131f9ed" },
];
const movies = [
  { id: '1', name: "Pulp Fiction", genre: "Crime", directorId: "1" },
  { id: '2', name: "1984", genre: "Sci-Fi", directorId: "2" },
  { id: '3', name: "V for vendetta", genre: "Sci-Fi-Triller", directorId: "3" },
  { id: '4', name: "Snatch", genre: "Crime-Comedy", directorId: "4" },
  { id: '5', name: "Reservoir Dogs", genre: "Crime", directorId: "1" },
  { id: '6', name: "The Hateful Eight", genre: "Crime", directorId: "1" },
  { id: '7', name: "Inglourious Basterds", genre: "Crime", directorId: "1" },
  { id: '8', name: "Lock, Stock and Two Smoking Barrels", genre: "Crime-Comedy", directorId: "4" },
];
const directors = [
	{ id: '1', name: "Quentin Tarantino", age: 55 },
  { id: '2', name: "Michael Radford", age: 72 },
  { id: '3', name: "James McTeigue", age: 51 },
  { id: '4', name: "Guy Ritchie", age: 50 },
];
*/

const movies = [
  { id: "1", name: "Pulp Fiction", genre: "Crime", directorId: "1" },
  { id: "2", name: "1984", genre: "Sci-Fi", directorId: "2" },
  { id: "3", name: "V for vendetta", genre: "Sci-Fi-Triller", directorId: "3" },
  { id: "4", name: "Snatch", genre: "Crime-Comedy", directorId: "4" },
  { id: "5", name: "Reservoir Dogs", genre: "Crime", directorId: "1" },
  { id: "6", name: "The Hateful Eight", genre: "Crime", directorId: "1" },
  { id: "7", name: "Inglourious Basterds", genre: "Crime", directorId: "1" },
  {
    id: "7",
    name: "Lock, Stock and Two Smoking Barrels",
    genre: "Crime-Comedy",
    directorId: "4",
  },
];

const directors = [
  { id: "1", name: "Quentin Tarantino", age: 55 },
  { id: "2", name: "Michael Radford", age: 72 },
  { id: "3", name: "James McTeigue", age: 51 },
  { id: "4", name: "Guy Ritchie", age: 50 },
];

const PetType = new GraphQLObjectType({
  name: "Pet",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    img: { type: GraphQLString },
    petCount: { type: GraphQLInt },
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
        petCount: { type: GraphQLInt },
      },
      resolve(parent, args) {
        const pet = new Pets({
          name: args.name,
          img: args.img,
          petCount: args.petCount ?? 0,
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
        petCount: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve(parent, args) {
        return Pets.findByIdAndUpdate(
          args.id,
          { $set: { name: args.name, img: args.img, petCount: args.petCount } },
          { new: true }
        );
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
