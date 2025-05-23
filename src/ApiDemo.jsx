import React, { useState } from "react";
import "./App.css";

function ApiDemo() {
  const [inputValue, setInputValue] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const callApi = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://your-api-endpoint.com/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: inputValue }),
      });

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: "Something went wrong." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>API Demo</h2>
        <label htmlFor="input">Enter Input</label>
        <input
          id="input"
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type something..."
        />
        <button onClick={callApi} disabled={loading || !inputValue.trim()}>
          {loading ? "Calling API..." : "Send Request"}
        </button>
        {response && (
          <div className="response-box">
            <strong>Response:</strong>
            <pre>{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default ApiDemo;
