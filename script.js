// Element selectors
const metricRadio = document.getElementById('metric');
const imperialRadio = document.getElementById('imperial');
const metricFields = document.querySelector('.input-fields.metric');
const imperialFields = document.querySelector('.input-fields.imperial');

const heightMetricInput = metricFields.querySelector('.height-num');
const weightMetricInput = metricFields.querySelector('.weight-num');

const [heightImperialFtInput, heightImperialInInput] =
  imperialFields.querySelectorAll('.height-num');
const [weightImperialStInput, weightImperialLbsInput] =
  imperialFields.querySelectorAll('.weight-num');

const emptyResult = document.querySelector('.empty');
const bmiResult = document.querySelector('.bmi-result');
const bmiNumber = bmiResult.querySelector('.bmi-number');
const bmiClassification = bmiResult.querySelector('.bmi-classification');
const bmiRange = bmiResult.querySelector('.bmi-range');

const HEALTHY_BMI_MIN = 18.5;
const HEALTHY_BMI_MAX = 24.9;

// Reset all input fields
function resetInputs() {
  [
    heightMetricInput,
    weightMetricInput,
    heightImperialFtInput,
    heightImperialInInput,
    weightImperialStInput,
    weightImperialLbsInput,
  ].forEach((input) => (input.value = ''));
}

// Reset BMI output
function resetResult() {
  bmiResult.classList.add('hidden');
  emptyResult.classList.remove('hidden');
  bmiNumber.textContent = '';
  bmiClassification.textContent = '';
  bmiRange.textContent = '';
}

// BMI Calculators
function calculateBmiMetric(heightCm, weightKg) {
  if (
    !heightCm ||
    !weightKg ||
    isNaN(heightCm) ||
    isNaN(weightKg) ||
    heightCm <= 0 ||
    weightKg <= 0
  )
    return null;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
}

function calculateBmiImperial(ft, inch, st, lbs) {
  const totalInches = ft * 12 + inch;
  const totalLbs = st * 14 + lbs;
  if (totalInches <= 0 || totalLbs <= 0) return null;
  return (totalLbs / (totalInches * totalInches)) * 703;
}

// Ideal Weight Ranges
function calculateIdealWeightMetric(heightCm) {
  const heightM = heightCm / 100;
  return {
    min: HEALTHY_BMI_MIN * heightM ** 2,
    max: HEALTHY_BMI_MAX * heightM ** 2,
  };
}

function calculateIdealWeightImperial(ft, inch) {
  const totalInches = ft * 12 + inch;
  const minLbs = (HEALTHY_BMI_MIN * totalInches ** 2) / 703;
  const maxLbs = (HEALTHY_BMI_MAX * totalInches ** 2) / 703;

  const toStLbs = (lbs) => ({
    st: Math.floor(lbs / 14),
    lbs: Math.round(lbs % 14),
  });

  const min = toStLbs(minLbs);
  const max = toStLbs(maxLbs);

  return {
    minStones: min.st,
    minPounds: min.lbs,
    maxStones: max.st,
    maxPounds: max.lbs,
  };
}

// Display BMI Result
function displayBmiResult(bmi, idealWeight) {
  let classification = '';
  if (bmi < 18.5) classification = 'underweight';
  else if (bmi <= 24.9) classification = 'a healthy weight';
  else if (bmi <= 29.9) classification = 'overweight';
  else classification = 'obese';

  bmiNumber.textContent = bmi.toFixed(1);
  bmiClassification.textContent = classification;

  if (metricRadio.checked && idealWeight) {
    bmiRange.textContent = `${idealWeight.min.toFixed(
      1
    )}kg - ${idealWeight.max.toFixed(1)}kg`;
  } else if (imperialRadio.checked && idealWeight) {
    bmiRange.textContent = `${idealWeight.minStones}st ${idealWeight.minPounds}lbs - ${idealWeight.maxStones}st ${idealWeight.maxPounds}lbs`;
  }

  emptyResult.classList.add('hidden');
  bmiResult.classList.remove('hidden');
}

// Handle input changes
function handleInputChange() {
  resetResult();

  if (metricRadio.checked) {
    const height = parseFloat(heightMetricInput.value);
    const weight = parseFloat(weightMetricInput.value);
    const bmi = calculateBmiMetric(height, weight);
    if (bmi) {
      const idealWeight = calculateIdealWeightMetric(height);
      displayBmiResult(bmi, idealWeight);
    }
  } else if (imperialRadio.checked) {
    const ft = parseInt(heightImperialFtInput.value) || 0;
    const inch = parseInt(heightImperialInInput.value) || 0;
    const st = parseInt(weightImperialStInput.value) || 0;
    const lbs = parseInt(weightImperialLbsInput.value) || 0;
    const bmi = calculateBmiImperial(ft, inch, st, lbs);
    if (bmi) {
      const idealWeight = calculateIdealWeightImperial(ft, inch);
      displayBmiResult(bmi, idealWeight);
    }
  }
}

// Radio switch handlers
metricRadio.addEventListener('change', () => {
  metricFields.classList.remove('hidden');
  imperialFields.classList.add('hidden');
  resetInputs();
  resetResult();
});

imperialRadio.addEventListener('change', () => {
  imperialFields.classList.remove('hidden');
  metricFields.classList.add('hidden');
  resetInputs();
  resetResult();
});

// Add input listeners
[
  heightMetricInput,
  weightMetricInput,
  heightImperialFtInput,
  heightImperialInInput,
  weightImperialStInput,
  weightImperialLbsInput,
].forEach((input) => input.addEventListener('input', handleInputChange));

// Initialize default view
metricRadio.checked = true;
imperialFields.classList.add('hidden');
