// Campus Configuration

export const CAMPUS_CONFIG = {
  // North West University, Potchefstroom, South Africa
  center: [27.09141145, -26.68825875] as [number, number], // Center of the new polygon

  // Default zoom level for campus view - increased significantly to ensure polygon fills viewport
  defaultZoom: 18,

  // Zoom level when focusing on a specific location - increased for high-zoom environment
  focusZoom: 19,

  name: 'North West University',

  // Campus boundary coordinates from new KML file
  // These coordinates define the exact campus area
  boundary: [
    [27.0930724, -26.6910479],
    [27.0948373, -26.691163],
    [27.0954488, -26.6842851],
    [27.0959745, -26.6810353],
    [27.0959745, -26.6803547],
    [27.0959531, -26.6797172],
    [27.0964788, -26.6775219],
    [27.0964627, -26.6768316],
    [27.0938127, -26.676822],
    [27.0929347, -26.6807396],
    [27.0925592, -26.6822159],
    [27.0853441, -26.6904551],
    [27.0895229, -26.6908097],
    [27.0861273, -26.6996857],
    [27.0887666, -26.6998726],
    [27.0892118, -26.6954251],
    [27.0926772, -26.695612],
    [27.0930724, -26.6910479] // Closing point (same as first)
  ] as [number, number][],

  // Calculated bounds from the boundary coordinates
  // [west, south, east, north] format for Mapbox
  // Made more restrictive to prevent any panning outside polygon at high zoom levels
  bounds: [
    27.0855, // west (min longitude) - more restrictive
    -26.6995, // south (min latitude) - more restrictive
    27.0963, // east (max longitude) - more restrictive
    -26.6770  // north (max latitude) - more restrictive
  ] as [number, number, number, number],
};
