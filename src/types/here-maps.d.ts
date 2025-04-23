
// Type definitions for HERE Maps API
interface Window {
  H: {
    Map: any;
    service: {
      Platform: any;
    };
    mapevents: {
      Behavior: any;
      MapEvents: any;
    };
    ui: {
      UI: {
        createDefault: (map: any, defaultLayers: any) => any;
      };
      InfoBubble: any;
    };
    geo: {
      Rect: any;
      LineString: any;
    };
    map: {
      Group: any;
      Marker: any;
      Polyline: any;
      Icon: any;
    };
  };
  mapsjs: any;
}
