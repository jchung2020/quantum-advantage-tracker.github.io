const inputJsonString = process.argv[2];
const data = JSON.parse(inputJsonString);

if (data.circuit) {
  data.circuit = data.circuit[0];
}

if (data.hamiltonian) {
  data.hamiltonian = data.hamiltonian[0];
}

delete data.methodProof;

const numericFields = [
  'runtimeQuantum',
  'runtimeClassical',
  'observableValue',
  'errorBoundLow',
  'errorBoundHigh',
  'energy',
  'qubits',
  'gates',
];

for (const key of numericFields) {
  if (!(key in data)) continue;

  const parsedNumber = Number(data[key]);
  if (isNaN(parsedNumber)) {
    delete data[key];
  } else {
    data[key] = parsedNumber;
  }
}

const output = JSON.stringify({
  createdAt: process.env.ISSUE_CREATED_AT,
  url: process.env.ISSUE_URL,
  ...data,
});

console.log(output);
