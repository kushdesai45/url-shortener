import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [shortUrls, setShortUrls] = useState([]);
  const [fullUrl, setFullUrl] = useState("");

  const fetchShortUrls = async () => {
    try {
      const response = await fetch("http://localhost:3000/shortUrls");
      const data = await response.json();
      setShortUrls(data?.data || []);
    } catch (error) {
      console.error("Error fetching short URLs:", error);
    }
  };

  useEffect(() => {
    fetchShortUrls();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!fullUrl) return;

    try {
      const response = await fetch("http://localhost:3000/shortUrl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ originalUrl: fullUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to create short URL");
      }

      if (response.status === 201) {
        alert("Short URL already exists!");
        return;
      }

      await response.json();
      fetchShortUrls();
      setFullUrl(""); // Clear input
    } catch (error) {
      console.error("Error shrinking URL:", error);
    }
  };

  const handleRedirect = async (shortUrl) => {
    try {
      const response = await fetch(`http://localhost:3000/${shortUrl}`);
      const data = await response.json();
      window.open(data?.data, "_blank");
    } catch (error) {
      console.error("Error redirecting:", error);
    }
  };

  return (
    <div className="container mt-5 text-center">
      <h1 className="mb-4">🚀 URL Shrinker</h1>
      <div className="card p-4 shadow">
        <form className="mb-4" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              required
              placeholder="Enter Full URL here"
              type="url"
              name="fullUrl"
              id="fullUrl"
              className="form-control"
              value={fullUrl}
              onChange={(e) => setFullUrl(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Shrink URL
            </button>
          </div>
        </form>

        {shortUrls.length > 0 && (
          <table className="table table-hover table-striped">
            <thead className="table-dark">
              <tr>
                <th>Full URL</th>
                <th>Short URL</th>
                <th>Clicks</th>
              </tr>
            </thead>
            <tbody>
              {shortUrls.map((shortUrl, index) => (
                <tr key={index}>
                  <td>
                    <a
                      href={shortUrl.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {shortUrl.originalUrl}
                    </a>
                  </td>
                  <td>
                    <button
                      className="btn btn-link"
                      onClick={() => handleRedirect(shortUrl.sortUrl)}
                    >
                      {shortUrl.sortUrl}
                    </button>
                  </td>
                  <td>{shortUrl.clicks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
