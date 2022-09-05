require("dotenv").config();
const request = require("supertest");
const app = require("./app");

describe("app", () => {
  // start test for GET /restaurants route
  test("GET /restaurants returns all restaurants", async () => {
    const expectedStatus = 200;
    const expectedBody = [
      {
        id: "616005cae3c8e880c13dc0b9",
        name: "Curry Place",
        description: "Bringing you the spirits of India in the form of best authentic grandma's recipe dishes handcrafted with love by our chefs!",
        image: "https://i.ibb.co/yftcRcF/indian.jpg",
      },
      {
        id: "616005e26d59890f8f1e619b",
        name: "Thai Isaan",
        description:
          "We offer guests a modern dining experience featuring the authentic taste of Thailand. Food is prepared fresh from quality ingredients and presented with sophisticated elegance in a stunning dining setting filled with all the richness of Thai colour, sound and art.",
        image: "https://i.ibb.co/HPjd2jR/thai.jpg",
      },
      {
        id: "616bd284bae351bc447ace5b",
        name: "Italian Feast",
        description:
          "From the Italian classics, to our one-of-a-kind delicious Italian favourites, all of our offerings are handcrafted from the finest, freshest ingredients available locally. Whether you're craving Italian comfort food like our Ravioli, Pappardelle or something with a little more Flavour like our famous Fettuccine Carbonara.",
        image: "https://i.ibb.co/0r7ywJg/italian.jpg",
      },
    ];

    await request(app)
      .get("/restaurants")
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expectedBody);
      });
  }); // end of test GET /restaurants route

  // start test for GET /restaurants/:id route
  test("GET /restaurants/:id returns a single restaurant", async () => {
    const expectedStatus = 200;
    const id = "616bd284bae351bc447ace5b";
    const expectedBody = {
      id: id,
      name: "Italian Feast",
      description:
        "From the Italian classics, to our one-of-a-kind delicious Italian favourites, all of our offerings are handcrafted from the finest, freshest ingredients available locally. Whether you're craving Italian comfort food like our Ravioli, Pappardelle or something with a little more Flavour like our famous Fettuccine Carbonara.",
      image: "https://i.ibb.co/0r7ywJg/italian.jpg",
    };

    await request(app)
      .get(`/restaurants/${id}`)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expectedBody);
      });
  }); // end test for GET /restaurants/:id route

  // Return 404 when ID does not exist
  test("GET /restaurants/:id returns 404 when id does not exist in the database", async () => {
    const expectedStatus = 404;
    const id = "6237a9d9514f9c55745c1d07";
    const expectedBody = {
      error: "restaurant not found",
    };

    await request(app)
      .get(`/restaurants/${id}`)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expectedBody);
      });
  });

  // Return 400 when ID is invalid
  test("GET /restaurants/:id returns 400 when the id is invalid", async () => {
    const expectedStatus = 400;
    const id = "123456789";
    const expectedBody = {
      error: "invalid id provided",
    };

    await request(app)
      .get(`/restaurants/${id}`)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expectedBody);
      });
  });

  // Return 201 status when POST a reservation is created
  test("POST /reservations creates a new reservation", async () => {
    const expectedStatus = 201;
    const body = {
      partySize: 100,
      date: "2023-11-17T06:30:00.000Z",
      restaurantName: "Mock Restaurant Name",
    };

    await request(app)
      .post("/reservations")
      .send(body)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expect.objectContaining(body));
      });
  });

  // GET all reservations when signed in
  test("GET /reservations return 200 for All reservations for logged in user", async () => {
    const expected = [
      {
        id: "507f1f77bcf86cd799439011",
        partySize: 4,
        date: "2023-11-17T06:30:00.000Z",
        restaurantName: "Island Grill",
        userId: "mock-user-id",
      },
      {
        id: "614abf0a93e8e80ace792ac6",
        partySize: 2,
        date: "2023-12-03T07:00:00.000Z",
        restaurantName: "Green Curry",
        userId: "mock-user-id",
      },
    ];

    await request(app)
      .get("/reservations")
      .set("Content-type", "application/json")
      .expect(200)
      .expect((response) => {
        const resBody = response.body;
        expect(resBody).toEqual(expected);
      });
  });

  // Return 400 status when ValidationError occurs
  test("POST /reservations returns a 400 when an invalid request body is provided", async () => {
    const body = {};
    const expectedStatus = 400;

    const response = await request(app).post("/reservations").send(body);
    expect(response.status).toEqual(expectedStatus);
  });

  // reservations/:id should return 200
  test("GET /reservations/:id should return 200", async () => {
    const expected = {
      id: "507f1f77bcf86cd799439011",
      partySize: 4,
      date: "2023-11-17T06:30:00.000Z",
      userId: "mock-user-id",
      restaurantName: "Island Grill",
    };

    await request(app)
      .get("/reservations/507f1f77bcf86cd799439011")
      .expect(200)
      .expect((response) => {
        const { body } = response;
        expect(body).toEqual(expected);
      });
  });

  // GET /reservation:id returns 400 status
  test("GET /reservations/:id returns 400 when invalid id is provided", async () => {
    const expectedStatus = 400;
    const id = "62424e8337bf2f089af02a95saad";
    const expectedBody = {
      error: "invalid id provided",
    };

    await request(app)
      .get(`/reservations/${id}`)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expectedBody);
      });
  });

  // GET /reservation:id returns 404 status
  test("GET /reservations/:id returns 404 not found", async () => {
    const expectedStatus = 404;
    const id = "623bfcd22eadf84681912297";
    const expectedBody = {
      error: "not found",
    };

    await request(app)
      .get(`/reservations/${id}`)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toEqual(expectedBody);
      });
  });

  test("GET /reservations/userid returns all reservations for userId match", async () => {
    const userId = "mock-user-id";
    const expected = [
      {
        id: "507f1f77bcf86cd799439011",
        partySize: 4,
        date: "2023-11-17T06:30:00.000Z",
        restaurantName: "Island Grill",
        userId: "mock-user-id",
      },
      {
        id: "614abf0a93e8e80ace792ac6",
        partySize: 2,
        date: "2023-12-03T07:00:00.000Z",
        restaurantName: "Green Curry",
        userId: "mock-user-id",
      },
    ];

    await request(app)
      .get(`/reservations?userId=${userId}`)
      .set("Content-type", "application/json")
      .expect(200)
      .expect((response) => {
        const resBody = response.body;
        expect(resBody).toEqual(expected);
      });
  });

  it("Should return 403 if not authorised", async () => {
    const expected = { error: "user does not have permission to access this reservation" };

    await request(app)
      .get("/reservations/61679189b54f48aa6599a7fd")
      .expect(403)
      .expect((response) => {
        const resBody = response.body;
        expect(resBody).toEqual(expected);
      });
  });
  // Get all reservations for signed in user
  it("Should return 200 for all signed in users", async () => {
    const expected = [
      {
        id: "507f1f77bcf86cd799439011",
        partySize: 4,
        date: "2023-11-17T06:30:00.000Z",
        restaurantName: "Island Grill",
        userId: "mock-user-id",
      },
      {
        id: "614abf0a93e8e80ace792ac6",
        partySize: 2,
        date: "2023-12-03T07:00:00.000Z",
        restaurantName: "Green Curry",
        userId: "mock-user-id",
      },
    ];

    await request(app)
      .get("/user/reservations")
      .expect(200)
      .expect((response) => {
        const resBody = response.body;
        expect(resBody).toEqual(expected);
      });
  });

  // Get a user reservation by id
  it("Should return 200 with a single reservation id for signed in user", async () => {
    const expected = {
      id: "507f1f77bcf86cd799439011",
      partySize: 4,
      date: "2023-11-17T06:30:00.000Z",
      restaurantName: "Island Grill",
      userId: "mock-user-id",
    };

    await request(app)
      .get("/user/reservations/507f1f77bcf86cd799439011")
      .expect(200)
      .expect((response) => {
        const resBody = response.body;
        expect(resBody).toEqual(expected);
      });
  });

  // return 400 when invalid id
  it("Should return 400 when trying to access invalid id", async () => {
    const expected = {
      message: "Invalid id",
    };

    await request(app)
      .get("/user/reservations/123456789")
      .expect(400)
      .expect((response) => {
        const resBody = response.body;
        expect(resBody).toEqual(expected);
      });
  });

  // return 404 when not found
  it("Should return 404 when trying to access invalid id", async () => {
    const expected = {
      message: "Not found",
    };

    await request(app)
      .get("/user/reservations/624118ccd91ae6db4f36159c")
      .expect(404)
      .expect((response) => {
        const resBody = response.body;
        expect(resBody).toEqual(expected);
      });
  });

  // return 403 when not found
  it("Should return 403 when trying to access invalid id", async () => {
    const expected = {
      error: "user does not have permission to access this reservation",
    };

    await request(app)
      .get("/user/reservations/61679189b54f48aa6599a7fd")
      .expect(403)
      .expect((response) => {
        const resBody = response.body;
        expect(resBody).toEqual(expected);
      });
  });
});
