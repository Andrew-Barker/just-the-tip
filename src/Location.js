import React, { useState, useEffect } from 'react';

const significantChange = 0.001; // Adjust based on your requirements
const defaultAddress = { address: '', city: '', state: '', zip: '', timestamp: new Date() };

const LocationComponent = () => {
  const [address, setAddress] = useState(() => {
    // Retrieve and parse the stored location data, if available
    const savedData = localStorage.getItem('locationData');
    return savedData ? JSON.parse(savedData) : defaultAddress;
  });
  const [isFetching, setIsFetching] = useState(false);
  const [locationAccessDenied, setLocationAccessDenied] = useState(false);

  const checkSignificantChange = (newLat, newLng) => {
    if (address.lat && address.lng) {
      return Math.abs(newLat - address.lat) > significantChange || Math.abs(newLng - address.lng) > significantChange;
    }
    // If there's no latitude and longitude in the current state, treat this as a significant change.
    return true;
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;

        if (checkSignificantChange(latitude, longitude)) {
          setIsFetching(true); // Indicate that fetching has started
          const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

          try {
            const response = await fetch(url, {
              headers: {
                'User-Agent': 'YourApp/1.0 contact@example.com',
                'Accept-Language': 'en',
              }
            });
            const data = await response.json();
            const newAddress = {
              address: `${data.address.house_number} ${data.address.road}`,
              city: data.address.city || data.address.municipality,
              state: data.address.state,
              zip: data.address.postcode,
              lat: latitude,
              lng: longitude,
              timestamp: new Date() // Add timestamp
            };
            setAddress(newAddress);
            setIsFetching(false); // Indicate that fetching has finished
            localStorage.setItem('locationData', JSON.stringify(newAddress));
          } catch (error) {
            console.error('Geocoding error:', error);
            setIsFetching(false); // Even on error, fetching has finished
          }
        }
      }, (error) => {
        setLocationAccessDenied(true);
        setIsFetching(false); // No longer fetching, since an error occurred
        console.error("Geolocation error:", error);
      });
    } else {
      setLocationAccessDenied(true)
      setIsFetching(false)
      console.log('Geolocation is not supported by this browser.');
    }
  }, []);

  if (locationAccessDenied) {
    return null;
  }

  return (
    <div>
      {isFetching ? (
        <p>Getting address...</p>
        ) : (
          <>
          {address.name && <p><strong>{address.name}</strong></p>}
          <p>{address.address}</p>
          <p>{address.city}, {address.state} {address.zip}</p>
          </>
          )}
    </div>
    );
};

export default LocationComponent;
