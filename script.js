const table = document.querySelector('#table');

// API Requests

async function getCountriesAndCapital() {
  const response = await fetch(
    'https://countriesnow.space/api/v0.1/countries/capital'
  );
  if (!response.ok) {
    throw new Error(
      `Error occurred retrieving all countries. Status code: ${response.status}`
    );
  }
  const data = await response.json();

  // returns an array of each country and their capital + 2 and 3 letter long country codes
  return data.data;
}

// getCountriesAndCapital();

async function getCountriesAndPopulation() {
  const response = await fetch(
    'https://countriesnow.space/api/v0.1/countries/population/cities'
  );
  if (!response.ok) {
    throw new Error(
      `Error occurred retrieving all countries. Status code: ${response.status}`
    );
  }
  const data = await response.json();

  // returns an array of every city and it's population count, country and (not all) the year the count was taken, it's value, it's reliability and if both sex's took part
  return data.data;
}

// getCountriesAndPopulation();

async function getCountryFlag(countryName) {
  const response = await fetch(
    'https://countriesnow.space/api/v0.1/countries/flag/images',
    {
      // specifies the api that json is being sent through the body
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        country: countryName,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error occurred retrieving ${countryName}'s flag. Status code: ${response.status}`
    );
  }
  const data = await response.json();
  const flagUrl = data.data.flag;

  return flagUrl;
}

// getCountryFlag('nigeria');

// Additional API Request

async function getCountryPopulation(countryName) {
  const response = await fetch(
    'https://countriesnow.space/api/v0.1/countries/population',
    {
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        country: countryName,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `Error occurred retrieving ${countryName}'s population. Status code: ${response.status}`
    );
  }
  const data = await response.json();
  const population = data.data.populationCounts;

  // returns an array of all the population counts for the country (highest index being the newest count)
  return population;
}

// getCountryPopulation('nigeria');

// Creating and Inserting Data to the document

async function createTableRows() {
  const countries = await getCountriesAndCapital();
  let rowColourFlag = false;
  for (const country of countries) {
    const tableRow = document.createElement('tr');

    const countryElem = document.createElement('td');
    countryElem.textContent = emptyFieldCheck(country.name, 'Country Name');

    const flagElem = document.createElement('td');

    try {
      const countryFlagUrl = await getCountryFlag(country.name);

      const flagImg = document.createElement('img');

      flagImg.src = countryFlagUrl;
      flagImg.alt = `${country}'s Flag`;
      flagImg.classList.add('flag');
      flagElem.append(flagImg);
    } catch (error) {
      flagElem.textContent = 'N/A';
    }

    const totalPopulationElem = document.createElement('td');
    const totalPopulationYearElem = document.createElement('td');

    try {
      const countryPopulation = await getCountryPopulation(country.name);

      const newestPopulationValue =
        countryPopulation[countryPopulation.length - 1].value;
      const newestPopulationYear =
        countryPopulation[countryPopulation.length - 1].year;

      totalPopulationElem.textContent = emptyFieldCheck(
        formatNumber(newestPopulationValue),
        'Population Count'
      );
      totalPopulationYearElem.textContent = emptyFieldCheck(
        newestPopulationYear,
        'Population Year'
      );
    } catch (error) {
      totalPopulationElem.textContent = 'N/A';
      totalPopulationYearElem.textContent = 'N/A';
    }

    const countryCapitalElem = document.createElement('td');
    countryCapitalElem.textContent = country.capital;

    // Class styling below

    const elems = [countryElem, flagElem, totalPopulationElem, totalPopulationYearElem, countryCapitalElem];
    
    for (const elem of elems) {
      if (rowColourFlag) {
        elem.classList.add('row-colour-1');
      } else {
        elem.classList.add('row-colour-2');
      }
    }

    tableRow.append(
      countryElem,
      flagElem,
      totalPopulationElem,
      totalPopulationYearElem,
      countryCapitalElem
    );
    table.append(tableRow);

    rowColourFlag = !rowColourFlag
  }
}

// Additional Functions

// Fills empty cells incase data is missing
function emptyFieldCheck(name, field = 'data') {
  if (!name) {
    return `N/A: Missing ${field}`;
  }
  return name;
}

// Adds comma's to numbers
function formatNumber(num) {
  return num.toLocaleString();
}

createTableRows();

// table plan
// country, flag, total population, population year, capital

// For future reference
// Areas of improvement:
//    Segmenting my code for easier de-bugging, maintainability and readability
//    Adding more useful country data, e.g. a button to click for a modal that displayed city info (city population etc), capital population
//    Creating a filtering system to filter by population, alphabetical (current default), capital city etc
//    (Out of my current scope) - Implement local storage so save on excessive api calls
//    Having a more efficient api request, (e.g. 1 request per country max)
