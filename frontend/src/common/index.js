export const maskAccountNumber = (accountNumber) => {
  if (typeof accountNumber != 'string' || accountNumber.length < 12) {
    return accountNumber;
  }

  const firstFour = accountNumber.substring(0, 4);
  const lastFour = accountNumber.substring(accountNumber.length - 4);

  const maskedDigit = '*'.replace(accountNumber.length - 8);

  return `${firstFour}${maskedDigit}${lastFour}`;
};

export const formatCurrency = (value) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (isNaN(value)) {
    //if d value sent is null
    return 'Invalid input';
  }

  const numberValue = typeof value === 'string' ? parseFloat(value) : value; //if it is sting convert it number

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: user?.currency || 'USD',
    minimumFractionDigits: 2,
  }).format(numberValue);
};

// ===============FUNCTIONS to fetch countries
export async function fetchCountries() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const data = await response.json();

    if (response.ok) {
      const countries = data.map((country) => {
        const currencies = country?.currencies || {};
        const currencyCode = Object.keys(currencies)[0];

        return {
          country: country.name?.common || '',
          flag: country.flags?.png || '',
          currency: currencyCode || '',
        };
      });

      // compare and sort alphabetically
      const sortedCountries = countries.sort((a, b) => {
        a.country.localeCompare(b.country);
      });

      return sortedCountries;
    } else {
      console.error(`Error:${data.message}`);
      return [];
    }
  } catch (error) {
    console.error('An error occured while fetching data', error);
    return [];
  }
}
