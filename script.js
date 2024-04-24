// News Buttons
const generalBtn = document.getElementById('general-btn');
const businessBtn = document.getElementById('business-btn');
const entertainmentBtn = document.getElementById('entertainment-btn');
const healthBtn = document.getElementById('health-btn');
const scienceBtn = document.getElementById('science-btn');
const sportsBtn = document.getElementById('sports-btn');
const technologyBtn = document.getElementById('technology-btn');

// News Container
const newsContainer = document.getElementById('news-container');

// News Heading
const newsHeading = document.getElementById('news-heading');

// API Key
const apiKey = 'e62325b0845b491db32dc98be4ae37cf';

// URL's Building Blocks
const apiUrl = 'https://newsapi.org/v2/top-headlines';
const countryIL = "country=us";
const countryUS = "country=us";
const apiKeyParam = `apiKey=${apiKey}`;
const categoryParam = "category=";
const categories = ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology'];
let category = 'general';
let url = `${apiUrl}?${countryIL}&${categoryParam}${category}&${apiKeyParam}`;

// Event Listeners
generalBtn.addEventListener('click', () => {
    getNews('general');
});

businessBtn.addEventListener('click', () => {
    getNews('business');
});

entertainmentBtn.addEventListener('click', () => {
    getNews('entertainment');
});

healthBtn.addEventListener('click', () => {
    getNews('health');
});

scienceBtn.addEventListener('click', () => {
    getNews('science');
});

sportsBtn.addEventListener('click', () => {
    getNews('sports');
});

technologyBtn.addEventListener('click', () => {
    getNews('technology');
});

// Get News Function
const getNews = (category) => {
    url = `${apiUrl}?${countryIL}&${categoryParam}${category}&${apiKeyParam}`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            newsHeading.innerHTML = category.charAt(0).toUpperCase() + category.slice(1) + ' News';
            newsContainer.scrollTo(0, 0);
            newsContainer.innerHTML = '';
            data.articles.forEach(article => {
                if (article.title === "[Removed]") {
                    return;
                };
                if (article.urlToImage === null) {
                    return;
                };
                const articleDiv = document.createElement('div');
                articleDiv.classList.add('article');
                articleDiv.innerHTML = `
                    <a class="article-title" href="${article.url}" target="_blank">${article.title}</a>
                    ${article.urlToImage ? `<img class="article-img" src="${article.urlToImage}" alt="${article.title}">` : ''}
                    <p class="article-desc">${article.description}</p>
                    <p class="article-author">By ${article.author ? article.author : 'Unknown'}</p>
                    <p class="article-date">${new Date(article.publishedAt).toDateString()}</p>
                `;
                newsContainer.appendChild(articleDiv);
                let articleHeight = articleDiv.scrollHeight;
                console.log(articleHeight);
            });
        });
};

getNews('general');
