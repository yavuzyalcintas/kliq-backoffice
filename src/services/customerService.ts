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
