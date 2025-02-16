import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

const MapboxMap = ({ events }) => { // Modificato: ora accetta eventi, non gallerie
  const mapContainerRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11", // Stile minimal
      center: [12.4964, 41.9028], // Coordinate iniziali (Roma)
      zoom: 5,
    });

    // Aggiungere i marker per gli eventi (invece delle gallerie)
    events.forEach((event) => {
      if (!event.latitude || !event.longitude || isNaN(event.latitude) || isNaN(event.longitude)) {
        console.warn(`⚠ Evento senza coordinate valide: ${event.title}`);
        return; // Salta questo evento se non ha coordinate valide
      }

      new mapboxgl.Marker()
        .setLngLat([event.longitude, event.latitude])
        .setPopup(new mapboxgl.Popup().setHTML(`<h4>${event.title}</h4><p>${event.location}</p>`))
        .addTo(map);
    });

    return () => map.remove(); // Pulisce la mappa al cambio di pagina
  }, [events]);

  return <div ref={mapContainerRef} style={{ width: "100%", height: "500px", borderRadius: "10px" }} />;
};

export default MapboxMap;