import { useEffect, useState } from 'react';
import './App.css'
import { message } from 'antd';

function App() {

  const API = import.meta.env.VITE_API_KEY;
  console.log(API);


  const [searchQuery, setSearchQuery] = useState<string | null>("Flowers");
  const [perPageData, setPerPageData] = useState<number | null>(12);
  const [pageNo, setPageNo] = useState<number | null>(1);
  const [photos, setPhotos] = useState([]);


  const fetchData = async () => {

    const url = `https://api.pexels.com/v1/search?query=${searchQuery}&page=${pageNo}&per_page=${perPageData}`;

    try {

      const response = await fetch(url, { headers: { Authorization: API } });

      if (!response.ok) {
        message.error(response.status || "Something Went Wrong...");
      }

      const data = await response.json();
      setPhotos(data?.photos);
      console.log(data);


    } catch (err: any) {

      message.error(err.message);

    };

  };

  useEffect(() => {

    fetchData();

  }, [pageNo])


  return (
    <>
      <section className="app">
        <div className="container">

          {/* Header / Search */}
          <div className="search-section">
            <div className="heading">
              <span className="badge">
                <i className="ri-sparkling-2-fill"></i>
                Image Search
              </span>

              <h1>
                Find & Download
                <span> Beautiful Images</span>
              </h1>

              <p>
                Search for your favorite images and download them
                instantly in high quality.
              </p>
            </div>

            <div className="search-wrapper">
              <div className="search-box">
                <i className="ri-search-line search-icon"></i>

                <input
                  type="text"
                  placeholder="Search for images..."
                />

                <button className="clear-btn" type="button">
                  <i className="ri-close-line"></i>
                </button>
              </div>

              <button className="search-btn" type="button">
                <i className="ri-search-2-line"></i>
                Search
              </button>
            </div>
          </div>

          {/* Result */}
          <div className="result-section">

            {photos.length > 0 ? (
              <>
                {
                  photos.map((images, index) => (

                    <div className="image-card" key={index}>

                      <div className="image-wrapper">
                        <img
                          src={images?.url}
                          alt={images?.alt}
                        />

                        <div className="image-overlay">
                          <button className="preview-btn" type="button">
                            <i className="ri-eye-line"></i>
                            Preview
                          </button>
                        </div>
                      </div>

                      <div className="card-content">
                        <div>
                          <p className="image-title">
                           Photographer: {images?.photographer}
                          </p>

                          <p className="image-info">
                            <i className="ri-image-line"></i>
                            High Quality Image
                          </p>
                        </div>

                        <button className="download-btn" type="button">
                          <i className="ri-download-2-line"></i>
                          Download
                        </button>
                      </div>

                    </div>
                  ))
                }
              </>
            )
              : (
                <>
                </>
              )
            }

          </div>

        </div>

        {/* Footer */}
        <footer>
          <p>
            © 2026 Image Search. Made with
            <i className="ri-heart-3-fill"></i>
            By <strong>Mo. Sarfraj Shaikh</strong>
          </p>
        </footer>
      </section>
    </>
  )
}

export default App