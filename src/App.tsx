import { useCallback, useEffect, useState } from 'react';
import { message } from 'antd';
import './App.css';

interface PhotoSource {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
}

interface Photo {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  alt: string;
  src: PhotoSource;
}

interface PexelsResponse {
  page: number;
  per_page: number;
  total_results: number;
  photos: Photo[];
  next_page?: string;
  prev_page?: string;
}

const PER_PAGE = 12;
const DEFAULT_QUERY = 'people';

function App() {
  const API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

  const [searchQuery, setSearchQuery] = useState(DEFAULT_QUERY);
  const [activeQuery, setActiveQuery] = useState(DEFAULT_QUERY);

  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);

  /*
   * Fetch images from Pexels.
   *
   * replaceResults = true:
   *   New search -> old results replace
   *
   * replaceResults = false:
   *   Load More -> new results append
   */
  const fetchImages = useCallback(
    async (
      query: string,
      requestedPage: number,
      replaceResults: boolean
    ) => {
      if (!API_KEY) {
        const errorMessage =
          'Pexels API key is missing. Add VITE_PEXELS_API_KEY to your .env file.';

        setError(errorMessage);
        setLoading(false);
        setInitialLoading(false);

        return;
      }

      setLoading(true);
      setError('');

      try {
        const url =
          `https://api.pexels.com/v1/search` +
          `?query=${encodeURIComponent(query)}` +
          `&page=${requestedPage}` +
          `&per_page=${PER_PAGE}`;

        const response = await fetch(url, {
          headers: {
            Authorization: API_KEY,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Pexels API request failed (${response.status})`
          );
        }

        const data: PexelsResponse = await response.json();

        if (replaceResults) {
          setPhotos(data.photos);
        } else {
          setPhotos((previousPhotos) => [
            ...previousPhotos,
            ...data.photos,
          ]);
        }

        setHasMore(Boolean(data.next_page));

        setPage(data.page);

        if (replaceResults && data.photos.length === 0) {
          setError('');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Something went wrong while fetching images.';

        setError(errorMessage);

        if (replaceResults) {
          setPhotos([]);
        }

        message.error(errorMessage);
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [API_KEY]
  );

  /*
   * Initial page load.
   * Exactly 12 images are requested with "people".
   */
  useEffect(() => {
    fetchImages(DEFAULT_QUERY, 1, true);
  }, [fetchImages]);

  /*
   * Search handler.
   */
  const handleSearch = () => {
    const query = searchQuery.trim();

    if (!query) {
      message.warning('Please enter an image search keyword.');
      return;
    }

    if (loading) {
      return;
    }

    setActiveQuery(query);
    setPage(1);
    setHasMore(true);

    fetchImages(query, 1, true);
  };

  /*
   * Load next 12 images.
   *
   * loading check prevents duplicate simultaneous requests.
   */
  const handleLoadMore = () => {
    if (loading || !hasMore) {
      return;
    }

    const nextPage = page + 1;

    fetchImages(activeQuery, nextPage, false);
  };

  /*
   * Copy image URL.
   */
  const handleCopyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);

      message.success('Image URL copied successfully.');
    } catch {
      message.error('Unable to copy image URL.');
    }
  };

  /*
   * Download image.
   */
  const handleDownload = async (photo: Photo) => {
    try {
      const response = await fetch(photo.src.original);

      if (!response.ok) {
        throw new Error('Unable to download this image.');
      }

      const blob = await response.blob();

      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');

      link.href = blobUrl;
      link.download = `pexels-${photo.id}.jpg`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(blobUrl);

      message.success('Image download started.');
    } catch {
      /*
       * Some browsers / remote image servers can block
       * direct blob downloading because of CORS.
       *
       * Fallback opens the Pexels image in a new tab.
       */
      window.open(
        photo.src.original,
        '_blank',
        'noopener,noreferrer'
      );

      message.info('Image opened in a new tab.');
    }
  };

  return (
    <section className="app">

      {/* Background decorations */}
      <div className="background-orb background-orb-one"></div>
      <div className="background-orb background-orb-two"></div>

      <div className="container">

        {/* =========================
            Header
        ========================== */}
        <header className="hero">

          <span className="badge">
            <i className="ri-sparkling-2-fill"></i>
            Pexels Image Gallery
          </span>

          <h1>
            Find & Download
            <span> Beautiful Images</span>
          </h1>

          <p>
            Search millions of beautiful images and download
            your favorites instantly.
          </p>

        </header>


        {/* =========================
            Search
        ========================== */}
        <div className="search-wrapper">

          <div className="search-box">

            <i className="ri-search-line search-icon"></i>

            <input
              type="text"
              value={searchQuery}
              placeholder="Search for images..."
              aria-label="Search images"
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearch();
                }
              }}
            />

            {searchQuery && (
              <button
                type="button"
                className="clear-btn"
                aria-label="Clear search"
                onClick={() => setSearchQuery('')}
              >
                <i className="ri-close-line"></i>
              </button>
            )}

          </div>

          <button
            type="button"
            className="search-btn"
            disabled={loading}
            onClick={handleSearch}
          >
            <i className="ri-search-2-line"></i>

            {loading && page === 1
              ? 'Searching...'
              : 'Search'}
          </button>

        </div>


        {/* =========================
            Active Search
        ========================== */}
        {!initialLoading && !error && (
          <div className="result-heading">
            <div>
              <span>Search results for</span>
              <h2>"{activeQuery}"</h2>
            </div>

            <span className="result-count">
              {photos.length} images
            </span>
          </div>
        )}


        {/* =========================
            Error
        ========================== */}
        {error && !initialLoading && (
          <div className="state-card error-state">

            <div className="state-icon">
              <i className="ri-error-warning-line"></i>
            </div>

            <h3>Something went wrong</h3>

            <p>{error}</p>

            <button
              type="button"
              onClick={() => {
                setPage(1);
                setHasMore(true);

                fetchImages(
                  activeQuery,
                  1,
                  true
                );
              }}
            >
              <i className="ri-refresh-line"></i>
              Try Again
            </button>

          </div>
        )}


        {/* =========================
            Initial Loading
        ========================== */}
        {initialLoading && (
          <div className="state-card loading-state">

            <div className="loader">
              <i className="ri-loader-4-line"></i>
            </div>

            <h3>Loading images...</h3>

            <p>
              Finding beautiful images for you.
            </p>

          </div>
        )}


        {/* =========================
            Empty State
        ========================== */}
        {!initialLoading &&
          !error &&
          photos.length === 0 && (
            <div className="state-card empty-state">

              <div className="state-icon">
                <i className="ri-image-line"></i>
              </div>

              <h3>No images found</h3>

              <p>
                Try searching with a different keyword.
              </p>

            </div>
          )}


        {/* =========================
            Gallery
        ========================== */}
        {!initialLoading &&
          !error &&
          photos.length > 0 && (
            <main className="gallery">

              {photos.map((photo) => (

                <article
                  className="image-card"
                  key={photo.id}
                >

                  {/* Image */}
                  <div className="image-wrapper">

                    <img
                      src={photo.src.large}
                      alt={
                        photo.alt ||
                        `Photo by ${photo.photographer}`
                      }
                      loading="lazy"
                    />

                    <div className="image-overlay">

                      <a
                        href={photo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="preview-btn"
                      >
                        <i className="ri-eye-line"></i>
                        View on Pexels
                      </a>

                    </div>

                  </div>


                  {/* Details */}
                  <div className="card-content">

                    <div className="image-details">

                      <h3>
                        {photo.alt ||
                          'Beautiful Image'}
                      </h3>

                      <p>
                        <i className="ri-user-line"></i>

                        {photo.photographer}
                      </p>

                    </div>


                    {/* Actions */}
                    <div className="card-actions">

                      <button
                        type="button"
                        className="icon-action"
                        title="Copy image URL"
                        aria-label="Copy image URL"
                        onClick={() =>
                          handleCopyUrl(
                            photo.src.original
                          )
                        }
                      >
                        <i className="ri-links-line"></i>
                      </button>


                      <button
                        type="button"
                        className="download-btn"
                        onClick={() =>
                          handleDownload(photo)
                        }
                      >
                        <i className="ri-download-2-line"></i>
                        Download
                      </button>

                    </div>

                  </div>

                </article>

              ))}

            </main>
          )}


        {/* =========================
            Load More
        ========================== */}
        {!initialLoading &&
          !error &&
          photos.length > 0 &&
          hasMore && (

            <div className="load-more-wrapper">

              <button
                type="button"
                className="load-more-btn"
                disabled={loading}
                onClick={handleLoadMore}
              >

                {loading ? (
                  <>
                    <i className="ri-loader-4-line loading-icon"></i>
                    Loading...
                  </>
                ) : (
                  <>
                    <i className="ri-add-line"></i>
                    Load More
                  </>
                )}

              </button>

            </div>

          )}


        {/* No more results */}
        {!initialLoading &&
          !error &&
          photos.length > 0 &&
          !hasMore && (

            <div className="no-more">
              <i className="ri-checkbox-circle-line"></i>
              You've reached the end of the results.
            </div>

          )}

      </div>


      {/* =========================
          Footer
      ========================== */}
      <footer>

        <p>
          © 2026 Image Gallery
          <span>•</span>
          Powered by Pexels
        </p>

      </footer>

    </section>
  );
}

export default App;