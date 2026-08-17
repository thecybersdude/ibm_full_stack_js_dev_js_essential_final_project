const jsonUrl = './travel_recommendation_api.json';
let allData = null;

function loadData() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', jsonUrl, true);
    
    xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
            allData = JSON.parse(xhr.responseText);
            const container = document.getElementById('recommendations-container');
            const sectionTitle = document.getElementById('presentationHeader');
            if (container) container.innerHTML = '';
            if (sectionTitle) sectionTitle.style.display = 'none';
        } else {
            console.error(`Erreur HTTP : ${xhr.status}`);
        }
    };

    xhr.onerror = function () {
        console.error("Erreur réseau lors du chargement des données.");
    };

    xhr.send();
}

function handleSearch() {
    const searchInput = document.getElementById('travelInput');
    if (!searchInput || !allData) return;

    const keyword = searchInput.value.toLowerCase().trim();
    const presentationDiv = document.querySelector('.presentationDiv');
    const sectionTitle = document.getElementById('presentationHeader');

    if (sectionTitle) {
        sectionTitle.textContent = "Search Results";
        sectionTitle.style.display = 'block';
    }
    if (presentationDiv) presentationDiv.style.display = 'none';

    if (keyword === "") {
        const container = document.getElementById('recommendations-container');
        if (container) container.innerHTML = '';
        if (sectionTitle) sectionTitle.style.display = 'none';
        if (presentationDiv) presentationDiv.style.display = 'block';
        return;
    }

    let filteredResults = [];

    if (keyword.includes('beach') || keyword.includes('plage')) {
        filteredResults = allData.beaches || [];
    } 
    else if (keyword.includes('temple')) {
        filteredResults = allData.temples || [];
    } 
    else if (keyword === 'country' || keyword === 'countries' || keyword === 'pays') {
        if (allData.countries) {
            allData.countries.forEach(country => {
                if (country.cities) filteredResults.push(...country.cities);
            });
        }
    }
    else {
        let countryMatch = allData.countries ? allData.countries.find(c => c.name.toLowerCase() === keyword) : null;
        
        if (countryMatch && countryMatch.cities) {
            filteredResults = countryMatch.cities;
        } else {
            let globalList = [];
            if (allData.countries) {
                allData.countries.forEach(country => {
                    if (country.cities) globalList.push(...country.cities);
                });
            }
            if (allData.temples) globalList.push(...allData.temples);
            if (allData.beaches) globalList.push(...allData.beaches);

            filteredResults = globalList.filter(place => 
                (place.name && place.name.toLowerCase().includes(keyword)) || 
                (place.description && place.description.toLowerCase().includes(keyword))
            );
        }
    }

    displayRecommendations(filteredResults);
}

function handleClear() {
    const searchInput = document.getElementById('travelInput');
    if (searchInput) searchInput.value = "";
    
    const container = document.getElementById('recommendations-container');
    const presentationDiv = document.querySelector('.presentationDiv');
    const sectionTitle = document.getElementById('presentationHeader');
    
    if (container) container.innerHTML = '';
    if (sectionTitle) sectionTitle.style.display = 'none';
    if (presentationDiv) presentationDiv.style.display = 'block';
}

function displayRecommendations(recommendations) {
    const container = document.getElementById('recommendations-container');
    if (!container) return;

    if (!recommendations || recommendations.length === 0) {
        container.innerHTML = `<p class="no-results">Aucun résultat trouvé pour votre recherche.</p>`;
        return;
    }

    container.innerHTML = ''; 

    recommendations.forEach(place => {
        container.innerHTML += `
            <div class="travel-card">
                <img src="${place.imageUrl}" alt="${place.name}" class="travel-img">
                <div class="travel-info">
                    <h3 class="travel-place-name">${place.name}</h3>
                    <p class="travel-description">${place.description}</p>
                </div>
            </div>
        `;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadData();

    const searchButton = document.querySelector('.btn-search');
    if (searchButton) {
        searchButton.addEventListener('click', handleSearch);
    }

    const clearButton = document.querySelector('.btn-clear');
    if (clearButton) {
        clearButton.addEventListener('click', handleClear);
    }
});
