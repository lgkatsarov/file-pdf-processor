import { expect, should } from "chai";
import { describe, it } from "mocha";

describe("API Tests", () => {
  it("should return a JSON response from the /api/cars endpoint", async () => {
    const response = await fetch("http://localhost:5000/api/cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ownerName: "paul",
      }),
    });
    expect(response.status).to.equal(200);
    const data = await response.json();
    expect(data).to.be.an("array");
  });

  it("should return a 404 status code for an unknown endpoint", async () => {
    const response = await fetch("http://localhost:5000/unknown");
    expect(response.status).to.equal(404);
  });
});
