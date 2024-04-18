package com.alansaji2003vit.movies;

//this class handles the business logic and connects to the database
//this uses the repository class and returns the results to api layer
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MovieService {

    @Autowired          //it will instantiate this class
    private MovieInRepository movieInRepository;
    public List<Movie> allMovies(){
        return movieInRepository.findAll();
    }
    public Optional<Movie> singleMovie(String imdbId){    //movie may return null therefore we are assigning optional movie as a return type here
        return movieInRepository.findMovieByImdbId(imdbId);

    }

}
