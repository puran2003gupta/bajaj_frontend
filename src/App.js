import React, { useState } from 'react';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedJson = JSON.parse(jsonInput);
      const result = await fetch('https://bajaj-backend-pnox.onrender.com/bfhl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(parsedJson),
      });
      const data = await result.json();
      setResponse(data);
      setError(null);
    } catch (err) {
      setError('Invalid JSON or server error');
    }
  };

  const handleOptionChange = (e) => {
    const { value, checked } = e.target;
    setSelectedOptions(prev =>
      checked ? [...prev, value] : prev.filter(option => option !== value)
    );
  };

  const renderResponse = () => {
    if (!response) return null;
  
    // Log the full response to inspect its structure
    console.log('Full Response:', response);
  
    // Destructure response with default values
    const { numbers = [], alphabets = [], highest_lowercase_alphabet = [] } = response;
  
    // Data to render
    const renderData = {
      Alphabets: alphabets,
      Numbers: numbers,
      'Highest lowercase alphabet': highest_lowercase_alphabet,
    };
  
    return selectedOptions.map(option => (
      <div key={option}>
        <h3>{option}</h3>
        <p>{renderData[option] && renderData[option].length > 0 ? renderData[option].join(', ') : 'No data available'}</p>
      </div>
    ));
  };
  
  
  return (
    <div>
      <h1>Your Roll Number</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={jsonInput}
          onChange={handleInputChange}
          placeholder='Enter JSON'
        />
        <button type="submit">Submit</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && (
        <>
          <div>
            <label>
              <input
                type="checkbox"
                value="Alphabets"
                onChange={handleOptionChange}
              />
              Alphabets
            </label>
            <label>
              <input
                type="checkbox"
                value="Numbers"
                onChange={handleOptionChange}
              />
              Numbers
            </label>
            <label>
              <input
                type="checkbox"
                value="Highest lowercase alphabet"
                onChange={handleOptionChange}
              />
              Highest lowercase alphabet
            </label>
          </div>
          <div>
            {renderResponse()}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
