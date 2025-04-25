const dayInputEl = document.getElementById("day");
const monthInputEl = document.getElementById("month");
const yearInputEl = document.getElementById("year");
const buttonEl = document.getElementById("button");
const yearsResultEl = document.getElementById("years-result");
const monthsResultEl = document.getElementById("months-result");
const daysResultEl = document.getElementById("days-result");

const getValuesFromInputs = (dayInput, monthInput, yearInput) => {
  if (
    dayInput.value === "" ||
    monthInput.value === "" ||
    yearInput.value === ""
  ) {
    if (dayInput.value === "") {
      styleErrors(dayInput, "This field is required");
    }
    if (monthInput.value === "") {
      styleErrors(monthInput, "This field is required");
    }
    if (yearInput.value === "") {
      styleErrors(yearInput, "This field is required");
    }
    clearAllResults();
  }

  let values = [];
  values.push(dayInput.value);
  values.push(monthInput.value);
  values.push(yearInput.value);
  return values;
};

const styleErrors = (inputEl, errorMessage) => {
  inputEl.nextElementSibling.textContent = errorMessage;
  inputEl.previousElementSibling.style.color = "var(--red-400)";
  inputEl.style.borderColor = "var(--red-400)";
};

const clearErrors = (inputEl) => {
  inputEl.nextElementSibling.textContent = "";
  inputEl.previousElementSibling.style.color = "var(--grey-400)";
  inputEl.style.borderColor = "var(--grey-200)";
};

const clearAllErrors = () => {
  clearErrors(dayInputEl);
  clearErrors(monthInputEl);
  clearErrors(yearInputEl);
};

const clearAllResults = () => {
  yearsResultEl.textContent = "--";
  monthsResultEl.textContent = "--";
  daysResultEl.textContent = "--";
};

const clearAllInputs = () => {
  dayInputEl.value = "";
  monthInputEl.value = "";
  yearInputEl.value = "";
};

const clearAll = () => {
  clearAllErrors();
  clearAllResults();
  clearAllInputs();
};

const calculateAge = () => {
  const [day, month, year] = getValuesFromInputs(
    dayInputEl,
    monthInputEl,
    yearInputEl
  );

  const inputDay = parseInt(day);
  const inputMonth = parseInt(month);
  const inputYear = parseInt(year);

  const isEmpty = isNaN(inputDay) || isNaN(inputMonth) || isNaN(inputYear);
  const isValidDayAndMonth =
    inputDay < 1 || inputDay > 31 || inputMonth < 1 || inputMonth > 12;

  if (isValidDayAndMonth) {
    if (inputDay < 1 || inputDay > 31) {
      styleErrors(dayInputEl, "Must be a valid day");
    }
    if (inputMonth < 1 || inputMonth > 12) {
      styleErrors(monthInputEl, "Must be a valid month");
    }
  }

  const birthDate = new Date(inputYear, inputMonth - 1, inputDay);
  const todaysDate = new Date();

  const isNotValidDate =
    isNaN(birthDate.getTime()) ||
    birthDate.getFullYear() !== inputYear ||
    birthDate.getMonth() !== inputMonth - 1 ||
    birthDate.getDate() !== inputDay;

  if (isNotValidDate) {
    styleErrors(dayInputEl, "Must be a valid date");
  }

  const isFutureDate = birthDate > todaysDate;

  if (isFutureDate) {
    styleErrors(yearInputEl, "Must be in the past");
  }

  if (isEmpty || isValidDayAndMonth || isNotValidDate || isFutureDate) {
    clearAllResults();
    return;
  }

  let ageYears = todaysDate.getFullYear() - birthDate.getFullYear();
  let ageMonths = todaysDate.getMonth() - birthDate.getMonth();
  let ageDays = todaysDate.getDate() - birthDate.getDate();

  if (ageDays < 0) {
    ageMonths--;
    let daysInLastMonth = new Date(
      todaysDate.getFullYear(),
      todaysDate.getMonth(),
      0
    ).getDate();
    ageDays += daysInLastMonth;
  }

  if (ageMonths < 0) {
    ageYears--;
    ageMonths += 12;
  }

  return [ageDays, ageMonths, ageYears];
};

const renderResult = () => {
  const resultValues = calculateAge();

  if (resultValues && resultValues.length === 3) {
    daysResultEl.textContent = resultValues[0];
    monthsResultEl.textContent = resultValues[1];
    yearsResultEl.textContent = resultValues[2];
  }
};

buttonEl.addEventListener("click", () => renderResult());

[dayInputEl, monthInputEl, yearInputEl].forEach((input) => {
  input.addEventListener("input", () => clearErrors(input));
});
