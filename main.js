// Load movies from GitHub
async function loadMovies() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/yourusername/yourrepo/main/data/movies.json');
        const movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        console.error('Error loading movies:', error);
    }
}

// Display movies on the page
function displayMovies(movies) {
    const container = document.getElementById('movies-container');
    container.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'movie-card';
        movieCard.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span>${movie.year}</span>
                    <span>${movie.rating}/10</span>
                </div>
            </div>
        `;
        
        movieCard.addEventListener('click', () => {
            window.location.href = `movie.html?id=${movie.id}`;
        });
        
        container.appendChild(movieCard);
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
        loadMovies();
    } else if (window.location.pathname.includes('movie.html')) {
        loadMovieDetails();
    }
});

// Load individual movie details
async function loadMovieDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const movieId = urlParams.get('id');
    
    if (!movieId) {
        window.location.href = '/';
        return;
    }
    
    try {
        const response = await fetch('https://raw.githubusercontent.com/yourusername/yourrepo/main/data/movies.json');
        const movies = await response.json();
        const movie = movies.find(m => m.id == movieId);
        
        if (!movie) {
            window.location.href = '/';
            return;
        }
        
        displayMovieDetails(movie);
    } catch (error) {
        console.error('Error loading movie details:', error);
    }
}

// Display movie details
function displayMovieDetails(movie) {
    document.title = `${movie.title} | DarkFlix`;
    
    const poster = document.querySelector('.movie-poster-large');
    const title = document.querySelector('.movie-detail-title');
    const meta = document.querySelector('.movie-detail-meta');
    const overview = document.querySelector('.movie-detail-overview');
    
    poster.src = movie.poster;
    poster.alt = movie.title;
    title.textContent = movie.title;
    
    meta.innerHTML = `
        <span>${movie.year}</span>
        <span>${movie.runtime} min</span>
        <span>${movie.rating}/10</span>
    `;
    
    overview.textContent = movie.overview;
    
    // Setup streaming/download toggle
    const toggleBtn = document.querySelector('.stream-toggle');
    const streamLinks = document.querySelector('.stream-links');
    
    toggleBtn.addEventListener('click', () => {
        streamLinks.classList.toggle('active');
        
        if (streamLinks.classList.contains('active')) {
            populateStreamLinks(movie);
        }
    });
}

// Populate streaming/download links based on device
function populateStreamLinks(movie) {
    const streamLinks = document.querySelector('.stream-links');
    streamLinks.innerHTML = '';
    
    // Detect device type
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    let deviceType = 'pc';
    
    if (/android/i.test(userAgent)) {
        deviceType = 'android';
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        deviceType = 'ios';
    }
    
    // Add appropriate links
    if (deviceType === 'android') {
        // Android - VLC intent link
        const androidLink = document.createElement('a');
        androidLink.href = `intent:${movie.streamUrl}#Intent;package=org.videolan.vlc;scheme=http;end`;
        androidLink.className = 'stream-link';
        androidLink.textContent = 'Open in VLC Player';
        androidLink.target = '_blank';
        streamLinks.appendChild(androidLink);
    } else if (deviceType === 'ios') {
        // iOS - VLC-x link
        const iosLink = document.createElement('a');
        iosLink.href = `vlc-x-callback://x-callback-url/stream?url=${encodeURIComponent(movie.streamUrl)}`;
        iosLink.className = 'stream-link';
        iosLink.textContent = 'Open in VLC (iOS)';
        iosLink.target = '_blank';
        streamLinks.appendChild(iosLink);
    }
    
    // PC/Other - Copy link button
    const copyLink = document.createElement('div');
    copyLink.className = 'stream-link';
    copyLink.innerHTML = '<i class="fas fa-copy"></i> Copy Stream Link';
    copyLink.addEventListener('click', () => {
        navigator.clipboard.writeText(movie.streamUrl).then(() => {
            copyLink.innerHTML = '<i class="fas fa-check"></i> Link Copied!';
            setTimeout(() => {
                copyLink.innerHTML = '<i class="fas fa-copy"></i> Copy Stream Link';
            }, 2000);
        });
    });
    streamLinks.appendChild(copyLink);
    
    // Download link (always available)
    const downloadLink = document.createElement('a');
    downloadLink.href = movie.downloadUrl;
    downloadLink.className = 'stream-link';
    downloadLink.innerHTML = '<i class="fas fa-download"></i> Download Movie';
    downloadLink.target = '_blank';
    streamLinks.appendChild(downloadLink);
                      }
