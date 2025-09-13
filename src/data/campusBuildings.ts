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
    lat: -26.6850, // Within campus bounds
    lng: 27.0920,
    type: 'academic',
    description: 'Engineering faculty building',
    facilities: ['Computer Labs', 'Lecture Halls', 'Engineering Labs']
  },
  {
    id: 'building-a2',
    name: 'Faculty of Natural and Agricultural Sciences',
    shortName: 'Nat & Agri Sciences',
    address: 'North West University, Potchefstroom',
    lat: -26.6880, // Within campus bounds
    lng: 27.0950,
    type: 'academic',
    description: 'Natural and Agricultural Sciences faculty',
    facilities: ['Science Labs', 'Lecture Halls', 'Research Centers']
  },
  {
    id: 'building-lib1',
    name: 'Ferdinand Postma Library',
    shortName: 'Main Library',
    address: 'North West University, Potchefstroom',
    lat: -26.6900, // Within campus bounds (center area)
    lng: 27.0950,
    type: 'library',
    description: 'Main university library',
    facilities: ['Study Areas', 'Computer Lab', 'Archives', 'Group Study Rooms']
  },
  {
    id: 'building-admin1',
    name: 'Administration Building',
    shortName: 'Admin',
    address: 'North West University, Potchefstroom',
    lat: -26.6890, // Within campus bounds
    lng: 27.0980,
    type: 'administration',
    description: 'Main administration building',
    facilities: ['Student Services', 'Registrar', 'Finance Office']
  },
  {
    id: 'building-sport1',
    name: 'Sports Complex',
    shortName: 'Sports',
    address: 'North West University, Potchefstroom',
    lat: -26.6800, // Within campus bounds (north area)
    lng: 27.0970,
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
    lat: -26.6920, // Within campus bounds (south area)
    lng: 27.0900,
    type: 'residence',
    description: 'Student residence',
    facilities: ['Dining Hall', 'Study Areas', 'Recreation Room']
  },
  {
    id: 'res-2',
    name: 'Heimat',
    shortName: 'Heimat',
    address: 'North West University, Potchefstroom',
    lat: -26.6940, // Within campus bounds (south area)
    lng: 27.0930,
    type: 'residence',
    description: 'Student residence',
    facilities: ['Dining Hall', 'Study Areas', 'Recreation Room']
  },
  // Additional campus buildings
  {
    id: 'building-a3',
    name: 'Faculty of Education',
    shortName: 'Education',
    address: 'North West University, Potchefstroom',
    lat: -26.6860,
    lng: 27.0980,
    type: 'academic',
    description: 'Education faculty building',
    facilities: ['Lecture Halls', 'Computer Labs', 'Teaching Practice Rooms']
  },
  {
    id: 'building-a4',
    name: 'Faculty of Economic and Management Sciences',
    shortName: 'Economics',
    address: 'North West University, Potchefstroom',
    lat: -26.6870,
    lng: 27.1000,
    type: 'academic',
    description: 'Economics and Management Sciences faculty',
    facilities: ['Lecture Halls', 'Seminar Rooms', 'Computer Labs']
  },
  {
    id: 'building-dining1',
    name: 'Main Dining Hall',
    shortName: 'Dining Hall',
    address: 'North West University, Potchefstroom',
    lat: -26.6910,
    lng: 27.0940,
    type: 'dining',
    description: 'Main campus dining facility',
    facilities: ['Food Court', 'Cafeteria', 'Coffee Shop']
  }
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
