import { useEffect, useState } from 'react';
import './Autocomplete.css';
import { cities } from '../../static/cities.js';
import Autocomplete from 'react-autocomplete';
import axios from 'axios';

function AutoComplete(props) {

  const [allCities, setAllCities] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [autocompleteDisabled, setAutocompleteDisabled] = useState(false)

  useEffect(() => {
    setAllCities(getAllCities())
  }, []);


  function initTripPlan(sourceCity) {
    setSelectedCity(selectedCity)
    getTripData(sourceCity);
  }

  function getTripData(sourceCity) {
    axios.post('http://localhost:5000/plan', {
      "source": allCities.find(item => item.id === sourceCity).id
    })
      .then(function (response) {
        if (props.tripDetailsCallback)
          setAutocompleteDisabled(true);
        props.tripDetailsCallback(response.data.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <div className="autocomplete">
      {!!allCities && (
        <>
          {!!autocompleteDisabled ? (
            <button
              type="button"
              className='btn'
              style={{
                width: '200px',
                backgroundColor: 'lightgray',
                color: 'white',
                border: 'none',
                padding: '20px',
                cursor: 'pointer',
                borderRadius: '5px'
              }}
              onClick={() => {
                setAutocompleteDisabled(false)
                props.tripDetailsCallback(null)
              }}>RESET</button>
          ) : (<Autocomplete
            items={allCities}
            getItemValue={item => {
              return item.id
            }}
            renderItem={(item, isHighlighted) =>
              <div style={{
                padding: '5px',
                background: isHighlighted ? '#C0C0C0' : 'white'
              }}
                key={item.id}>
                {item.name + ", " + item.contId}
              </div>
            }
            value={selectedCity}
            shouldItemRender={(item, value
            ) => item.name.toLowerCase()
              .indexOf(value.toLowerCase()) > -1}

            onChange={e => setSelectedCity(e.target.value)}

            onSelect={(val) => initTripPlan(val)}

            inputProps={{
              style: {
                padding: '10px',
                borderRadius: '10px',
                width: '300px', height: '20px',
                background: '#00000',
                border: '2px solid black'
              },
              placeholder: 'Search City'
            }}
          >
          </Autocomplete>)}
        </>
      )}
    </div>
  );
}

function getAllCities() {

  let init_cities = []

  for (var key in cities) {
    init_cities.push({
      "id": key,
      "name": cities[key].name,
      "contId": cities[key].contId
    })
  }

  return init_cities;
}

export default AutoComplete;
