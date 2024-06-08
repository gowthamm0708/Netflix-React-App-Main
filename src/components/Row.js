/* eslint-disable react/prop-types */
import "./Row.css";
import axios from "../axios";
import { useEffect, useState } from "react";
import movieTrailer from "movie-trailer";
import YouTube from "react-youtube";
const baseURL = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
  // eslint-disable-next-line no-unused-vars
  const [movies, setMovies] = useState([]);
  const [trailerurl, setTrailerurl] = useState("");

  useEffect(
    function () {
      async function fetchData() {
        const res = await axios.get(fetchUrl);
        setMovies(res.data.results);
        //console.log(movies);
        return res;
      }
      fetchData();
    },
    [fetchUrl]
  );
  const opts = {
    height: "390",
    width: "100%",
    playerVars: {
      autoplay: 1,
    },
  };
  const handleClick = (movie) => {
    if (trailerurl) {
      setTrailerurl("");
    } else {
      movieTrailer(movie?.name || "")
        .then((url) => {
          const urlParams = new URLSearchParams(new URL(url).search);
          setTrailerurl(urlParams.get("v"));
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      <div className="row__posters">
        {movies.map((movie) => (
          <img
            onClick={() => handleClick(movie)}
            key={movie.id}
            className={`row__poster && ${isLargeRow && "row__potserLarge"}`}
            src={`${baseURL}${
              isLargeRow ? movie.poster_path : movie?.backdrop_path
            }`}
            alt={movie.name}
          />
        ))}
      </div>
      {trailerurl && <YouTube videoId={trailerurl} opts={opts} />}
    </div>
  );
}

export default Row;
