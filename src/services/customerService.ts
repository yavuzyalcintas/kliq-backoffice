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

// Digital Pin Order type and mock data
export interface DigitalPinOrder {
  id: string;
  customerId: string;
  pinCode: string;
  product: string;
  amount: number;
  status: 'delivered' | 'pending' | 'failed';
  createdAt: string;
}

const mockDigitalPinOrders: DigitalPinOrder[] = [
  {
    id: 'order-1',
    customerId: '1',
    pinCode: '1234-5678-9012',
    product: 'Game Card 50$',
    amount: 50,
    status: 'delivered',
    createdAt: '2024-06-01T10:00:00Z',
  },
  {
    id: 'order-2',
    customerId: '1',
    pinCode: '2345-6789-0123',
    product: 'Gift Card 25$',
    amount: 25,
    status: 'pending',
    createdAt: '2024-06-03T14:30:00Z',
  },
  {
    id: 'order-3',
    customerId: '2',
    pinCode: '3456-7890-1234',
    product: 'Game Card 10$',
    amount: 10,
    status: 'delivered',
    createdAt: '2024-06-02T09:15:00Z',
  },
];

// Customer Monthly Statement types and mock data
export interface CustomerStatement {
  id: string;
  customerId: string;
  month: number;
  year: number;
  htmlContent: string;
  totalAmount: number;
  transactionCount: number;
  generatedAt: string;
}

const mockStatements: CustomerStatement[] = [
  {
    id: 'stmt-1',
    customerId: '1',
    month: 6,
    year: 2024,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #333; margin: 0;">Monthly Statement</h1>
          <h2 style="color: #666; margin: 10px 0;">June 2024</h2>
          <p style="margin: 5px 0;"><strong>Customer:</strong> John Doe</p>
          <p style="margin: 5px 0;"><strong>Account:</strong> KLIQ-001</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Total Transactions:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">5</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Total Amount:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">$125.00</td>
            </tr>
          </table>
        </div>
        
        <div>
          <h3 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Transactions</h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 10px; border: 1px solid #ccc; text-align: left;">Date</th>
                <th style="padding: 10px; border: 1px solid #ccc; text-align: left;">Description</th>
                <th style="padding: 10px; border: 1px solid #ccc; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 10px; border: 1px solid #ccc;">2024-06-01</td>
                <td style="padding: 10px; border: 1px solid #ccc;">Game Card 50$</td>
                <td style="padding: 10px; border: 1px solid #ccc; text-align: right;">$50.00</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ccc;">2024-06-03</td>
                <td style="padding: 10px; border: 1px solid #ccc;">Gift Card 25$</td>
                <td style="padding: 10px; border: 1px solid #ccc; text-align: right;">$25.00</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ccc;">2024-06-15</td>
                <td style="padding: 10px; border: 1px solid #ccc;">Premium Subscription</td>
                <td style="padding: 10px; border: 1px solid #ccc; text-align: right;">$30.00</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ccc;">2024-06-20</td>
                <td style="padding: 10px; border: 1px solid #ccc;">Game Card 10$</td>
                <td style="padding: 10px; border: 1px solid #ccc; text-align: right;">$10.00</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ccc;">2024-06-25</td>
                <td style="padding: 10px; border: 1px solid #ccc;">Service Fee</td>
                <td style="padding: 10px; border: 1px solid #ccc; text-align: right;">$10.00</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
          <p>Generated on: 2024-06-30 23:59:59</p>
          <p>This is an automatically generated statement.</p>
        </div>
      </div>
    `,
    totalAmount: 125.0,
    transactionCount: 5,
    generatedAt: '2024-06-30T23:59:59Z',
  },
  {
    id: 'stmt-2',
    customerId: '1',
    month: 5,
    year: 2024,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
          <h1 style="color: #333; margin: 0;">Monthly Statement</h1>
          <h2 style="color: #666; margin: 10px 0;">May 2024</h2>
          <p style="margin: 5px 0;"><strong>Customer:</strong> John Doe</p>
          <p style="margin: 5px 0;"><strong>Account:</strong> KLIQ-001</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <h3 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Total Transactions:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">3</td>
            </tr>
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Total Amount:</strong></td>
              <td style="padding: 8px; border-bottom: 1px solid #eee;">$75.00</td>
            </tr>
          </table>
        </div>
        
        <div>
          <h3 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Transactions</h3>
          <table style="width: 100%; border-collapse: collapse; border: 1px solid #ccc;">
            <thead>
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 10px; border: 1px solid #ccc; text-align: left;">Date</th>
                <th style="padding: 10px; border: 1px solid #ccc; text-align: left;">Description</th>
                <th style="padding: 10px; border: 1px solid #ccc; text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 10px; border: 1px solid #ccc;">2024-05-10</td>
                <td style="padding: 10px; border: 1px solid #ccc;">Game Card 25$</td>
                <td style="padding: 10px; border: 1px solid #ccc; text-align: right;">$25.00</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ccc;">2024-05-20</td>
                <td style="padding: 10px; border: 1px solid #ccc;">Premium Subscription</td>
                <td style="padding: 10px; border: 1px solid #ccc; text-align: right;">$30.00</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ccc;">2024-05-25</td>
                <td style="padding: 10px; border: 1px solid #ccc;">Service Fee</td>
                <td style="padding: 10px; border: 1px solid #ccc; text-align: right;">$20.00</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div style="margin-top: 30px; text-align: center; color: #666; font-size: 12px;">
          <p>Generated on: 2024-05-31 23:59:59</p>
          <p>This is an automatically generated statement.</p>
        </div>
      </div>
    `,
    totalAmount: 75.0,
    transactionCount: 3,
    generatedAt: '2024-05-31T23:59:59Z',
  },
];

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

  getDigitalPinOrdersByCustomerId: async (
    customerId: string
  ): Promise<DigitalPinOrder[]> => {
    await delay(300);
    return mockDigitalPinOrders.filter(
      order => order.customerId === customerId
    );
  },

  getCustomerStatement: async (
    customerId: string,
    month: number,
    year: number
  ): Promise<CustomerStatement | null> => {
    await delay(500);
    const statement = mockStatements.find(
      stmt =>
        stmt.customerId === customerId &&
        stmt.month === month &&
        stmt.year === year
    );
    return statement || null;
  },
};
