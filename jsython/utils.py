def yield_join(sep, iterable, yielder):
    notfirst = False
    for elem in iterable:
        if notfirst:
            yield sep
        else:
            notfirst = True
        yield from yielder(elem)


def transpile_join(sep, iterable, info):
    def yielder(elem):
        yield from elem.transpile(info)
    yield from yield_join(sep, iterable, yielder)
