import { Routes, Route, Link, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { getCharacters, getCharacterById } from "./api/rickMorty";
import { FavoritesContext } from "./context/FavoritesContext";

function Home() {
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { favorites, addFavorite, removeFavorite } =
    useContext(FavoritesContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCharacters(page, search);
        setCharacters(data.results);
      } catch (error) {
        setCharacters([]);
      }
    };

    fetchData();
  }, [page, search]);

  return (
    <div>
      <h1>Personajes</h1>

      <input
        type="text"
        placeholder="Buscar personaje..."
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
      />

      <br />
      <br />

      <button onClick={() => setPage(page - 1)} disabled={page === 1}>
        Anterior
      </button>

      <span> Página {page} </span>

      <button onClick={() => setPage(page + 1)}>Siguiente</button>

      {characters.length === 0 ? (
        <p className="empty">No se encontraron personajes</p>
      ) : (
        <div className="grid">
          {characters.map((char) => {
            const isFavorite = favorites.some((f) => f.id === char.id);

            return (
              <div key={char.id} className="card">
                <h3>{char.name}</h3>

                <Link to={`/character/${char.id}`}>
                  <img src={char.image} alt={char.name} />
                </Link>

                {isFavorite ? (
                  <button
                    className="favorite-btn"
                    onClick={() => removeFavorite(char.id)}
                  >
                    ❌ Quitar
                  </button>
                ) : (
                  <button onClick={() => addFavorite(char)}>
                    ❤️ Favorito
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Detail() {
  const { id } = useParams();
  const [character, setCharacter] = useState(null);

  useEffect(() => {
    const fetchCharacter = async () => {
      const data = await getCharacterById(id);
      setCharacter(data);
    };

    fetchCharacter();
  }, [id]);

  if (!character) return <p>Cargando...</p>;

  return (
    <div className="detail-container">
      <div className="detail-card">
        <img src={character.image} alt={character.name} />

        <h2>{character.name}</h2>

        <div className="detail-info">
          <p>
            Estado:{" "}
            <span className={`badge ${character.status.toLowerCase()}`}>
              {character.status}
            </span>
          </p>

          <p>Especie: {character.species}</p>
          <p>Género: {character.gender}</p>
        </div>

        <Link to="/" className="back-btn">
          ⬅ Volver
        </Link>
      </div>
    </div>
  );
}

function Favorites() {
  const { favorites, removeFavorite } = useContext(FavoritesContext);

  return (
    <div>
      <h1>Mis Favoritos ❤️</h1>

      {favorites.length === 0 ? (
        <p className="empty">No tienes favoritos</p>
      ) : (
        <div className="grid">
          {favorites.map((char) => (
            <div key={char.id} className="card">
              <h3>{char.name}</h3>

              <img src={char.image} alt={char.name} />

              <button
                className="favorite-btn"
                onClick={() => removeFavorite(char.id)}
              >
                ❌ Quitar
              </button>
            </div>
          ))}
        </div>
      )}

      <br />

      <Link to="/" className="back-btn">
        ⬅ Volver
      </Link>
    </div>
  );
}

function App() {
  return (
    <div className="container">
      <h1>Rick & Morty App</h1>

      <nav>
        <Link to="/">Inicio</Link>
        <Link to="/favorites">Favoritos</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/character/:id" element={<Detail />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </div>
  );
}

export default App;