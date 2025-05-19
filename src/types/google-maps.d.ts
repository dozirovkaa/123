declare global {
  interface Window {
    google: {
      maps: {
        Map: typeof google.maps.Map;
        Marker: typeof google.maps.Marker;
        Geocoder: typeof google.maps.Geocoder;
        GeocoderResult: google.maps.GeocoderResult;
        GeocoderStatus: google.maps.GeocoderStatus;
      };
    };
  }
}

export {};
