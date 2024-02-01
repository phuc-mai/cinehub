import { fetchMovieDetails } from "@actions/movieData";
import { fetchMyList } from "@actions/user";
import MovieCard from "@components/MovieCard";
import Navbar from "@components/Navbar";
import { Movie } from "@lib/types";

const MyList = async () => {
  const myList = await fetchMyList();

  const myListDetails = await Promise.all(
    myList.map(async (movieId: number) => {
      const movieDetails = await fetchMovieDetails(movieId);
      return movieDetails;
    })
  );

  return (
    <>
      <Navbar />
      <div className="list">
        {myListDetails.map((movie: Movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </>
  );
};

export default MyList;
