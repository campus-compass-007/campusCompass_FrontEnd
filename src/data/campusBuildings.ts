// North West University Potchefstroom Campus Buildings
// Add real coordinates for each building

export interface CampusBuilding {
  id: string;
  name: string;
  shortName: string;
  address: string;
  lat: number;
  lng: number;
  type: 'academic' | 'residence' | 'administration' | 'dining' | 'sports' | 'library' | 'parking';
  description?: string;
  facilities?: string[];
}

export const NWU_BUILDINGS: CampusBuilding[] = [
  // Academic Buildings
  {
    id: 'building-a1',
    name: 'Faculty of Engineering',
    shortName: 'Engineering',
    address: 'North West University, Potchefstroom',
    lat: -26.6906, // TODO: Add real coordinates
    lng: 27.0933,
    type: 'academic',
    description: 'Engineering faculty building',
    facilities: ['Computer Labs', 'Lecture Halls', 'Engineering Labs']
  },
  {
    id: 'building-a2',
    name: 'Faculty of Natural and Agricultural Sciences',
    shortName: 'Nat & Agri Sciences',
    address: 'North West University, Potchefstroom',
    lat: -26.6906, // TODO: Add real coordinates
    lng: 27.0933,
    type: 'academic',
    description: 'Natural and Agricultural Sciences faculty',
    facilities: ['Science Labs', 'Lecture Halls', 'Research Centers']
  },
  {
    id: 'building-lib1',
    name: 'Ferdinand Postma Library',
    shortName: 'Main Library',
    address: 'North West University, Potchefstroom',
    lat: -26.6906, // TODO: Add real coordinates
    lng: 27.0933,
    type: 'library',
    description: 'Main university library',
    facilities: ['Study Areas', 'Computer Lab', 'Archives', 'Group Study Rooms']
  },
  {
    id: 'building-admin1',
    name: 'Administration Building',
    shortName: 'Admin',
    address: 'North West University, Potchefstroom',
    lat: -26.6906, // TODO: Add real coordinates
    lng: 27.0933,
    type: 'administration',
    description: 'Main administration building',
    facilities: ['Student Services', 'Registrar', 'Finance Office']
  },
  {
    id: 'building-sport1',
    name: 'Sports Complex',
    shortName: 'Sports',
    address: 'North West University, Potchefstroom',
    lat: -26.6906, // TODO: Add real coordinates
    lng: 27.0933,
    type: 'sports',
    description: 'Main sports and recreation complex',
    facilities: ['Gymnasium', 'Swimming Pool', 'Sports Fields', 'Fitness Center']
  },
  // Residences
  {
    id: 'res-1',
    name: 'Vergeet-My-Nie',
    shortName: 'VMN',
    address: 'North West University, Potchefstroom',
    lat: -26.6906, // TODO: Add real coordinates
    lng: 27.0933,
    type: 'residence',
    description: 'Student residence',
    facilities: ['Dining Hall', 'Study Areas', 'Recreation Room']
  },
  {
    id: 'res-2',
    name: 'Heimat',
    shortName: 'Heimat',
    address: 'North West University, Potchefstroom',
    lat: -26.6906, // TODO: Add real coordinates
    lng: 27.0933,
    type: 'residence',
    description: 'Student residence',
    facilities: ['Dining Hall', 'Study Areas', 'Recreation Room']
  },
  // Add more buildings as needed...
];

// Helper function to get buildings by type
export const getBuildingsByType = (type: CampusBuilding['type']) => {
  return NWU_BUILDINGS.filter(building => building.type === type);
};

// Helper function to search buildings
export const searchBuildings = (query: string) => {
  const searchTerm = query.toLowerCase();
  return NWU_BUILDINGS.filter(building => 
    building.name.toLowerCase().includes(searchTerm) ||
    building.shortName.toLowerCase().includes(searchTerm) ||
    building.description?.toLowerCase().includes(searchTerm)
  );
};
