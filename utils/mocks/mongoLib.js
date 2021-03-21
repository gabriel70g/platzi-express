const { productsMock, filteredProductsMock } = require("./products");
const sinom = require("sinon");

const getAllStub = sinom.stub();
const tagQuery = { tags: { $in: ["expensive"] } };

getAllStub.withArgs("products").resolves(productsMock);
getAllStub
  .withArgs("products", tagQuery)
  .resolves(filteredProductsMock("expensive"));

const createStub = sinom.stub().resolves("6bedb1267d1ca7f3053e2875");

class MongoLibMock {
  getAll(collection, query) {
    return getAllStub(collection, query);
  }

  create(collection, data) {
    return createStub(collection, data);
  }
}

module.exports = {
  createStub,
  getAllStub,
  MongoLibMock,
};
