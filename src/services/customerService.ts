interface Customer {
  id: string;
  accountNumber: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

// Mock data
const mockCustomers: Customer[] = [
  {
    id: '1',
    accountNumber: 'KLIQ-001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    status: 'active',
  },
  {
    id: '2',
    accountNumber: 'KLIQ-002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1987654321',
    status: 'active',
  },
  {
    id: '3',
    accountNumber: 'KLIQ-003',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    phone: '+1555123456',
    status: 'inactive',
  },
  {
    id: '4',
    accountNumber: 'KLIQ-004',
    name: 'Sarah Wilson',
    email: 'sarah@example.com',
    phone: '+1555987654',
    status: 'active',
  },
  {
    id: '5',
    accountNumber: 'KLIQ-005',
    name: 'David Brown',
    email: 'david@example.com',
    phone: '+1555333444',
    status: 'active',
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface SearchFilters {
  kliqId?: string;
  phone?: string;
}

export const customerService = {
  getCustomers: async (): Promise<Customer[]> => {
    await delay(500); // Simulate network delay
    return mockCustomers;
  },

  getCustomerById: async (id: string): Promise<Customer | null> => {
    await delay(300); // Simulate network delay
    const customer = mockCustomers.find(c => c.id === id);
    return customer || null;
  },

  searchCustomers: async (filters: SearchFilters): Promise<Customer[]> => {
    await delay(300); // Simulate network delay
    return mockCustomers.filter(customer => {
      const matchesKliqId =
        !filters.kliqId ||
        customer.accountNumber
          .toLowerCase()
          .includes(filters.kliqId.toLowerCase());
      const matchesPhone =
        !filters.phone ||
        customer.phone.toLowerCase().includes(filters.phone.toLowerCase());
      return matchesKliqId && matchesPhone;
    });
  },
};
