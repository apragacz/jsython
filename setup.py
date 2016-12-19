import os.path
import re
from setuptools import setup, find_packages

ROOT_DIR = os.path.dirname(__file__)


def read_contents(local_filepath):
    with open(os.path.join(ROOT_DIR, local_filepath)) as f:
        return f.read()


def get_requirements(requirements_filepath):
    '''
    Return list of this package requirements via local filepath.
    '''
    return read_contents(requirements_filepath).split('\n')


def get_version(package):
    '''
    Return package version as listed in `__version__` in `init.py`.
    '''
    init_py = read_contents(os.path.join(package, '__init__.py'))
    return re.search("__version__ = ['\"]([^'\"]+)['\"]", init_py).group(1)


def get_long_description(markdown_filepath):
    '''
    Return the long description in RST format, when possible.
    '''
    try:
        import pypandoc
        return pypandoc.convert(markdown_filepath, 'rst')
    except ImportError:
        return read_contents(markdown_filepath)


setup(
    name='jsython',
    version=get_version('jsython'),
    packages=find_packages(exclude=['tests.*', 'tests']),
    author='Andrzej Pragacz',
    author_email='apragacz@o2.pl',
    description=(
        'Yet another python-to-javascript transpiler'
    ),
    license='MIT',
    keywords=' '.join((
        'python',
        'javascript',
        'js',
        'pyjs',
        'transpiler',
        'compiler',
        'jsython',
    )),
    long_description=get_long_description('README.md'),
    classifiers=[
        'Development Status :: 2 - Pre-Alpha',
        'Environment :: Web Environment',
        'Intended Audience :: Developers',
        'License :: OSI Approved :: MIT License',
        'Operating System :: POSIX',
        'Programming Language :: Python',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3 :: Only',
        'Topic :: Utilities',
        'Topic :: Internet',
        'Topic :: Internet :: WWW/HTTP',
    ],
    entry_points={
        'console_scripts': [
            'jsython = jsython.main:entry_point',
        ],
    },
    install_requires=get_requirements('requirements.txt'),
    url='https://github.com/szopu/jsython',
)
