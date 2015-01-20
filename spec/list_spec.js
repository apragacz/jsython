var expect = require('expect');
var jsython = require('./../lib/jsython');

var object = jsython.object;
var list = jsython.list;
var list_cons = jsython.list_cons;
var int_cons = jsython.int_cons;
var add = jsython.add;
var type = jsython.type;
var True = jsython.True;
var False = jsython.False;
var eq = jsython.eq;
var len = jsython.len;

var l0 = list();
var l1 = list_cons([int_cons(1), int_cons(2)]);
var l2 = list_cons([int_cons(1), int_cons(2)]);


describe("list", function() {

    it("test list type with instanceof", function() {
        expect(l0).toBeA(object);
    });

    it("test list type with instanceof", function() {
        expect(l0).toBeA(list);
    });

    it("test list type of l0", function() {
        expect(type(l0)).toBe(list);
    });

    it("test list type of l1", function() {
        expect(type(l1)).toBe(list);
    });

    it("test list equality", function() {
        expect(eq(l1, l2)).toBe(True);
    });

    it("test list inequality", function() {
        expect(eq(l0, l2)).toBe(False);
    });

    it("test list len of l0", function() {
        expect(len(l0)).toEqual(int_cons(0));
    });

    it("test list len of l1", function() {
        expect(len(l1)).toEqual(int_cons(2));
    });

    it("test list len of l1 + l2", function() {
        expect(len(add(l1, l2))).toEqual(int_cons(4));
    });
});

