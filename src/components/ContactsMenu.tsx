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
  { id: '0', name: 'Protection Services', title: 'Emergency Services', phone: '018 299 2215', isEmergency: true },
  { id: '1', name: 'Registration', title: 'Registration office', phone: '086 016 9698' },
  { id: '2', name: 'Health Care', title: 'Student Health Care Centre', phone: '018 299 4345' },
  { id: '3', name: 'IT Support', title: 'IT Service Desk', phone: '018 285 4350' },
  { id: '4', name: 'Distance Learning', title: 'Distance Learning Call Centre', phone: '018 285 5900' },
  { id: '5', name: 'Teaching and Learning Call Centre', title: 'Centre for Teaching and Learning Call Centre', phone: '018 285 5930 ' },
  { id: '6', name: 'Student Counselling', title: 'Psychological Services', phone: '018 299 2893' },
  { id: '7', name: 'Ferdinand Postma Library', title: 'Library Help Desk', phone: '018 299 2802' },
];

export function ContactsMenu({ isOpen, onClose }: ContactsMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.phone.includes(searchQuery)
  );

  // Helper function to format phone number for tel: link (remove spaces and non-numeric chars except +)
  const formatPhoneForTel = (phone: string) => {
    return phone.replace(/\s/g, '');
  };

  const emergencyContact = filteredContacts.find(contact => contact.isEmergency);
  const regularContacts = filteredContacts.filter(contact => !contact.isEmergency);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-200"
          onClick={onClose}
        />
      )}
      
      {/* Sliding Menu */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 z-50 transform transition-transform duration-200 ease-out ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        <div className="max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Campus Directory</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors duration-150 hover-purple-close"
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
          <div className="flex-1 overflow-y-auto pb-20">
            {/* Emergency Contact - Highlighted */}
            {emergencyContact && (
              <div className="bg-red-50 dark:bg-red-900/20 border-b-2 border-red-200 dark:border-red-800">
                <a
                  href={`tel:${formatPhoneForTel(emergencyContact.phone)}`}
                  className="w-full flex items-center p-4 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-150 hover-red-emergency no-underline"
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
                </a>
              </div>
            )}

            {/* Regular Contacts */}
            {regularContacts.map((contact) => (
              <a
                key={contact.id}
                href={`tel:${formatPhoneForTel(contact.phone)}`}
                className="w-full flex items-center p-4 transition-colors duration-150 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover-purple-transparent no-underline"
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
              </a>
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
