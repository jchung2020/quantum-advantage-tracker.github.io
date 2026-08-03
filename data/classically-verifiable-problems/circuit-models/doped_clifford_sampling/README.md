# Circuit instance description (Doped Clifford Sampling):

`nq70_depth70_checks27_doped.qasm`: This prepares a $T$-doped random graph state on a 70 X 70 circuit (70 qubits with CZ-depth 70). The 70 logical qubits are arranged on a 1D lattice (LNN) and 27 ancilla qubits are used for error detection. A maximum of 468 nontrivial $T$ gates can be placed throughout the circuit. The best known Schmidt rank is $2^{30}$ and the best known stabilizer rank is $2^{185.5}$. After post-selection, 0.059% of the shots remain, and the state fidelity is 0.32 $\pm$ 0.01 (bounded above 0.044 with 95% confidence).

- `nq70_depth70_checks27_doped_checks.qasm`: This includes the ancillas and spacetime Pauli checks for the above circuit.

## Doped Clifford Sampling

We present circuits for Doped Clifford Sampling (DCS) below. For more detailed descriptions and proofs, please reference the preprint ["Sampling hard circuits with verifiably high fidelity"](https://arxiv.org/abs/2607.25941).

## A. Computational Complexity

Sampling-based proposals for quantum advantage rely on the asymptotic hardness of random quantum state sampling for classical algorithms. Indeed, we show that sampling from brickwork Clifford circuits interleaved with programmable single qubit rotations (in practice we use $T$ gates) satisfies this property. This family of circuits is universal at polynomial depth, which implies #P-hardness in the worst case, and permits a worst to average case reduction (see Supplementary S8 in the paper). Unlike prior proposals that prepare Haar-random states, such as [random circuit sampling (RCS)](https://www.nature.com/articles/s41586-019-1666-5), we leverage the added structure from Clifford circuits. Crucially, this enables a spacetime encoding and consequently an argument for verifiability.

This proposal bears similarity to [random graph state sampling (RGS)](https://github.com/quantum-advantage-tracker/quantum-advantage-tracker.github.io/tree/main/data/classically-verifiable-problems/circuit-models/random_graph_sampling), which samples random _regular_ graph states in a random product basis. However, the magic gates are reserved in a single layer at the end, which may require scaling to large system sizes to become intractable for classical simulations.

In this work, we instead dope the graph state preparation circuits with $T$ gates, distributing them throughout the bulk of the circuit. $T$-doped Clifford circuits have been used to study [quantum chaos](https://arxiv.org/pdf/2102.08406), converging to relative error unitary k-designs (and therefore approximating Haar random states) when using a linear number of non-Clifford gates. As doping lifts the available magic resources from a linear to quadratic dependence on system size, there is an even greater complexity for classical simulations.

## B. Hardness of classical simulation

For the specific problem size that we ran, we quantify the hardness of simulation through two quantities: entanglement and magic. The former leads to the difficulty of tensor network-based methods, and the latter the difficulty of Clifford-based methods.
In doped Clifford sampling, both of these properties scale with the system size, implying that classical simulations using known methods will become effectively intractable past some finite circuit size.

### `Quantifying Entanglement`

We quantify the entanglement of the underlying graph state by estimating the Schmidt rank, the $GF(2)$ rank of its adjacency matrix, across random bipartitions. For an $n$-qubit graph state, the Schmidt rank is upper bounded by $2^{n/2}$. As this corresponds exactly to the bond dimension, the contraction cost of tensor network simulations will scale exponentially with this quantity.

To maximize the entanglement in our graph state, we use an ansatz of repeating layers of odd/even $CZ$ gates (brickwork layout), followed by random $\sqrt{X}$ or $S;\ \sqrt{X}$ rotations on each qubit. We do this until the circuit reaches a $CZ$-depth of $n$. It is known that this depth is enough to prepare _any_ graph state on an LNN architecture (to appear).

By taking the minimum over $10^8$ random bipartitions, we numerically verify that our circuit nearly saturates the entanglement upper bound with a Schmidt rank of $2^{30}$.

<p align="center">
  <img width="864" height="540" alt="image" src="https://github.com/user-attachments/assets/a1f6713e-bed6-4230-b1a1-336f8f6fa5c2" />

<em>Figure 1. Quimb matrix product state (MPS) contraction times for the doped 70 X 70 circuit with increasing depth (maximum depth 24) and a maximum bond dimension of 4096. Dots represent measured simulation times, while the solid curve is an exponential fit with b=1.64 and c=-24. We have strong evidence that simulating the Clifford skeleton of our experiment would require a bond dimension exceeding Frontier’s full available memory. </em>

</p>

While we have evidence that the Schmidt rank of the doped Clifford states should be high, tensor networks can still represent states faithfully at lower bound dimensions if the singular values follow an exponential distribution.

<p align="center">

  <img width="576" height="360" alt="image" src="https://github.com/user-attachments/assets/7bc32ff8-d156-4a80-8d8e-13225336e5d1" />
  <img width="864" height="360" alt="image" src="https://github.com/user-attachments/assets/e90ae9c7-c684-4bf2-8973-70346c6f1391" />

<em>Figure 2. (Top) Quimb matrix product state (MPS) simulations for the doped 70 X 70 circuit and a brickwork circuit interleaved with Haar single qubit random gates. We use a maximum bond dimension of 4096 and record the depth at which truncation error exceeds the experimentally measured infidelity 1 - 0.32. (Bottom) The singular value spectrum is flat for the the Clifford skeleton of a 14 X 14 circuit, has a strong exponential decay for a brickwork Haar-random circuit, and has a weaker exponential decay for the doped Clifford 14 X 14 and 70 X 14 circuits. Similarly, when estimating the fidelity from truncation error, the 14 X 14 Clifford skeleton shows the most adverse scaling, being linearly dependent on bond dimension, while the Haar-random circuit maintains high fidelity at lower bond dimensions. </em>

</p>

As seen in Figure 2, one-dimensional Haar-random circuits do have strongly decaying singular values and can be represented at high fidelities at lower bond dimensions. The doped Clifford circuits, however, have flatter singular value spectrums that are closer to that of the undoped Clifford circuit and still appear to require large bond dimensions to reach experimentally accessible fidelities.

### `Quantifying Non-stabilizerness`

Alternatively, stabilizer rank algorithms can be used, which are oblivious to the amount of entanglement, but scale exponentially with the amount of magic (non-stabilizerness) in the circuit. These methods decompose quantum states into a sum of stabilizers which can be efficiently simulated.

The complexity therefore scales with the minimum number of states used in this decomposition, i. e. the stabilizer rank. For circuits consisting only of Clifford and $T$ gates, the [best known upper bound](https://arxiv.org/pdf/2106.07740v1) is given by

$$stabilizer\ rank \leq 2^{0.3963 \cdot (T\ count)}$$

So, as claimed, the nonstabilizerness increases exponentially with the system size.

<p align="center">
  <img width="651" height="501" src="https://github.com/user-attachments/assets/c26e231b-9127-46ff-80b6-47d7d5a881ea" />
  
<em>Figure 3. Simulations of the doped 70 X 70 circuit in QuiZX with a maximum of 70 T gates (dots). The solid curve is an exponential fit on those data points with α=0.327 and β=2.07e-5. The dashed curve corresponds to the conjectured best possible scaling for stabilizer extent with α=0.228. </em>

</p>

Furthermore, by doping on a square $n$ X $n$ circuit, non-Clifford gates can be placed across depth $n$, yielding a maximum of $O(n^2)$ (instead of $O(n)$) magic resources - which further increases the complexity of extended stabilizer simulations.

We also make note of [Clifford Augmented Matrix Product State (CAMPS) simulators](https://arxiv.org/pdf/2412.17209), which combine tensor networks with Clifford tableau simulators. These algorithms reduce the bond dimension necessary to represent the state by propagating magic gates to the front of the circuit, using a tableau for the entangled Clifford bulk and a smaller bond dimension MPS for the magic layer. After the first $n$ magic gates however, the upper bound on the bond dimension necessary for the MPS increases exponentially, as well as the maximum bond dimension necessary to sample bitstring probabilities.

To the best of our knowledge, then, the large Schmidt rank and stabilizer extent of our $T$-doped graph states will be adversarial for exact or naïve approximate simulations. For more details on the attempted classical simulations, please reference Supplementary S9 in the paper.

## C. Verifiability

For sampling-based experiments, it suffices to show that samples can be drawn from a quantum computer with greater fidelity than through classical means. With DCS, we claim to have a more direct measure of the state fidelity that, relative to prior RCS-style experiments, requires fewer assumptions about the noise in our circuit.

For comparison, RCS uses the fact that the outcome probabilties of Haar-random states is described by the Porter-Thomas distribution, a distinctly non-classical model. The closeness of the sample distribution to the Porter-Thomas is quantified with the linear cross-entropy benchmarking (XEB) score, which compares the output distribution (in the Z-basis) of $M$ sample outputs $x$ to their quantum probabilities:

$$F_{XEB} =  \frac{2^n}{M} \sum_i^M | \bra{0} C \ket{x_i} |^2 - 1$$

As samples drawn noiselessly from the Porter-Thomas distribution have $F_{XEB} = 1$ and samples drawn from the (classical) uniform distribution have $F_{XEB} = 0$, a non-zero fidelity is evidence of quantum behavior.

A key detail is that XEB requires classical simulations for the outcome probabilities, hence can only be extrapolated for the full-depth circuit. The authors present arguments for why this can be extrapolated from smaller depth or less entangled circuits. XEB also is only close to state fidelity under assumptions of weak noise.

[Quantinuum's RCS experiments](https://journals.aps.org/prx/abstract/10.1103/PhysRevX.15.021052) also measure a proxy for fidelity, running a mirrored version of their circuit with half the depth and calculating the probability of return to the expected state (mirror fidelity).

### `Error detection`

To avoid the problem of vanishing fidelities with large circuits, we use the [spacetime error detection protocol](https://arxiv.org/pdf/2504.15725) to mitigate noise in our samples. As the graph state is prepared with Clifford gates, it is possible to augment the circuit with ancilla qubits and insert spacetime Pauli checks on their support at various depths. While these Pauli checks collectively stabilize the circuit, errors will not generally commute with these checks, manifesting as a "syndrome" error on the ancillas. These errored shots can be detected and post-selected out which, result in a $29 X$ increase over the bare unencoded state fidelity at the cost of an $860 X$ overhead in sampling.

With these spacetime Pauli checks, $T$ gates can not be arbitrarily placed, being restricted to locations in which they will simultaenously commute with all the stabilizers of the checks. In spite of this restriction, we find that a large number of $T$-gates remain available for the circuit sizes presented.

Our circuits are mapped onto a one dimensional chain with ancillas attached to exactly one data qubit. On IBM's Heron devices, which have the heavy-hex architecture, it is likely that every other qubit will have degree 3. This dense placement of ancillas enables effective error detection, and guarantees that the number of ancillas can scale with the size of the circuit.

<p align="center">
  <img width="594" height="483" alt="image" src="https://github.com/user-attachments/assets/1624d6ee-c943-4fb5-801a-9ad1fb3ac94c" />

<em>Figure 4. Physical layout for the 70 X 70 circuit (with 27 ancilla qubits) on IBM Boston, a Heron R3 device with heavy-hex architecture. The logical qubits (green) are arranged on a 1D chain with dangling ancilla qubits (red).</em>

</p>

### `Measuring Fidelity`

As the graph states can be prepared with high fidelity with error detection, it is efficient to use [direct fidelity estimation](https://journals.aps.org/prl/abstract/10.1103/PhysRevLett.106.230501). The fidelity for target state $\sigma$ and noisy output state $\rho$ can be approximated by randomly sampling the expectation values of $M$ random Paulis $P$:

$$F \approx \frac{1}{M} \sum_k^M \frac{\braket{P_k}_{\rho}}{\braket{P_k}_{\sigma}} $$

For stabilizer states, whose expectation values can be bounded, this requires only a constant shot overhead. Given the $O(1/\sqrt{M})$ scaling in uncertainty, we choose enough random stabilizers to bound the fidelity above 1% with 95% confidence.

For non-stabilizer states, expectation values can become arbitrarily small, which requires a commensurately large shot overhead. We argue, however, that the fidelity of the graph state is equivalent to the doped random graph state.

### `Verifiability with Logical Fault Analysis`

Under the following assumptions, we can construct a lower bound for the fidelity of any $T$-doped state relative to the undoped Clifford state:

- The undoped and doped states share the same gates, the only exception being the angle of $Z$ rotations. This angle toggles between $I$, $S$, $Z$ and $T$ gates.
- Noiseless $T$ gates. On IBM's devices, this is possible as $Z$ rotations are [virtually implemented](https://journals.aps.org/pra/abstract/10.1103/PhysRevA.96.022330) as zero width framechanges.
- Stochastic circuit-independent noise, i.e. Pauli noise that is not correlated to the structure of the circuit. Notably this noise does not have to be weak and can have strong correlations. To achieve this in experiment we employ Pauli twirling, or randomized compiling, on each of the $CZ$ gates individually.

In particular, with Pauli noise, we can characterize the fidelity of the doped circuit with the logical faults that occur on the Clifford circuit. To see this, note that, by construction, doping does not disturb the spacetime Pauli checks. This implies that our doping preserves the set of logical faults that are accepted or rejected. As they are also noiseless, the probability of no fault occurring is also identical.

Let us focus first on the Clifford circuit. When any accepted fault $E$ occurring in the circuit is forward propagated, it either is harmless, meaning it stabilizes the state, or is harmful, meaning it rotates the state outside the stabilizer group. The contribution to the fidelity from the state after fault $E$ is the L2-norm of its overlap with the original faultless state. Denote this $f_1(E)$, which takes value 1 for harmless faults $H$ and 0 for harmful faults $L$. (The full details of this proof can be found in Supplementary S2.2 in the paper.)

For the doped Clifford circuit, similarly define $f_2(E)$, which can now take on any value between 0 and 1 for harmless or harmful faults.

With probability of acceptance $p_{acc}$, the difference in fidelity between the undoped circuit $F_1$ and the doped circuit $F_2$ can be expressed as

$$ F*1 - F_2 = \frac{\sum*{E \in H \cup L }p(E) f*2(E)}{p*{acc}} - \frac{\sum*{E \in H \cup L} p(E) f_1(E)}{p*{acc}} = \frac{\sum*{E \in H} p(E)(f_2(E) - f_1(E))}{p*{acc}} + \frac{\sum*{E \in L} p(E)(f_2(E) - f_1(E))}{p*{acc}} $$

Using that $f_1(E) = 1$ for $E \in H$ and $f_1(E) = 0$ for $E \in L$

$$ F*1 - F_2 = \frac{\sum*{E \in H} p(E)(f*2(E) - 1)}{p*{acc}} + \frac{\sum*{E \in L} p(E)f_2(E)}{p\*{acc}} \geq -\frac{\sum*{E \in H} p(E)}{p\_{acc}} = -Pr(E \in H | E \in A) $$

where the bounds follow from the fact that only the first term can be negative.

Therefore, the drop in fidelity of any doped Clifford state (that commutes with the spacetime checks) can be bounded by the probability of an accepted fault in the undoped Clifford state being harmless.

<p align="center">
  <img width="319" height="311" alt="image" src="https://github.com/user-attachments/assets/f01f7a2e-26b1-45b6-bf22-ac8432bdfdd2" />

<em>Figure 5. Numerical simulations of the probability of harmless, accepted errors under a Pauli noise model at various strengths and polarizations. The maximum probability is 0.013(1).</em>

</p>

We can show that the probability of accepted faults being harmless is unlikely, having at least an inverse polynomial and at worst exponential dependence on $n$ (see Supplementary S2.3 in the paper). Moreover, in Figure 5. we conduct numerical simulations at various Pauli noise strengths and obtain that this drop is at most $\approx$ 1.3%. So, despite the fact that the fidelity of the doped Clifford state cannot be efficiently measured or simulated, we can obtain a lower bound just from (efficient) measurements of the Clifford state fidelity.

Provided that classical simulations fail to faithfully sample from our state, we can certify quantum advantage by showing that this lower bound is sufficently bounded above zero.

### `Confidence in Verifiability`

To build confidence in this experimentally, we can measure the state fidelity (or a proxy) and the post-selection rate and show that they do not degrade with $T$ count. One experiment compares different fidelity metrics across the entire range of doping:

- Regime 1: Zero $T$ gates, for which we use direct fidelity estimation.
- Regime 2: Small constant number $(\ll O(n))$ of $T$ gates, for which we also use direct fidelity estimation.
  - In this regime, there is still relatively low overhead in measuring the fidelity. Classical simulations are done to sample random Pauli observables in an unbiased manner and calculate the corresponding expectation values.
- Regime 3: $O(n)$ $T$ gates, for which we use XEB as a proxy for fidelity.
  - After $O(n)$ $T$ gates, the second moment converges closely to a Porter-Thomas distribution, making XEB a reasonable metric. The number of $T$ gates is chosen such that classical simulations are still tractable.

<p align="center">
  <img width="1020" height="442" alt="image" src="https://github.com/user-attachments/assets/6f56f8e9-8718-47ef-bf7a-16ed22bbb42d" />

<em>Figure 6. (a) Fidelity for the 70 X 70 circuit on IBM Boston with 0 doping and doping with T and S gates in the same 5, 75, and 468 locations (468 T fidelity is not directly measured), shown with normally approximated 95% confidence intervals. All differences in the values are consistent up to these confidence intervals. (b) The syndromes for each experiment show good agreement and no systematic dependence on T or S count. </em>

</p>

Additionally, the consistency between syndromes provides evidence that $T$ gates are noiseless (see Supplementary S2.1 in the paper).

Addendum: In Figure 6 the XEB is corrected for readout error.

For XEB, we assume that the probability distribution with readout error is uncorrelated with the ideal probability distribution, separate circuit fidelity $F$ into

$$F = F_{ideal}F_{readout}$$

where $F_{ideal}$ is the circuit fidelity with perfect readout error, and $F_{readout}$ is the fidelity of the readout (see supplementary by [Arute et. al](https://arxiv.org/pdf/1910.11333)). After readout error mitigation, each qubit should have symmetric 0 and 1 state error $p_i$, which yields

$$F_{readout} = \prod_{i=1}^{n} (1 - p_i)$$

which can be used to rescaled the XEB scores. In Figure 6, we additionally rescale by multiplying the [readout error mitigation](https://journals.aps.org/pra/abstract/10.1103/PhysRevA.105.032620) factor over random stabilizers.

## Institutions

IBM, University of Chicago
