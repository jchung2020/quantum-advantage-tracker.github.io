# Circuit instance description:

`nq70_depth70_checks27_basis_THTH.qasm`: This prepares a random graph state on a 70 X 70 circuit, arranged on a 1D lattice (LNN). Gates T-H-T-H are appended at the end of each qubit for non-Clifford basis measurements. Best known Schmidt rank is $2^{30}$, best known stabilizer rank is $2^{55.5}$.

- `nq70_depth70_checks27_basis_THTH.qasm`: This includes the ancilla Pauli checks for the above circuit.

# `Random Graph State Sampling`

We present circuits to prepare random graph states and measure in a non-Clifford basis. We aim to show that we can sample with high enough fidelity to certify quantum advantage.

## `Computational Complexity`

We claim that sampling from random graph states in a non-Clifford basis satisfies the conditions for demonstrating quantum advantage. At a high level, quantum circuits are difficult to simulate if they exhibit (1) high fidelity, long-range entanglement - nonlocal correlations are difficult to predict without exponentially many classical resources - and, since Clifford circuits can generate highly entangled states while being simulable in polynomial time, (2) nonstabilizerness or magic. Graph state sampling satisfies both properties; the states can be highly entangled and non-Clifford rotations at the end add the necessary magic. [Ghoush et. al](https://arxiv.org/pdf/2412.07058) confirm that, for k-regular graphs, sampling from a random X-Y basis is #P-hard, and the outcomes exhibit anticoncentration.

Prior work on [random circuit sampling (RCS)](https://www.nature.com/articles/s41586-019-1666-5) similarly exploits the difficulty of simulating Haar-random states. The output probabilities are distributed according to the Porter-Thomas distribution, which serves as a witness for non-classical behavior. In particular, they use cross-entropy benchmarking (XEB), which compares the output distribution (in the Z-basis) of each sampled output $x$ to its quantum probability

$$F_{XEB} =  \frac{2^n}{M} \sum_i^M | \bra{0} C \ket{x_i} |^2 - 1$$

Under assumptions of weak, uncorrelated noise, this approximates the state fidelity. Additionally, as samples drawn from the Porter-Thomas distribution have perfect $F_{XEB} = 1$ and samples drawn from the uniform distribution have $F_{XEB} = 0$, a non-zero fidelity constitutes evidence of advantage.

A key detail is that XEB requires classical simulations, hence can only be approximated for the full-depth circuit - the authors present arguments for why this can be extrapolated from smaller depth or less entangled circuits. With random graph state sampling, however, we directly measure the state fidelity and make minimal assumptions about the noise in our circuit.

## `Quantifying Entanglement`

We quantify the entanglement of the graph state by measuring the Schmidt rank, the GF2 rank of the adjacency matrix, across random bipartitions. For state with size $n$,

$$ Schmidt\ rank \leq 2^{n/2}$$

Notably, this corresponds exactly to the bond dimension. In the worst case, then, the contraction cost of tensor network simulations scales exponentially with the state size.

To maximize the entanglement in our graph states, we use an ansatz of an odd/even layer of CZ gates (brickwork layout) followed by a layer of random $SX$ or $S;\ SX$ rotations on each qubit. We numerically verify that this is close to saturating the entanglement bound, reporting the minimum Schmidt rank over 100 million random bipartitions.

## `Stabilizer Rank`

Clifford + T simulations offer an alternative approach of simulating stabilizer states with magic. The complexity scales with the stabilizer rank, for which the [best known upper bound](https://arxiv.org/pdf/2106.07740v1)

$$stabilizer\ rank \leq 2^{0.3963 \cdot (T\ count)}$$

predicts an exponential dependence. Classical simulations become intractable, then, with a large enough number of magic gates.

To the best of our knowledge, the large Schmidt and stabilizer rank of our graph states will be adversarial for exact classical simulations.

## `Verifying Advantage`

Common criticisms of RCS include that noise is unmitigated, resulting in vanishingly small fidelities, and that fidelity in the advantage regime is extrapolated from smaller and less entangled circuits. We claim that random graph state sampling makes improvements for both points.

## `Error detection`

With Clifford circuits, we can use the [error detection protocol](https://arxiv.org/pdf/2504.15725) to mitigate the noise in our samples. As Paulis can be propagated efficiently through Cliffords, we equip ancillas with spacetime Pauli checks, inserting them in locations where they will commute with the circuit. Noncommuting errors can therefore be detected and post-selected out. As illustrated in the reference above, this can result in order of magnitude improvements over bare state fidelity, with lower sampling overhead than PEC.

Our circuits are mapped onto a one dimensional chain with ancillas attached to exactly one data qubit. On IBM's heavy-hex architecture used in their Heron devices, it is likely that every other qubit will have degree 3. This dense placements of ancillas enables effective error detection, and guarantees that the number of ancillas can scale with the size of the circuit.

## `Measuring Fidelity`

As referenced above, another novel improvement we make over random circuit sampling is by directly measuring state fidelity. As the graph states can be prepared with high fidelity with error detection, it is efficient to use [direct fidelity estimation](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.106.230501). The fidelity for target state $\sigma$ and noisy output state $\rho$ with dimension $d$ can be approximated by randomly sampling the expectation values of $M$ random Paulis $P$:

$$F = \frac{1}{M} \sum_k^M \frac{1}{d} \braket{P_k}_{\rho} \braket{P_k}_{\sigma} $$

For stabilizer states, whose expectation values can be bounded, this requires only a constant shot overhead. Given that the uncertainty scales as $O(1/M)$, we measure enough random stabilizers to bound the fidelity above 1% with 95% confidence.

For non-stabilizer states, expecation values can become arbitrarily small, and this protocol can requires exponential shot overhead. We argue, however, that the fidelity of the graph state is equivalent whether measured in a stabilizer or non-stabilizer basis:

- Rotations in the stabilizer and non-stabilizer basis are implemented with $RZ(\theta_0);\ SX;\ RZ(\theta_1);\ SX;$ rotations, where only the angle of the Z rotations are modified.
- On IBM's devices, Z gates are [virtually implemented](https://journals.aps.org/pra/abstract/10.1103/PhysRevA.96.022330). Hence Z rotation gates are noiseless, implying that the graph state fidelity is representative of the state fidelity with T-gate doping.

Provided that classical simulations fail to efficiently sample from our state, we can demonstrate quantum advantage by showing the fidelity of the graph state is bounded away from zero.

## Institutions

IBM
