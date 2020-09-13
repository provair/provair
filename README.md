# provair

[![Build Status](https://travis-ci.com/provair/provair.svg?token=V5o5QF2yMaybK698Lwxz&branch=master)](https://travis-ci.com/github/provair/provair)
[![codecov](https://codecov.io/gh/provair/provair/branch/master/graph/badge.svg?token=DUP14LMBQC)](https://codecov.io/gh/provair/provair)

> A provable fair system that can pass all
> [SP 800-22](https://csrc.nist.gov/publications/detail/sp/800-22/rev-1a/final)
> tests.

## Install

```sh
npm i provair
```

## Usage

**TBD**

## SP 800-22 testing

[sp800_22_tests](https://github.com/dj-on-github/sp800_22_tests) is A python
implementation of the SP800-22 Rev 1a PRNG test suite.

```sh
$ npm i @provair/cli -g
$ git clone https://github.com/dj-on-github/sp800_22_tests
$ cd sp800_22_tests
$ provair rand -b -k 256 -o test.bin
$ python ./sp800_22_tests.py ./test.bin

Tests of Distinguishability from Random
TEST: monobit_test
  Ones count   = 1048307
  Zeroes count = 1048845
  PASS
  P=0.710259739353

[ Lots of per test output ]

SUMMARY
-------
monobit_test                             0.710259739353     PASS
frequency_within_block_test              0.765249647678     PASS
runs_test                                0.537860435367     PASS
longest_run_ones_in_a_block_test         0.403983546931     PASS
binary_matrix_rank_test                  0.200488689692     PASS
dft_test                                 0.903163489064     PASS
non_overlapping_template_matching_test   0.999999473971     PASS
overlapping_template_matching_test       0.277789765986     PASS
maurers_universal_test                   0.14380305027      PASS
linear_complexity_test                   0.288352301634     PASS
serial_test                              0.731698804316     PASS
approximate_entropy_test                 0.73145286156      PASS
cumulative_sums_test                     0.553723086962     PASS
random_excursion_test                    0.250402086143     PASS
random_excursion_variant_test            0.25288752955      PASS
```

The details result can be found [here](SP800-22.txt)

## Licence

[Apache-2.0](LICENSE)
