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
var IndexError = jsython.IndexError;
var eq = jsython.eq;
var len = jsython.len;
var contains = jsython.contains;
var getitem = jsython.getitem;

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

    it('test l1 contains elem', function () {
        expect(contains(l1, int_cons(2))).toEqual(True);
    });

    it('test l1 does not contains elem', function () {
        expect(contains(l1, int_cons(3))).toEqual(False);
    });

    it('test l1 at position 0', function () {
        expect(getitem(l1, int_cons(0))).toEqual(int_cons(1));
    });

    it('test l1 at position 1', function () {
        expect(getitem(l1, int_cons(1))).toEqual(int_cons(2));
    });

    it('test l1 at position -1', function () {
        expect(function () {
            getitem(l1, int_cons(-1));
        }).toThrow();
    });

    it('test l1 at position 2', function () {
        expect(function () {
            getitem(l1, int_cons(2));
        }).toThrow();
    });
});
