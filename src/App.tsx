import './App.css'

function App() {
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
            <div className="image-card">

              <div className="image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1200&q=80"
                  alt="Beautiful landscape"
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
                    Beautiful Landscape
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
          </div>

        </div>

        {/* Footer */}
        <footer>
          <p>
            © 2026 Image Search. Made with
            <i className="ri-heart-3-fill"></i>
          </p>
        </footer>
      </section>
    </>
  )
}

export default App