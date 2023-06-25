const apiUrl = 'https://ergast.com/api/f1/2008/driverStandings.json';
let collection = [];
let favorites = [];
let sortAscending = true;

async function fetchData() {
    try {
      const loadingIndicator = document.getElementById('loading-indicator');
      loadingIndicator.style.display = 'block';

      const response = await fetch(apiUrl);
      const data = await response.json();
      const driversArray = data.MRData.StandingsTable.StandingsLists[0].DriverStandings;
      collection = driversArray;
      loadFavorites();
      displayData(collection, 'data-list');

      loadingIndicator.style.display = 'none';
    } catch (error) {
      console.error('Error:', error);
    }
  }

const McLaren = 'https://cdn.playbuzz.com/cdn/c8460192-b0d5-4db1-8b90-1dbc1a5961a2/b0e3734b-7101-4475-81f8-0dbeb6583887.jpg';
const ToroRosso = 'https://cdn.playbuzz.com/cdn/c8460192-b0d5-4db1-8b90-1dbc1a5961a2/b5ee3bbc-2568-473b-9a0a-2b519cabec7e.jpg';
const Toyota = 'https://cdn.playbuzz.com/cdn/c8460192-b0d5-4db1-8b90-1dbc1a5961a2/d484d66a-69ce-4007-8624-00a8034a7d76.jpg';
const RedBull = 'https://cdn.playbuzz.com/cdn/c8460192-b0d5-4db1-8b90-1dbc1a5961a2/74373cd8-b156-4381-85ab-1ba930cfaa3f.jpg';
const Honda = 'https://cdn.playbuzz.com/cdn/c8460192-b0d5-4db1-8b90-1dbc1a5961a2/d484d66a-69ce-4007-8624-00a8034a7d76.jpg';
const Williams = 'https://cdn.playbuzz.com/cdn/c8460192-b0d5-4db1-8b90-1dbc1a5961a2/ec489b7f-b592-48d7-8681-b05e05b059c5.jpg';
const ForceIndia = 'https://cdn.playbuzz.com/cdn/c8460192-b0d5-4db1-8b90-1dbc1a5961a2/e7d94a1e-96df-4b89-a3d5-6ae2eb3508ac.jpg';
const SuperAguri = 'https://cdn.playbuzz.com/cdn/c8460192-b0d5-4db1-8b90-1dbc1a5961a2/7a3a67f4-fef4-4c1f-86df-70d70eaf29de.jpg';
const BMWSauber = 'https://cdn.playbuzz.com/cdn/c8460192-b0d5-4db1-8b90-1dbc1a5961a2/9f8a4962-98ac-41cd-93cf-92b9d4d3de5d.jpg';
const Ferrari = 'https://cdn.playbuzz.com/cdn/c8460192-b0d5-4db1-8b90-1dbc1a5961a2/8039874a-6fc4-4b29-9c7a-9197d6f92838.jpg';
const Renault = 'https://cdn.playbuzz.com/cdn/c8460192-b0d5-4db1-8b90-1dbc1a5961a2/65065b60-d436-4e4e-84c5-a246274c9bbf.jpg';

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
    const team = driver.Constructors[0].constructorId;

    listItem.textContent = driverName;
    divElement.textContent = `Points: ${points} | Wins: ${wins} | Position: ${position} | Nationality: ${nationality}`;

    const teamButton = document.createElement('button');
    teamButton.textContent = 'Team Logo';
    teamButton.addEventListener('click', () => toggleBackgroundImage(listItem, team));

    listItem.appendChild(divElement);
    listItem.appendChild(teamButton);

    const addButton = document.createElement('button'); 
    addButton.textContent = 'Add to Favorites';
    addButton.addEventListener('click', () => addToFavorites(driver));
    listItem.appendChild(addButton);


    dataList.appendChild(listItem);
    totalPoints += points;
  });
  const totalPointsElement = document.createElement('p');
  totalPointsElement.textContent = `Total Points: ${totalPoints}`;
  dataList.appendChild(totalPointsElement);
}

function toggleBackgroundImage(listItem, team) {
  const teamImages = {
    mclaren: McLaren,
    toro_rosso: ToroRosso,
    toyota: Toyota,
    red_bull: RedBull,
    honda: Honda,
    williams: Williams,
    force_india: ForceIndia,
    super_aguri: SuperAguri,
    bmw_sauber: BMWSauber,
    ferrari: Ferrari,
    renault: Renault
  };

  const backgroundImageUrl = teamImages[team];
  
  if (listItem.style.backgroundImage) {
    listItem.style.backgroundImage = '';
    listItem.style.width = '';
    listItem.style.height = '';
    listItem.querySelector('div').style.opacity = '';
  } else {
    listItem.style.backgroundImage = `url(${backgroundImageUrl})`;
    listItem.style.backgroundSize = '150px 70px';
    listItem.style.width = '-webkit-fill-available';
    listItem.style.height = 'fit-content';
    listItem.querySelector('div').style.opacity = '0';
  }
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
    const team = driver.Constructors[0].constructorId;

    divElement.textContent = `Points: ${points} | Wins: ${wins} | Position: ${position} | Nationality: ${nationality}`;//

    listItem.appendChild(divElement);//

    const teamButton = document.createElement('button');
    teamButton.textContent = 'Team Logo';
    teamButton.addEventListener('click', () => toggleBackgroundImage(listItem, team));

    listItem.appendChild(teamButton);

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
