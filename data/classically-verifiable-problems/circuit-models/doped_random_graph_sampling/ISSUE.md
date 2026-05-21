### Name

ibm_boston_drgs_nq70_depth70_checks27

### Circuit

doped_random_graph_sampling_nq70_depth70_checks27

### Value

0.26 (inferred from the graph state fidelity)

### Method

Quantum

### Method proof

We provide a summary of the doped random graph state sampling problem below, a more detailed writeup is available in the [circuit instance description](https://github.com/quantum-advantage-tracker/quantum-advantage-tracker.github.io/tree/main/data/classically-verifiable-problems/circuit-models/doped_random_graph_sampling).

## Doped Random Graph State Sampling

We present an experiment to demonstrate quantum advantage by sampling from T-doped random graph states in the Z-basis. We conjecture that this is average-case #P-hard, as has previously been shown for regular graphs measured in a random product basis<sup>1</sup>. While this bears similarities to random circuit sampling<sup>2</sup>, by preparing T-doped random graph states, we can:

1. Generate highly entangled states.
2. Employ spacetime error detection<sup>3</sup> to post-select errored shots and achieve high fidelities, even at large circuit widths and depths
3. Verify fidelity efficiently with direct fidelity estimation<sup>4</sup>, which requires fewer assumptions about the noise and does not extrapolate from smaller circuits, as for cross-entropy benchmarking (XEB)
4. Tune in and out of the classically verifiable regime by controlling the number of T gates used during the experiment

While we only measure the fidelity of the graph state, with Pauli twirling, the graph state and T-doped graph state process fidelities are equal up to first order in infidelity<sup>5</sup>. We also make use of the ability to toggle between the undoped and doped circuits with rotational Z gates, which are implemented on IBM's hardware as noiseless framechanges<sup>6</sup>.

An additional argument for verification relies on analyzing the rate of logical faults (see Section C `Verifiability with Logical Fault Rate` in the [circuit instance description](https://github.com/quantum-advantage-tracker/quantum-advantage-tracker.github.io/tree/main/data/classically-verifiable-problems/circuit-models/doped_random_graph_sampling)). As the inserted T gates commute with the spacetime Pauli checks and are implemented noiselessly, we expect the post-selection or acceptance rate to be equal in the undoped and doped cases.

T gates therefore can only change the probability that a previously harmless fault (commutes with the stabilizers) becomes harmful and vice versa. The difference in fidelity between the graph and T-doped graph states can be expressed as

$$ F*{graph} - F*{doped} = P*{graph}(harmless\ |\ accept) - P*{doped}(harmless\ |\ accept) \leq max(P(harmless\ |\ accept))$$

where we numerically show that $P(harmless\ |\ accept)$ is small. So, the graph state fidelity closely verifies a lower bound for the doped graph state fidelity.

<p align="center">
<img width="3680" height="1050" alt="image" src="https://github.com/user-attachments/assets/7d0666d7-6c3d-4245-b0e6-d5cf7686f670" />

<em>Figure 1. Stochastic Pauli fault simulations for the 70 X 70 circuit. The model includes global depolarizing noise, decoherence error (200 μs), and readout error. Left: The probability of acceptance decreases exponentially with error rate. Middle: For accepted shots, the probability of no fault occuring is exponentially suppressed with increasing noise, while the probability of harmless and harmful faults occurring increases. Right: Only a small systematic difference exists between the fidelities of the graph (Clifford) and doped graph states across all error rates.</em>

</p>

As tensor network contraction costs scale with the entanglement (Schmidt rank) of the graph state, and extended Clifford simulators scale with the non-stabilizerness (stabilizer rank), we claim that sampling is adversarial for exact or naïve classical simulations.

## Experimental Details and Results

We prepare a T-doped random graph state on a 70 X 70 circuit on IBM Boston. We equip the circuit with 27 ancilla qubits and perform spacetime error detection.

<p align="center">
  <img width="468" height="322" alt="Image" src="https://github.com/user-attachments/assets/52ca7570-b809-49aa-b528-40ff33ba2311" />

<em>Figure 2. Physical layout for the 70 X 70 circuit (with 27 ancilla qubits) on IBM Boston, a Heron R3 device with heavy-hex architecture. The logical qubits (green) are arranged on a 1D chain with dangling ancilla qubits (red).</em>

</p>

Properties:

- **Graph state fidelity: 0.26** (bounded above 0.036 with 95% confidence)
- Data qubits: [45, 37, 25, 24, 23, 22, 21, 36, 41, 42, 43, 56, 63, 62, 61, 76, 81, 82, 83, 96, 103, 104, 105, 106, 107, 97, 87, 88, 89, 78, 69, 70, 71, 58, 51, 50, 49, 38, 29, 30, 31, 32, 33, 39, 53, 54, 55, 59, 75, 74, 73, 79, 93, 92, 91, 98, 111, 110, 109, 118, 129, 128, 127, 126, 125, 124, 123, 136, 143, 144]
- Ancillas: [44, 26, 16, 40, 64, 60, 80, 84, 102, 117, 108, 86, 90, 68, 72, 52, 48, 28, 18, 34, 94, 112, 130, 137, 122, 142, 145]
- Lowest known Schmidt rank (graph state): $2^{30}$
- Lowest known Stabilizer rank: $2^{185.5}$
- Maximum number of nontrivial T gates: 468

To verify the fidelity of the graph state, we employ direct fidelity estimation and measure the expectation values of 120 random stabilizers.

<p align="center">
  <img width="752" height="530" alt="image" src="https://github.com/user-attachments/assets/b4d5a8bf-b659-4863-8cbd-2747ac1af9db" />
  
  <em>Figure 3. Fidelity for the 70 X 70 circuit on IBM Boston at various T-counts. For T-count=0,5 we utilize direct fidelity estimation with 120 randomly drawn Paulis, and for T-count=70,80 we measure the linear cross entropy of the resultant samples. After rescaling for readout error, we note no negative trend in fidelity is observed as T-count increases. </em>
</p>

<p align="center">
  <img width="1011" height="511" alt="image" src="https://github.com/user-attachments/assets/90562100-1b92-4274-a100-8c4607ad7d0e" />

<em>Figure 4. Post-selection rate for the 70 X 70 circuit on IBM Boston shows no dependence on T-count across the measured values. </em>

</p>

We do not directly measure the fidelity of the T-doped graph state. This is not efficient in general and, for direct fidelity estimation, would require exponentially many samples. As stated above, we instead infer the T-doped graph state fidelity to be equal to the graph state fidelity under the Pauli Twirling assumption and by analyzing logical faults.

## Classical Runtime Estimation

We estimate the runtime of two classical approaches, tensor networks (matrix product state) and extended stabilizer (Clifford + T) simulations.

For tensor networks, the entanglement is the most relevant challenge. To accurately represent a state, a bond dimension equivalent to the Schmidt rank is necessary. The contraction time is estimated for the 70 qubit circuit with increasing depth (max depth 24), with an estimated contraction time of $10^{25}$ seconds.

<p align="center">
  <img width="590" height="455" alt="image" src="https://github.com/user-attachments/assets/53d47789-5109-4678-995d-26dd1b5368dc" />

<em>Figure 5. Quimb matrix product state (MPS) contraction times for the 70 X 70 circuit with increasing depth (maximum depth 24). Linear extrapolation from a logarithmic plot of the data (R<sup>2</sup> > 0.98) yields a predicted contraction time of 10<sup>25</sup> seconds. </em>

</p>

For extended stabilizer simulations, the complexity scales with the non-stabilizerness of the state. We quantify this with the stabilizer rank, which depends exponentially on the size of the state. Simulations track the time to calculate one bitstring probability from 70 X 70 circuits with an increasing T-count (maximum 85). The estimated runtime is $10^{42}$ seconds.

<p align="center">
  <img width="570" height="476" alt="image" src="https://github.com/user-attachments/assets/1dea42a2-5c21-4ae4-b0d4-72f78d859e55" />

<em>Figure 6. Extended stabilizer simulation timing in quizx for 70 X 70 circuits with various T-counts (maximum 85). Linear extrapolation from a logarithmic plot of the data (R<sup>2</sup> > 0.98) yields a predicted time of 10<sup>42</sup> seconds to find the probability of one bitstring.</em>

</p>

## Classical Verification Task

The challenge for classical algorithms is to demonstrate strong simulation, either with the same fidelity in shorter time or with a higher fidelity in the same time as the quantum experiment. We propose three methods to verify that classical methods can adequately simulate random graph sampling:

1. Given that the T-doped graph state uses a maximum of $O(N^2)$ non-Clifford gates, it approximates a k-design<sup>7</sup> and is close to Haar-random. Therefore, the linear cross entropy benchmarking (XEB) score is a reasonable proxy for fidelity, given that the noise is weak and uncorrelated. We provide quantum samples for the 468 T-count instance below, for which one could show that a classical simulation produces an XEB score significantly larger than 0.036.
2. Alternatively, as in Zhao et. al's work on simulating random circuit sampling<sup>8</sup>, it also suffices to demonstrate that uncorrelated samples from the T-doped graph state can be produced with XEB score significantly larger than 0.036.
3. For classical simulations (e.g. tensor networks) for which it is equally difficult to represent the graph state and T-doped graph state, and for which conversion for the two can be done with small error, it would suffice to simulate the graph state, perform direct fidelity estimation, and demonstrate fidelity above 0.26.

Quantum Samples in the Z-basis (T-count of 468, 1174 bitstrings after post-selection):

- [samples_nq70_depth70_checks27_doped.npy.zip](https://github.com/user-attachments/files/28113279/samples_nq70_depth70_checks27_doped.npy.zip)
- (Bitstrings use Qiskit's little-endian notation)

## References

A detailed writeup can be found in the [circuit instance description](https://github.com/quantum-advantage-tracker/quantum-advantage-tracker.github.io/tree/main/data/classically-verifiable-problems/circuit-models/doped_random_graph_sampling).

1. [Ghosh, Hangleiter, Helsen. Random Regular Graph States are Complex at Almost Any Depth, PRX 2025](https://journals.aps.org/prxquantum/abstract/10.1103/52xz-3hpc)
2. [Arute et al. Quantum supremacy using a programmable superconducting processor, Nature 2019](https://www.nature.com/articles/s41586-019-1666-5)
3. [Martiel, Javadi-Abhari. Low-overhead error detection with spacetime codes, arXiv:2504.15725](https://arxiv.org/abs/2504.15725)
4. [Flammia, Liu. Direct Fidelity Estimation from Few Pauli measurements, PRA 2011](https://link.aps.org/doi/10.1103/PhysRevLett.106.230501)
5. [Merkel et al. When Clifford benchmarks are sufficient; estimating application performance with scalable proxy ](https://arxiv.org/pdf/2503.05943)[arXiv:2503.05943 ](https://arxiv.org/pdf/2503.05943)
6. [McKay et al. Efficient Z Gates for Quantum Computing, PRA 2018](https://link.aps.org/doi/10.1103/PhysRevA.96.022330)
7. [Leone et al. Non-Clifford Cost of Random Unitaries, arXiv:2505.10110](https://arxiv.org/pdf/2505.10110)
8. [Zhao et al. Leapfrogging Sycamore: Harnessing 1432 GPUs for 7× Faster Quantum Random Circuit Sampling, arXiv:2406.18889](https://arxiv.org/pdf/2406.18889)

### Authors

Ali Javadi-Abhari, Simon Martiel, Jay-U Chung, Alireza Seif, Soumik Ghosh

### Institutions

IBM, UChicago

### Quantum runtime (seconds)

18622

### Classical runtime (seconds)

10^25 (Quimb Matrix Product State)

10^25 (quizx Clifford + T)

### Compute resources (quantum)

IBM Heron R3

### Compute resources (classical)

Apple M1 Max 10 cores with 32 GB memory (Quimb), Intel Xeon Gold 6258R 28 cores with 1 TB memory (quizx Clifford + T)

### Notes

The reported classical runtimes are extrapolated.
