import express from "express"
import axios from "axios"

import ejs from "ejs"


const app = express();
const PORT = 3000;
app.use(express.static("public"))
import { dirname } from "path";
import { fileURLToPath } from "url";
import sanitize from "sanitize-html";
const __dirname = dirname(fileURLToPath(import.meta.url));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');



app.get("/", async (req, res) => {
    res.render("index")
})
let globalPage;
// Set up a route to serve the anime list with pagination
app.get('/animes', async (req, res) => {
    try {
        // Get the page number from the query parameters, default to 1
        const page = parseInt(req.query.page) || 1;
        globalPage = page;

        // Fetch anime list from AniList API with pagination
        const response = await axios.post('https://graphql.anilist.co', {
            query: `
                query ($page: Int, $perPage: Int) {
                    Page(page: $page, perPage: $perPage) {
                        pageInfo {
                            total
                            perPage
                            currentPage
                            lastPage
                            hasNextPage
                        }
                        media(type: ANIME) {
                            id
                            title {
                                romaji
                            }
                            coverImage {
                                large
                            }
                        }
                    }
                }
            `,
            variables: {
                page: page,
                perPage: 18 // Adjust perPage as needed
            }
        });

        const animeList = response.data.data.Page.media;
        const pageInfo = response.data.data.Page.pageInfo;

        res.render('animes', { animeList, pageInfo, GetCoverImage });
    } catch (error) {
        console.error('Error fetching anime list:', error.message);
        res.render('error', { message: 'Error fetching anime list. Please try again later.' });
    }
});

// Set up a route to serve detailed information for a specific anime
app.get('/anime/:id', async (req, res) => {
    const animeId = parseInt(req.params.id);

    try {
        // Fetch detailed information for the selected anime
        const response = await axios.post('https://graphql.anilist.co', {
            query: `
            query ($id: Int) {
                Media(id: $id, type: ANIME) {
                    id
                    
                    title {
                        romaji
                        english
                        native
                    }
                    description
                    coverImage {
                        large
                    }
                    bannerImage
                    status
                    episodes
                    duration
                    season
                    startDate {
                        year
                        month
                        day
                    }
                    endDate {
                        year
                        month
                        day
                    }
                    format
                    genres
                    averageScore
                    popularity
                    source
                    studios {
                        nodes {
                            name
                        }
                    }
                    relations {
                        edges {
                            relationType
                            node {
                                id
                                title {
                                    romaji
                                }
                            }
                        }
                    }
                    characters {
                        nodes {
                            id
                            name {
                                full
                            }
                        }
                    }
                    staff {
                        nodes {
                            id
                            name {
                                full
                            }
                        }
                    }
                    recommendations {
                        nodes {
                            mediaRecommendation {
                                id
                                title {
                                    romaji
                                }
                            }
                        }
                    }
                    externalLinks {
                        url
                        site
                    }
                }
            }
            
            `,
            variables: {
                id: animeId
            }
        });

        const anime = response.data.data.Media;
        

        if (anime) {
            res.render('animeDetails', { anime , Page:globalPage });
        } else {
            res.render('error', { message: 'Anime not found.' });
        }
    } catch (error) {
        console.error('Error fetching anime details:', error.message);
        res.render('error', { message: 'Error fetching anime details. Please try again later.' });
    }
});
var GetCoverImage = function getCoverImage(anime) {
    
    return anime.coverImage ? anime.coverImage.large : 'https://via.placeholder.com/150'; // Replace with a default image URL
}




// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});