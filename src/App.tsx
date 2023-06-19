import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Auth } from "./components/auth";
import { auth, db } from "./config/firebase";

// 1 : 20 :00

const App = () => {
  const [movieList, setMovieList] = useState([]);

  const [title, setTitle] = useState("");
  const [releaseDate, setReleaseDate] = useState(0);
  const [oscar, setOscar] = useState(false);
  const [description, setDescription] = useState("");

  const [updateTitl, setUpdateTitl] = useState("");

  const collectionMovieRef = collection(db, "movies");
  const getMovies = async () => {
    // READ THE DATA FROM DATABASE
    // SET MOVIE LIST
    try {
      const data = await getDocs(collectionMovieRef);
      const filteredData = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setMovieList(filteredData);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getMovies();
  }, []);

  const onSubmitMovie = async () => {
    try {
      await addDoc(collectionMovieRef, {
        title: title,
        releaseDate: releaseDate,
        description: description,
        oscar: oscar,
        userId: auth?.currentUser?.uid,
      });

      getMovies();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteMovie = async (id: any) => {
    const movieDoc = doc(db, "movies", id);
    await deleteDoc(movieDoc);
  };

  const updateMovie = async (id: any) => {
    const movieDoc = doc(db, "movies", id);

    await updateDoc(movieDoc, { title: updateTitl });
    getMovies();
  };

  return (
    <div>
      <Auth />

      <div>
        <input placeholder="Title" onChange={(e) => setTitle(e.target.value)} />
        <input
          type="text"
          placeholder="description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="release date"
          onChange={(e) => setReleaseDate(Number(e.target.value))}
        />
        <input
          type="checkbox"
          checked={oscar}
          onChange={(e) => setOscar(e.target.checked)}
        />
        <label htmlFor="">oscar</label>
        <button onClick={onSubmitMovie}>Submit Button</button>
      </div>

      <div>
        {movieList.map((movie: any) => (
          <div>
            <h1>{movie.title}</h1>
            <p>{movie.description}</p>
            <p>{movie.releaseDate}</p>
            <p>{movie.oscar ? "Yes" : "No"}</p>
            <button onClick={() => deleteMovie(movie.id)}>Delete Movie</button>

            <input
              type="text"
              onChange={(e) => setUpdateTitl(e.target.value)}
              placeholder="Update Title"
            />
            <button onClick={() => updateMovie(movie.id)}>Update Title</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
