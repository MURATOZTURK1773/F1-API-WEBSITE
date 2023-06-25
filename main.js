const apiUrl = 'http://ergast.com/api/f1/2008/driverStandings.json';
let collection = [];
let favorites = [];
let sortAscending = true;

async function fetchData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const driversArray = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
    collection = driversArray;
    loadFavorites();
    displayData(collection, 'data-list');
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayData(data, containerId) {
  const dataList = document.getElementById(containerId);
  dataList.innerHTML = '';

  const heading = document.createElement('h3');
  heading.textContent = 'The Collection'; 
  dataList.appendChild(heading);

  const driverStandings = data.filter(driver => !isDriverInFavorites(driver));

  let totalPoints = 0;
  
  driverStandings.forEach(driver => {
    const listItem = document.createElement('li');
    const divElement = document.createElement('div');

    const driverName = `${driver.Driver.givenName} ${driver.Driver.familyName}`;
    const points = Number(driver.points);
    const wins = driver.wins;
    const position = driver.position;
    const nationality = driver.Driver.nationality;

    listItem.textContent = driverName;
    divElement.textContent = `Points: ${points} | Wins: ${wins} | Position: ${position} | Nationality: ${nationality}`;

    listItem.appendChild(divElement);

    const addButton = document.createElement('button');
    addButton.textContent = 'Add to Favorites';
    addButton.addEventListener('click', () => addToFavorites(driver));
    listItem.appendChild(addButton);

    dataList.appendChild(listItem);

    totalPoints += points
  });
  const totalPointsElement = document.createElement('p');//
  totalPointsElement.textContent = `Total Points: ${totalPoints}`;//
  dataList.appendChild(totalPointsElement);//
}

function addToFavorites(driver) {
  favorites.push(driver);
  saveFavorites();
  displayFavorites();
  removeDriverFromCollection(driver);
}

function removeDriverFromCollection(driver) {
  const index = collection.findIndex(
    item => item.Driver.driverId === driver.Driver.driverId);
  if (index > -1) {
    collection.splice(index, 1);
    displayData(collection, 'data-list');
  }
}

function displayFavorites() {
  const favoritesList = document.getElementById('favorites-list');
  favoritesList.innerHTML = '';

  const heading = document.createElement('h3');
  heading.textContent = 'Favorites';
  favoritesList.appendChild(heading);

  let totalPoints = 0;

  favorites.forEach(driver => {
    const listItem = document.createElement('li');
    const divElement = document.createElement('div');//
    listItem.textContent = `${driver.Driver.givenName} ${driver.Driver.familyName}`;

    const points = Number(driver.points);//
    const wins = driver.wins;//
    const position = driver.position;//
    const nationality = driver.Driver.nationality;//

    divElement.textContent = `Points: ${points} | Wins: ${wins} | Position: ${position} | Nationality: ${nationality}`;//

    listItem.appendChild(divElement);//

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', () => removeFromFavorites(driver));
    listItem.appendChild(removeButton);

    favoritesList.appendChild(listItem);
    totalPoints += points;
  });
  const totalPointsElement = document.createElement('p');//
  totalPointsElement.textContent = `Total Points: ${totalPoints}`;//
  favoritesList.appendChild(totalPointsElement);//
}

function removeFromFavorites(driver) {
  const index = favorites.findIndex(
    favorite => favorite.Driver.driverId === driver.Driver.driverId
  );
  if (index > -1) {
    favorites.splice(index, 1);
    saveFavorites();
    displayFavorites();
    addDriverToCollection(driver);
  }
}

function addDriverToCollection(driver) {
  collection.push(driver);
  sortCollection(collection);
  displayData(collection, 'data-list');
}

function saveFavorites() {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function loadFavorites() {
  const savedFavorites = localStorage.getItem('favorites');
  if (savedFavorites) {
    favorites = JSON.parse(savedFavorites);
    displayFavorites();
    collection = collection.filter(driver => !isDriverInFavorites(driver));
    displayData(collection, 'data-list');
  }
}

function isDriverInFavorites(driver) {
  return favorites.some(favorite => favorite.Driver.driverId === driver.Driver.driverId);
}

function toggleSortOrder() {
  sortAscending = true;
  sortCollection(collection);
  sortFavorites();
  displayData(collection, 'data-list');
}

function toggleReverseSortOrder() {
  sortAscending = false;
  sortCollection(collection);
  sortFavorites();
  displayData(collection, 'data-list');
}

function sortCollection(data) {
  data.sort((a, b) => {
    const nameA = `${a.Driver.givenName} ${a.Driver.familyName}`;
    const nameB = `${b.Driver.givenName} ${b.Driver.familyName}`;
    return sortAscending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });
}

function sortFavorites() {
  favorites.sort((a, b) => {
    const nameA = `${a.Driver.givenName} ${a.Driver.familyName}`;
    const nameB = `${b.Driver.givenName} ${b.Driver.familyName}`;
    return sortAscending ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
  });
  displayFavorites();
}

const toggleSortButton = document.getElementById('toggle-sort-button');
toggleSortButton.addEventListener('click', toggleSortOrder);

window.addEventListener('load', () => {
  fetchData();
  loadFavorites();
});

const toggleReverseSortButton = document.getElementById('toggle-reverse-sort-button');
toggleReverseSortButton.addEventListener('click', toggleReverseSortOrder);
