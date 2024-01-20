document.addEventListener('DOMContentLoaded', function() {
    // Your code here
    document.getElementById('search-button').addEventListener('click', searchAnime);

    

    // search function
    async function searchAnime() {
        // Get the user input
        var searchQuery = document.getElementById('search-input').value.trim();

        // Check if the input is empty
        if (!searchQuery) {
            alert('Please enter a search query.');
            return;
        }

        // Construct the GraphQL query
        var query = `
            query ($search: String) {
                Page(page: 1, perPage: 10) {
                    media(search: $search, type: ANIME) {
                        id
                        title {
                            romaji
                        }
                        description
                        coverImage {
                            large
                        }
                    }
                }
            }
        `;

        // Define variables for the GraphQL query
        var variables = {
            search: searchQuery
        };

        // Make the GraphQL request
        try {
            var response = await fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: query,
                    variables: variables
                })
            });

            var data = await response.json();

            // Handle the response data and update the results container
            displayResults(data.data.Page.media);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function displayResults(results) {
        var resultsContainer = document.getElementById('results-container');

        // Clear previous results
        resultsContainer.innerHTML = '';

        // Check if there are any results
        if (results.length === 0) {
            resultsContainer.innerHTML = '<p>No results found.</p>';
            return;
        }

        // Loop through the results and create HTML elements for each
        results.forEach(anime => {
            var resultItem = document.createElement('div');
            resultItem.classList.add('result-item');
            resultItem.innerHTML = '<a href="/anime/' + anime.id + '"><img src="' + anime.coverImage.large + '" alt="' + anime.title.romaji + ' Cover" style="width: 100px; height: 100px;">' +
            '<h3>' + anime.title.romaji + '</h3></a>' +
            '<p>' + anime.description + '</p>';

            resultsContainer.appendChild(resultItem);
        });
    }
});
