import mapboxgl from 'mapbox-gl';
import { useEffect, useState, useRef } from 'react';
import './Mapbox.css';
import axios from 'axios';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

function Mapbox(props) {

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [zoom, setZoom] = useState(0.2);

    useEffect(() => {
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [0, 0],
            zoom: zoom
        });
    });

    useEffect(() => {
        if (!map.current) return;
        if (props.tripDetails) {

            map.current.on('load', () => {
                map.current.addSource('route', {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': props.tripDetails?.trip_details?.map(item => {
                                return [
                                    item.location.lon, item.location.lat
                                ]
                            })
                        }
                    }
                });

                map.current.addLayer({
                    'id': 'route',
                    'type': 'line',
                    'source': 'route',
                    'layout': {
                        'line-join': 'miter',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': 'red',
                        'line-width': 3
                    }
                });

                // Add an image to use as a custom marker
                map.current.loadImage(
                    'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png',
                    (error, image) => {
                        if (error) throw error;
                        map.current.addImage('custom-marker', image);
                        map.current.addSource('points', {
                            'type': 'geojson',
                            'data': {
                                'type': 'FeatureCollection',
                                'features': props.tripDetails?.trip_details?.map((item, index) => {
                                    return {
                                        'type': 'Feature',
                                        'geometry': {
                                            'type': 'Point',
                                            'coordinates': [
                                                item.location.lon, item.location.lat
                                            ]
                                        },
                                        'properties': {
                                            'title': index === 0 ? "Source" + " - " + item.name : item.order + "-" + item.name
                                        }
                                    }
                                })
                            }
                        });

                        // Add a symbol layer
                        map.current.addLayer({
                            'id': 'points',
                            'type': 'symbol',
                            'source': 'points',
                            'layout': {
                                'icon-image': 'custom-marker',
                                'icon-size': 0.7,
                                'text-field': ['get', 'title'],
                                'text-font': [
                                    'Open Sans Semibold',
                                    'Arial Unicode MS Bold'
                                ],
                                "text-size": 12,
                                'text-offset': [0, 1.25],
                                'text-anchor': 'top'
                            }
                        });
                    }
                );
            });
        }
    }, [props.tripDetails]);

    return (
        <div className="mapbox">
            <h3 className="total-distance">
                Total Distance travelled : {props.tripDetails?.total_distance ? props.tripDetails?.total_distance + " Kms" : "0 Kms"}
            </h3>
            <div ref={mapContainer} className="map-container" />
        </div>
    );
}



export default Mapbox;
