import { useState } from 'react';
import './App.css';
import AutoComplete from './components/autocomplete/Autocomplete';
import Mapbox from './components/mapbox/Mapbox';

function App() {

  const [tripDetails, setTripDetails] = useState();

  return (
    <div className="App">
      <div className='autocomplete-container'>
        <AutoComplete
          tripDetailsCallback={setTripDetails}
        ></AutoComplete>
      </div>

      <div className='mapbox-container'>
        {!!tripDetails &&
          (<Mapbox tripDetails={tripDetails}>
          </Mapbox>
          )}
      </div>
    </div>
  );
}

export default App;
