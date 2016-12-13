import os.path
from argparse import ArgumentParser

from .parser import parse
from .info import TranspileInfo


def transpile(in_f, out_f):
    data = in_f.read()
    graph = parse(data)
    transpile_info = TranspileInfo()
    for chunk in graph.transpile(transpile_info):
        if not isinstance(chunk, str):
            raise ValueError(''.join(c for c in chunk))
        out_f.write(chunk)


def convert_path(in_path):
    in_split = os.path.splitext(in_path)
    if in_split[1] != '.py':
        raise ValueError("Invalid input extension")
    out_path = in_split[0] + '.js'
    return out_path


def main(argv):
    parser = ArgumentParser()
    parser.add_argument('input_files', nargs='+')
    args = parser.parse_args(argv[1:])
    pairs = [(in_path, convert_path(in_path)) for in_path in args.input_files]
    for in_path, out_path in pairs:
        with open(in_path, 'rt') as in_f, open(out_path, 'wt') as out_f:
            transpile(in_f, out_f)
