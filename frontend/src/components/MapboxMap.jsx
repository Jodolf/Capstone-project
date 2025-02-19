import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "../styles/MapboxMap.css";
import { Card } from "react-bootstrap";

const MapboxMap = ({ events, galleries }) => {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/light-v11", 
      center: [12.4964, 41.9028], 
      zoom: 5,
    });

    // Aggiungere i marker per gli eventi (invece delle gallerie)
    events.forEach((event) => {
      if (
        !event.latitude ||
        !event.longitude ||
        isNaN(event.latitude) ||
        isNaN(event.longitude)
      ) {
        console.warn(`⚠ Evento senza coordinate valide: ${event.title}`);
        return; // Salta questo evento se non ha coordinate valide
      }

      events.forEach((event) => {
        if (
          !event.latitude ||
          !event.longitude ||
          isNaN(event.latitude) ||
          isNaN(event.longitude)
        ) {
          console.warn(`⚠ Evento senza coordinate valide: ${event.title}`);
          return; // Salta questo evento se non ha coordinate valide
        }

        // Creazione di un contenitore HTML per il popup
        const popupContent = document.createElement("div");
        popupContent.innerHTML = `
          <div class="map-popup-card">
            <h5 class="map-popup-title">${event.title}</h5>
            <p class="map-popup-text"><strong>Data:</strong> ${new Date(
              event.date
            ).toLocaleDateString()}</p>
            <p class="map-popup-text"><strong>Posizione:</strong> ${
              event.location
            }</p>
            <button class="map-popup-button" onclick="window.location.href='/event/${
              event._id
            }'">Dettagli</button>
          </div>
        `;

        const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(
          popupContent
        );

        new mapboxgl.Marker({ color: "#000000" })
          .setLngLat([event.longitude, event.latitude])
          .setPopup(popup)
          .addTo(map);
      });
    });

    galleries.forEach((gallery) => {
      if (
        !gallery.latitude ||
        !gallery.longitude ||
        isNaN(gallery.latitude) ||
        isNaN(gallery.longitude)
      ) {
        console.warn(`⚠ Galleria senza coordinate valide: ${gallery.name}`);
        return; // Salta questa galleria se non ha coordinate valide
      }

      const popupContent = document.createElement("div");
      popupContent.innerHTML = `
                  <div class="map-popup-card">
                    <h5 class="map-popup-title">${gallery.name}</h5>
                    <p class="map-popup-text"><strong>Posizione:</strong> ${gallery.location}</p>
                    <button class="map-popup-button" onclick="window.location.href='/gallery/${gallery._id}'">Dettagli</button>
                  </div>
                `;

      const popup = new mapboxgl.Popup({ offset: 25 }).setDOMContent(
        popupContent
      );

      new mapboxgl.Marker({ color: "#6E32FF" }) 
        .setLngLat([gallery.longitude, gallery.latitude])
        .setPopup(popup)
        .addTo(map);
    });

    return () => map.remove(); // Pulisce la mappa al cambio di pagina
  }, [events]);

  return <div ref={mapContainerRef} className="map-container" />;
};

export default MapboxMap;
