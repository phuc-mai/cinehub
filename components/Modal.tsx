"use client";

import { Genre, Movie, Video } from "@lib/types";
import { AddCircle, CancelRounded, RemoveCircle } from "@mui/icons-material";
import { set } from "mongoose";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { useRouter } from "next/navigation";

interface Props {
  movie: Movie;
  closeModal: () => void;
}

interface User {
  email: string;
  username: string;
  favorites: number[];
}

const Modal = ({ movie, closeModal }: Props) => {
  const router = useRouter();

  const [video, setVideo] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: session } = useSession();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_ACCESS_TOKEN}`,
    },
  };

  const getMovieDetails = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/movie/${movie.id}?append_to_response=videos`,
        options
      );
      const data = await res.json();

      if (data?.videos) {
        const index = data.videos.results.findIndex(
          (video: Video) => video.type === "Trailer"
        );
        setVideo(data.videos.results[index].key);
      }

      if (data?.genres) {
        setGenres(data.genres);
      }
    } catch (err) {
      console.log("Error fetching movie details", err);
    }
  };

  useEffect(() => {
    getMovieDetails();
  }, [movie]);


  // HANDLE MY LIST
  const getUser = async () => {
    try {
      const res = await fetch(`/api/user/${session?.user?.email}`);
      const data = await res.json();
      setUser(data);
      setIsFavorite(data.favorites.find((item: number) => item === movie.id));
      setLoading(false);
    } catch (err) {
      console.log("Error fetching user", err);
    }
  };

  useEffect(() => {
    if (session) getUser();
  }, [session]);

  const handleMyList = async () => {
    try {
      const res = await fetch(`/api/user/${session?.user?.email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId: movie.id }),
      });
      const data = await res.json();
      setUser(data);
      setIsFavorite(data.favorites.find((item: number) => item === movie.id));
      router.refresh()
    } catch (err) {
      console.log("Failed to handle my list", err);
    }
  };
  
  return loading ? (
    <Loader />
  ) : (
    <div className="modal">
      <button className="modal-close" onClick={closeModal}>
        <CancelRounded
          sx={{ color: "white", fontSize: "35px", ":hover": { color: "red" } }}
        />
      </button>

      <iframe
        src={`https://www.youtube.com/embed/${video}?autoplay=1&mute=1&loop=1`}
        className="modal-video"
        loading="lazy"
        allowFullScreen
      />

      <div className="modal-content">
        <div className="flex justify-between">
          <div className="flex gap-2">
            <p className="text-base-bold">Name:</p>
            <p className="text-base-light">{movie?.title || movie?.name}</p>
          </div>
          <div className="flex gap-3">
            <p className="text-base-bold">Add To List</p>
            {isFavorite ? (
              <RemoveCircle
                className="cursor-pointer text-pink-1"
                onClick={handleMyList}
              />
            ) : (
              <AddCircle
                className="cursor-pointer text-pink-1"
                onClick={handleMyList}
              />
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <p className="text-base-bold">Release Date:</p>
          <p className="text-base-light">{movie?.release_date}</p>
        </div>

        <p className="text-base-light">{movie?.overview}</p>

        <div className="flex gap-2">
          <p className="text-base-bold">Rating:</p>
          <p className="text-base-light">{movie?.vote_average}</p>
        </div>

        <div className="flex gap-2">
          <p className="text-base-bold">Genres:</p>
          <p className="text-base-light">
            {genres.map((genre) => genre.name).join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
