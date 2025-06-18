export interface Customer {
  id: string;
  accountNumber: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}
