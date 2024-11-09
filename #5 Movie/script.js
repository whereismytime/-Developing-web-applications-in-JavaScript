const apiKey = '3b83fa37'; 


function searchMovies(page = 1) {
    const title = $('#title').val();
    const type = $('#type').val();

    $('#preloader').show(); 
    $('#results').hide();
    $('#movieDetails').hide(); 

    setTimeout(() => { 
        $.ajax({
            url: `https://www.omdbapi.com/?s=${title}&type=${type}&page=${page}&apikey=${apiKey}`,
            method: 'GET',
            success: function (data) {
                $('#movieList').empty();
                $('#pagination').empty();
                $('#preloader').hide(); 

                if (data.Response === "True" && data.Search) {
                    $('#results').show(); 
                    data.Search.forEach(movie => {
                        $('#movieList').append(`
                            <div class="movie">
                                <img src="${movie.Poster !== "N/A" ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
                                <h3>${movie.Title}</h3>
                                <p>${movie.Year}</p>
                                <button onclick="getMovieDetails('${movie.imdbID}')">Details</button>
                            </div>
                        `);
                    });
                    createPaginationButtons(data.totalResults, page);
                } else {
                    $('#results').show(); 
                    $('#movieList').html('<p style="color: #ff6b6b;">Movie not found!</p>'); 
                }
            },
            error: function () {
                alert("An error occurred while fetching data.");
                $('#preloader').hide();
            }
        });
    }, 2000);
}


function createPaginationButtons(totalResults, currentPage) {
    const totalPages = Math.ceil(totalResults / 10); 
    const maxVisibleButtons = 5; 
    const startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    
    if (currentPage > 1) {
        $('#pagination').append(`<button onclick="searchMovies(${currentPage - 1})">Previous</button>`);
    }

    
    for (let i = startPage; i <= endPage; i++) {
        $('#pagination').append(`
            <button ${i === currentPage ? 'disabled' : ''} onclick="searchMovies(${i})">${i}</button>
        `);
    }

    
    if (currentPage < totalPages) {
        $('#pagination').append(`<button onclick="searchMovies(${currentPage + 1})">Next</button>`);
    }
}

$(document).ready(function () {
    
    $('#searchForm').submit(function (e) {
        e.preventDefault();
        searchMovies();
    });
});


window.getMovieDetails = function (id) {
    $.ajax({
        url: `https://www.omdbapi.com/?i=${id}&apikey=${apiKey}`,
        method: 'GET',
        success: function (movie) {
            $('#movieDetails').show(); 
            $('#movieDetails').html(`
                <img src="${movie.Poster !== "N/A" ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
                <div class="movie-info">
                    <h2>${movie.Title}</h2>
                    <p><strong>Year:</strong> ${movie.Year}</p>
                    <p><strong>Genre:</strong> ${movie.Genre}</p>
                    <p><strong>Director:</strong> ${movie.Director}</p>
                    <p><strong>Actors:</strong> ${movie.Actors}</p>
                    <p><strong>Plot:</strong> ${movie.Plot}</p>
                    <p><strong>IMDb Rating:</strong> ${movie.imdbRating}</p>
                    <p><strong>Language:</strong> ${movie.Language}</p>
                    <p><strong>Runtime:</strong> ${movie.Runtime}</p>
                    <p><strong>Country:</strong> ${movie.Country}</p>
                </div>
            `);
            $('html, body').animate({ scrollTop: $('#movieDetails').offset().top }, 'slow'); 
        },
        error: function () {
            alert("An error occurred while fetching movie details.");
        }
    });
};


function scrollToTop() {
    $('html, body').animate({ scrollTop: 0 }, 'slow');
}

$(window).scroll(function() {
    if ($(window).scrollTop() > 300) {
        $('#scrollToTop').fadeIn();
    } else {
        $('#scrollToTop').fadeOut();
    }
});
