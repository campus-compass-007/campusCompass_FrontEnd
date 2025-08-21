import { useState } from 'react';
import { Search, X, ChevronRight, Phone, AlertTriangle } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  title: string;
  phone: string;
  isEmergency?: boolean;
}

interface ContactsMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const mockContacts: Contact[] = [
  { id: '0', name: 'Protection Services', title: 'Emergency Services', phone: '(555) 911-HELP', isEmergency: true },
  { id: '1', name: 'Dr. Sarah Johnson', title: 'Dean of Academic Affairs', phone: '(555) 123-4567' },
  { id: '2', name: 'Michael Chen', title: 'Student Services Director', phone: '(555) 234-5678' },
  { id: '3', name: 'Prof. Emily Davis', title: 'Computer Science Department', phone: '(555) 345-6789' },
  { id: '4', name: 'Robert Wilson', title: 'Facilities Management', phone: '(555) 456-7890' },
  { id: '5', name: 'Dr. Amanda Rodriguez', title: 'Health Center', phone: '(555) 567-8901' },
  { id: '6', name: 'James Thompson', title: 'IT Support', phone: '(555) 678-9012' },
  { id: '7', name: 'Lisa Anderson', title: 'Admissions Office', phone: '(555) 789-0123' },
  { id: '8', name: 'David Brown', title: 'Financial Aid', phone: '(555) 890-1234' },
  { id: '9', name: 'Maria Garcia', title: 'International Student Services', phone: '(555) 901-2345' },
  { id: '10', name: 'John Taylor', title: 'Library Services', phone: '(555) 012-3456' },
  { id: '11', name: 'Jennifer White', title: 'Career Counseling', phone: '(555) 123-4567' },
];

export function ContactsMenu({ isOpen, onClose }: ContactsMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  const handleContactCall = (contact: Contact) => {
    console.log('Calling:', contact);
    // Here you would initiate a phone call or copy number to clipboard
    if (navigator.clipboard) {
      navigator.clipboard.writeText(contact.phone);
    }
    // Don't close the menu immediately for contacts, let user choose multiple numbers
  };

  const emergencyContact = filteredContacts.find(contact => contact.isEmergency);
  const regularContacts = filteredContacts.filter(contact => !contact.isEmergency);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
      
      {/* Sliding Menu */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 z-50 transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Campus Directory</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Contacts List */}
          <div className="flex-1 overflow-y-auto">
            {/* Emergency Contact - Highlighted */}
            {emergencyContact && (
              <div className="bg-red-50 dark:bg-red-900/20 border-b-2 border-red-200 dark:border-red-800">
                <button
                  onClick={() => handleContactCall(emergencyContact)}
                  className="w-full flex items-center p-4 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                >
                  {/* Emergency Icon */}
                  <div className="w-12 h-12 mr-4 flex-shrink-0 bg-red-500 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-red-700 dark:text-red-300 text-lg">
                      {emergencyContact.name}
                    </h3>
                    <p className="text-sm text-red-600 dark:text-red-400 mb-1">
                      {emergencyContact.title}
                    </p>
                    <p className="text-lg font-semibold text-red-700 dark:text-red-300">
                      {emergencyContact.phone}
                    </p>
                  </div>

                  {/* Phone Icon */}
                  <Phone className="w-6 h-6 text-red-500 ml-2" />
                </button>
              </div>
            )}

            {/* Regular Contacts */}
            {regularContacts.map((contact) => (
              <button
                key={contact.id}
                onClick={() => handleContactCall(contact)}
                className="w-full flex items-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                {/* Contact Icon */}
                <div className="w-12 h-12 mr-4 flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>

                {/* Contact Info */}
                <div className="flex-1 text-left">
                  <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                    {contact.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {contact.title}
                  </p>
                  <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                    {contact.phone}
                  </p>
                </div>

                {/* Arrow Icon */}
                <ChevronRight className="w-5 h-5 text-gray-400 ml-2" />
              </button>
            ))}
            
            {filteredContacts.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400">No contacts found matching your search.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
