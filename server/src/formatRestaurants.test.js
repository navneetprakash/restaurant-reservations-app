const formatRestaurant = require("./formatRestaurants");

describe("formatRestaurant", () => {
  it("should format a restaurant from Mongoose to API spec", () => {
    const validRestaurants = {
      name: "Mock name",
      description: "Mock description",
      image: "Mock image",
    };
    const received = formatRestaurant({
      _id: "abc",
      __v: "this-should-be-removed",
      ...validRestaurants,
    });
    const expected = {
      ...validRestaurants,
      id: "abc",
    };
    expect(received).toEqual(expected);
  });
});
