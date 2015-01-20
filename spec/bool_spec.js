var expect = require('expect');
var jsython = require('./../lib/jsython');

var object = jsython.object;
var bool = jsython.bool;
var int_cons = jsython.int_cons;
var type = jsython.type;
var True = jsython.True;
var False = jsython.False;
var eq = jsython.eq;
var len = jsython.len;


describe("bool", function() {

    it("test True type with instanceof", function() {
        expect(True).toBeA(bool);
    });

    it("test True type with instanceof", function() {
        expect(True).toBeA(object);
    });

    it("test True type with instanceof", function() {
        expect(False).toBeA(bool);
    });

    it("test True type with instanceof", function() {
        expect(False).toBeA(object);
    });

    it("test list type of True", function() {
        expect(type(True)).toBe(bool);
    });

    it("test list type of False", function() {
        expect(type(False)).toBe(bool);
    });

    it("test boolean equality (1)", function() {
        expect(eq(False, False)).toBe(True);
    });

    it("test boolean equality (2)", function() {
        expect(eq(True, True)).toBe(True);
    });

    it("test boolean inequality (1)", function() {
        expect(eq(True, False)).toBe(False);
    });

    it("test boolean inequality (2)", function() {
        expect(eq(False, True)).toBe(False);
    });

});

