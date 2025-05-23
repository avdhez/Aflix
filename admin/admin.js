document.addEventListener('DOMContentLoaded', () => {
    const movieForm = document.getElementById('movie-form');
    
    movieForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const movieData = {
            id: Date.now().toString(),
            title: document.getElementById('title').value,
            year: document.getElementById('year').value,
            poster: document.getElementById('poster').value,
            streamUrl: document.getElementById('streamUrl').value,
            downloadUrl: document.getElementById('downloadUrl').value,
            runtime: document.getElementById('runtime').value,
            rating: parseFloat(document.getElementById('rating').value),
            overview: document.getElementById('overview').value,
            genres: document.getElementById('genres').value.split(',').map(g => g.trim())
        };
        
        try {
            // In a real implementation, you would push this to your GitHub repo
            // This is a simplified version that would use GitHub API in production
            
            // For demo purposes, we'll just log it
            console.log('Movie data to be saved:', movieData);
            
            alert('Movie added successfully! (In a real implementation, this would be saved to GitHub)');
            movieForm.reset();
        } catch (error) {
            console.error('Error saving movie:', error);
            alert('Error saving movie. Please try again.');
        }
    });
});

// In a real implementation, you would use the GitHub API to:
// 1. Fetch the current movies.json
// 2. Add the new movie to the array
// 3. Commit and push the updated file back to the repo

// This would require authentication and proper error handling
