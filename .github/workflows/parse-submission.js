const inputJsonString = process.argv[2];
const data = JSON.parse(inputJsonString);

delete data.problemFiles;
delete data.problemCategory;
delete data.problemDescription;

if (Array.isArray(data.circuit)) {
  data.circuit = data.circuit[0];
}

if (Array.isArray(data.hamiltonian)) {
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

  const originalValue = data[key];
  const parsedNumber = Number(originalValue);
  if (isNaN(parsedNumber)) {
    delete data[key];
  } else {
    data[key] = originalValue.toLowerCase().includes('e')
      ? 'EXPONENTIAL_MARKER_' + parsedNumber.toExponential()
      : parsedNumber;
  }
}

const output = JSON.stringify({
  createdAt: process.env.ISSUE_CREATED_AT,
  url: process.env.ISSUE_URL,
  ...data,
}).replace(/"EXPONENTIAL_MARKER_(.*?)"/g, '$1');

console.log(output);
