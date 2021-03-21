const assert = require("assert");
const proxyquire = require("proxyquire");

const {
  createStub,
  getAllStub,
  MongoLibMock,
} = require("../utils/mocks/mongoLib");

const {
  filteredProductsMock,
  productsMock,
  ProductsServiceMock,
} = require("../utils/mocks/products");

describe("services - products", function () {
  const ProductsService = proxyquire("../service/products", {
    "../lib/mongo": MongoLibMock,
  });

  const productService = new ProductsService();

  describe("when getProducts method is called", async function () {
    it("should call the getAll MongoLib method", async function () {
      await productService.getProducts({});
      assert.strictEqual(getAllStub.called, true);
    });

    it("should return an array of products", async function () {
      const result = await productService.getProducts({});
      const expected = productsMock;
      assert.deepStrictEqual(result, expected);
    });
  });

  describe("when getProducts method is called with tags", async function () {
    it("should all the getAll MongoLib method with tags args", async function () {
      await productService.getProducts({ tags: ["expensive"] });
      const tagQuery = { tags: { $in: ["expensive"] } };
      assert.strictEqual(getAllStub.calledWith("products", tagQuery), true);
    });

    it("should return an array of products filtered by the tag", async function () {
      const result = await productService.getProducts({ tags: ["expensive"] });
      const expected = filteredProductsMock("expensive");
      assert.deepStrictEqual(result, expected);
    });
  });
});
