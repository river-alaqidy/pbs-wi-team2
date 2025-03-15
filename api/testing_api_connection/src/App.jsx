import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [randomNumber, setRandomNumber] = useState(Math.floor(Math.random() * 20));  // Store random number
  const [data, setData] = useState(null);  
  const [loading, setLoading] = useState(true);  
  const [image, SetImage] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/index.php')
      .then((response) => response.json())
      .then((data) => {
        setData(data); 
        setLoading(false); 
        SetImage(data[randomNumber].attributes.images[0])
      })
      .catch((error) => {
        setLoading(false);  
        console.error('Error fetching data:', error);
      });
  }, [randomNumber]); 

  const generateRandomNumber = () => {
    const number = Math.floor(Math.random() * 20);  
    setRandomNumber(number);  
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={generateRandomNumber}>Generate Show Image</button>
      <img src={image.image} alt={image.profile} style={{ width: '600px', height: 'auto', display: 'block', marginTop: '20px'}} />
    </div>
  );
}

export default App