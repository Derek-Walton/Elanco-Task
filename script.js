const table = document.querySelector('#table');

async function getCountriesAndCapital() {
  const response = await fetch('https://countriesnow.space/api/v0.1/countries/capital');
  if (!response.ok) {
    throw new Error(`Error occurred retrieving all countries. Status code: ${response.status}`);
  }
  const data = await response.json();

  // returns an array of each country and their capital + 2 and 3 letter long country codes
  return data.data;
}

async function getCountriesAndPopulation() {
  const response = await fetch('https://countriesnow.space/api/v0.1/countries/population/cities');
  if (!response.ok) {
    throw new Error(`Error occurred retrieving all countries. Status code: ${response.status}`);
  }
  const data = await response.json();

  console.log(data.data);

  // returns an array of every city and it's population count, country and (not all) the year the count was taken, it's value, it's reliability and if both sex's took part
  return data.data;
}

async function getFlag(countryName) {
  const response = await fetch('https://countriesnow.space/api/v0.1/countries/flag/images', {
    // specifies the api that json is being sent through the body
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      'country': countryName
    })
  })

  if (!response.ok) {
    throw new Error(`Error occurred retrieving ${countryName}'s flag. Status code: ${response.status}`)
  }
  const data = await response.json();
  const flagUrl = data.data.flag;
  
  return flagUrl;
}



getCountriesAndCapital();

// getFlag('nigeria');

// getCountriesAndPopulation();

// table plan
// country, flag, total population, capital, capital population