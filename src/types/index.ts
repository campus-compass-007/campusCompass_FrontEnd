export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  type: 'restaurant' | 'store' | 'landmark' | 'gas_station' | 'recreational' | 'residential' | 'health' | 'security' | 'library';
}

export interface Building {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface Office {
  id: string;
  officeNumber: string;
  lecturer: string;
  department: string;
}
