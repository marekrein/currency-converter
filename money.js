const fromSelector = document.querySelector('[name="from_currency"]');
const fromInput = document.querySelector('[name="from_amount"]');
const toSelector = document.querySelector('[name="to_currency"]');
const toAmount = document.querySelector(".to_amount");
const form = document.querySelector(".app form");
const endPoint = "https://api.exchangeratesapi.io/latest";
const ratesByBase = {};
const currencies = {
  USD: "United States Dollar",
  AUD: "Australian Dollar",
  BGN: "Bulgarian Lev",
  BRL: "Brazilian Real",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  CZK: "Czech Republic Koruna",
  DKK: "Danish Krone",
  GBP: "British Pound Sterling",
  HKD: "Hong Kong Dollar",
  HRK: "Croatian Kuna",
  HUF: "Hungarian Forint",
  IDR: "Indonesian Rupiah",
  ILS: "Israeli New Sheqel",
  INR: "Indian Rupee",
  JPY: "Japanese Yen",
  KRW: "South Korean Won",
  MXN: "Mexican Peso",
  MYR: "Malaysian Ringgit",
  NOK: "Norwegian Krone",
  NZD: "New Zealand Dollar",
  PHP: "Philippine Peso",
  PLN: "Polish Zloty",
  RON: "Romanian Leu",
  RUB: "Russian Ruble",
  SEK: "Swedish Krona",
  SGD: "Singapore Dollar",
  THB: "Thai Baht",
  TRY: "Turkish Lira",
  ZAR: "South African Rand",
  EUR: "Euro",
};

function generateOptions(options) {
  return Object.entries(options)
    .map(
      ([currencyCode, currencyName]) =>
        `<option value="${currencyCode}">${currencyCode} - ${currencyName}</option>`
    )
    .join("");
}

async function fetchRates(base = "USD") {
  const res = await fetch(`${endPoint}?base=${base}`);
  const rates = await res.json();
  return rates;
}

async function convert(amount, from, to) {
  if (!ratesByBase[from]) {
    console.log(`we dont have ${from} to convert ${to}. Lets get it! `);
    const rates = await fetchRates(from);
    ratesByBase[from] = rates;
  }
  const rate = ratesByBase[from].rates[to];
  const convertedAmount = rate * amount;
  return convertedAmount;
}

const optionsHtml = generateOptions(currencies);
fromSelector.innerHTML = optionsHtml;
toSelector.innerHTML = optionsHtml;

function formatCurrency(amount, currency) {
  return Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

async function handleInput(e) {
  console.log(e.target);
  console.log(e.currentTarget);
  const rawAmount = await convert(
    fromInput.value,
    fromSelector.value,
    toSelector.value
  );
  toAmount.textContent = formatCurrency(rawAmount, toSelector.value);
}

form.addEventListener("input", handleInput);
