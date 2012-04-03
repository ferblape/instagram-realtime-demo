var Browser = require("zombie");

describe("Validate callback URL", function() {
  Browser.debug = true;
  var browser = new Browser();

  it("should contain hub.challenge value in the body of the response", function() {
    browser.visit("http://localhost:3000/callback?hub.mode=subscribe&hub.challenge=15f7d1a91c1f40f8a748fd134752feb3&hub.verify_token=myVerifyToken", function() {
      expect(browser.statusCode).toEqual(200);
      expect(browser.text("body")).toEqual("15f7d1a91c1f40f8a748fd134752feb3");
    });
  });
});
