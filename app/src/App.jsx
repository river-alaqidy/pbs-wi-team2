import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [randomNumber, setRandomNumber] = useState(Math.floor(Math.random() * 20)); 
  const [loading, setLoading] = useState(true);  
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/index.php')
      .then((response) => response.json())
      .then((data) => {
        setLoading(false); 
        setImage1(data[randomNumber].attributes.images[0])
        setImage2(data[(randomNumber + 1) % data.length].attributes.images[0])
        setImage3(data[(randomNumber + 2) % data.length].attributes.images[0])
      })
      .catch((error) => {
        setLoading(false);  
        console.error('Error fetching data:', error);
      });
  }, [randomNumber]); 

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div style={{ 
        backgroundColor: '#2638C4', 
        padding: '15px', 
        fontSize: '24px', 
        fontWeight: 'bold', 
        marginBottom: '20px',
        color: '#EBE5FC',
      }}>
        Recommended History Shows
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
        <img src={image1.image} alt={image1.profile} style={{ width: '300px', height: 'auto', display: 'block' }} />
        <img src={image2.image} alt={image2.profile} style={{ width: '300px', height: 'auto', display: 'block' }} />
        <img src={image3.image} alt={image3.profile} style={{ width: '300px', height: 'auto', display: 'block' }} />
      </div>
    </div>
  );
}

export default App
