// Get DOM elements
const newsContainer = document.getElementById('news-container');
const newsHeading = document.getElementById('news-heading');
const navBtns = document.querySelectorAll('.nav-btn');

// Configuration
const config = {
    apiUrl: 'https://newsapi.org/v2/top-headlines',
    apiKey: 'e62325b0845b491db32dc98be4ae37cf',
    countries: ['us', 'il'],
    usSources: ['bbc-news', 'cnn', 'fox-news', 'the-new-york-times', 'the-washington-post', 'usa-today', 'abc-news', 'associated-press', 'reuters', 'the-wall-street-journal', 'google-news'],
    ilSources: ['ynet', 'walla-news', 'haaretz', 'calcalist', 'globes', 'mako', 'sport5', 'one', 'n12', 'news1', 'bizportal', 'themarker', 'channel13', 'israelhayom', 'jpost', 'google-news-il'],
    categories: ['general', 'business', 'entertainment', 'health', 'science', 'sports', 'technology']
};

// Get URL function
const getUrl = (query, isSearch = false, country, isHome) => {
    let sourceCountry = country === 'us' ? config.usSources.join(',') : config.ilSources.join(',');
    if (isSearch) {
        return `https://newsapi.org/v2/everything?q=${query}&sources=${sourceCountry}&sortBy=relevancy&apiKey=${config.apiKey}`;
    } else if (isHome) {
        return `https://newsapi.org/v2/everything?sources=${sourceCountry}&sortBy=publishedAt&apiKey=${config.apiKey}`
    } else {
        return `${config.apiUrl}?country=${country}&category=${query}&pageSize=100&apiKey=${config.apiKey}`;
    }
};

// Modify the getNews function to use getUrl
const getNews = (query, isSearch = false, isHome = false) => {
    newsContainer.innerHTML = '';
    config.countries.forEach(country => {
        const url = getUrl(query, isSearch, country, isHome);
        fetch(url)
            .then(response => response.json())
            .then(data => {
            newsContainer.scrollTo(0, 0);
            data.articles.forEach(article => {
                if (article.title === "[Removed]") {
                    return;
                } else if (article.title === null) return;
                if (article.urlToImage === null) {
                    article.urlToImage = "";
                };
                if (article.description === null) {
                    article.description = "";
                };
                if (article.author === null) {
                    article.author = "";
                };
                newsContainer.appendChild(createArticleDiv(article));
            });
            updateNewsHeading(query, isSearch, isHome);
            updateNavButtons(query);
            return data
        });
    });
};

// Create Article Div Function
const createArticleDiv = (article) => {
    const articleDiv = document.createElement('div');
    articleDiv.classList.add('article');
    articleDiv.innerHTML = `
        <a class="article-title" href="${article.url}" target="_blank">${article.title}</a>
        ${article.urlToImage ? `<img class="article-img" src="${article.urlToImage}" alt="${article.title}">` : ''}
        <p class="article-desc">${article.description}</p>
        <p class="article-author">By ${article.author ? article.author : 'Unknown'}</p>
        <p class="article-date">${new Date(article.publishedAt).toDateString()}</p>
    `;
    return articleDiv;
};

const updateNewsHeading = (category, isSearch, isHome) => {
    newsHeading.classList.toggle("category-border");
    if (isSearch) {
        newsHeading.innerHTML = 'Search Results: ' + category;
    } else if (isHome) {
        newsHeading.innerHTML = 'Welcome!';
    } else {
        newsHeading.innerHTML = category.charAt(0).toUpperCase() + category.slice(1) + ' News';
    };
    void newsHeading.offsetWidth;
    newsHeading.classList.toggle("category-border");
};

// Update Nav Buttons Function
const updateNavButtons = (category) => {
    navBtns.forEach(navBtn => {
        if (navBtn.id === `${category}-btn`) {
            navBtn.classList.add('nav-btn-active');
        } else {
            navBtn.classList.remove('nav-btn-active');
        };
    });
};

// Add Event Listeners
config.categories.forEach(category => {
    const btn = document.getElementById(`${category}-btn`);
    btn.addEventListener('click', () => getNews(category));
});

const logo = document.getElementById('logo');
logo.addEventListener('click', () => getNews("", false, true));

// Search news
const searchBtn = document.getElementById('search-btn');
const searchInput = document.getElementById('search-input');

searchBtn.addEventListener('click', () => {
    if (searchInput.value) {
        getNews(searchInput.value, true);
        searchInput.value = '';
    };
});

const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-theme');
});

// Keyboard controls
document.addEventListener('keydown', (event) => {
    const key = event.key; // "ArrowRight", "ArrowLeft", "Enter", etc.
    let activeBtnIndex = config.categories.findIndex(category => document.getElementById(`${category}-btn`).classList.contains('nav-btn-active'));

    switch (key) {
        case "ArrowRight":
            activeBtnIndex = (activeBtnIndex + 1) % config.categories.length;
            getNews(config.categories[activeBtnIndex]);
            break;
        case "ArrowLeft":
            activeBtnIndex = (activeBtnIndex - 1 + config.categories.length) % config.categories.length;
            getNews(config.categories[activeBtnIndex]);
            break;
        case "Enter":
            if (document.activeElement === searchInput && searchInput.value) {
                getNews(searchInput.value, true);
                searchInput.value = '';
            }
            break;
        default:
            break;
    }
});

// Initial News Fetch
getNews("", false, true);

