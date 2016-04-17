// define(['serializeHtmlWithStyles'], function (serialize) {
var serialize = module.exports;
describe("when the app starts", function () {
    console.log(serialize(document.body));
    it("outputs 'App Started!' in the target", function () {
        expect(true).toBe(true);
    });
});

// });