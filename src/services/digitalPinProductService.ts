import type {
  DigitalPinProduct,
  GroupedProduct,
  SingleProduct,
  ProductTheme,
  CreateGroupedProductRequest,
  CreateSingleProductRequest,
  CreateProductThemeRequest,
  ColorEntry,
} from '@/components/digital-pin-products/types';

// Mock data
const mockThemes: ProductTheme[] = [
  {
    id: 'theme-1',
    name: 'Gaming Theme',
    colors: [
      { key: 'primary', value: '#FF6B35', label: 'Primary Color' },
      { key: 'secondary', value: '#004E89', label: 'Secondary Color' },
      { key: 'accent', value: '#FFE66D', label: 'Accent Color' },
      { key: 'background', value: '#1A1A1A', label: 'Background Color' },
      { key: 'text', value: '#FFFFFF', label: 'Text Color' },
    ],
    bannerImage: {
      url: 'https://images4.alphacoders.com/600/600528.png',
      width: 1200,
      height: 400,
    },
    partialImages: [
      {
        id: 'partial-1',
        name: 'Game Controller',
        url: '/images/controller.png',
        position: { x: 100, y: 50 },
        size: { width: 200, height: 150 },
      },
      {
        id: 'partial-2',
        name: 'Game Logo',
        url: '/images/game-logo.png',
        position: { x: 400, y: 100 },
        size: { width: 300, height: 100 },
      },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'theme-2',
    name: 'Gift Card Theme',
    colors: [
      { key: 'primary', value: '#E91E63', label: 'Primary Color' },
      { key: 'secondary', value: '#9C27B0', label: 'Secondary Color' },
      { key: 'accent', value: '#FFD700', label: 'Accent Color' },
      { key: 'background', value: '#FFFFFF', label: 'Background Color' },
      { key: 'text', value: '#333333', label: 'Text Color' },
      { key: 'border', value: '#E0E0E0', label: 'Border Color' },
    ],
    bannerImage: {
      url: 'https://images4.alphacoders.com/600/600528.png',
      width: 1200,
      height: 400,
    },
    partialImages: [
      {
        id: 'partial-3',
        name: 'Gift Box',
        url: '/images/gift-box.png',
        position: { x: 50, y: 75 },
        size: { width: 150, height: 150 },
      },
      {
        id: 'partial-4',
        name: 'Ribbon',
        url: '/images/ribbon.png',
        position: { x: 300, y: 25 },
        size: { width: 400, height: 50 },
      },
    ],
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  },
];

const mockSingleProducts: SingleProduct[] = [
  {
    id: 'single-1',
    name: 'Game Card $10',
    description: 'Digital game card worth $10',
    price: 10,
    isActive: true,
    logoImage: {
      url: 'https://mockupbee.com/wp-content/uploads/2022/05/Square-Box-Mockup-D.jpg',
      alt: 'Game Card $10 Logo',
    },
    groupedProductId: 'grouped-1',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'single-2',
    name: 'Game Card $25',
    description: 'Digital game card worth $25',
    price: 25,
    isActive: true,
    logoImage: {
      url: 'https://mockupbee.com/wp-content/uploads/2022/05/Square-Box-Mockup-D.jpg',
      alt: 'Game Card $25 Logo',
    },
    groupedProductId: 'grouped-1',
    createdAt: '2024-01-15T10:15:00Z',
    updatedAt: '2024-01-15T10:15:00Z',
  },
  {
    id: 'single-3',
    name: 'Game Card $50',
    description: 'Digital game card worth $50',
    price: 50,
    isActive: true,
    logoImage: {
      url: 'https://mockupbee.com/wp-content/uploads/2022/05/Square-Box-Mockup-D.jpg',
      alt: 'Game Card $50 Logo',
    },
    groupedProductId: 'grouped-1',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'single-4',
    name: 'Gift Card $20',
    description: 'Universal gift card worth $20',
    price: 20,
    isActive: true,
    logoImage: {
      url: 'https://mockupbee.com/wp-content/uploads/2022/05/Square-Box-Mockup-D.jpg',
      alt: 'Gift Card $20 Logo',
    },
    groupedProductId: 'grouped-2',
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  },
  {
    id: 'single-5',
    name: 'Gift Card $100',
    description: 'Universal gift card worth $100',
    price: 100,
    isActive: true,
    logoImage: {
      url: 'https://mockupbee.com/wp-content/uploads/2022/05/Square-Box-Mockup-D.jpg',
      alt: 'Gift Card $100 Logo',
    },
    groupedProductId: 'grouped-2',
    createdAt: '2024-01-16T14:45:00Z',
    updatedAt: '2024-01-16T14:45:00Z',
  },
  {
    id: 'single-6',
    name: 'Standalone Card $5',
    description: 'Standalone digital card',
    price: 5,
    isActive: true,
    logoImage: {
      url: 'https://mockupbee.com/wp-content/uploads/2022/05/Square-Box-Mockup-D.jpg',
      alt: 'Standalone Card Logo',
    },
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-17T09:00:00Z',
  },
];

const mockGroupedProducts: GroupedProduct[] = [
  {
    id: 'grouped-1',
    name: 'Gaming Cards Collection',
    description: 'Collection of gaming cards with various denominations',
    isActive: true,
    logoImage: {
      url: 'https://mockupbee.com/wp-content/uploads/2022/05/Square-Box-Mockup-D.jpg',
      alt: 'Gaming Cards Collection Logo',
    },
    theme: mockThemes[0]!,
    singleProducts: mockSingleProducts.filter(
      p => p.groupedProductId === 'grouped-1'
    ),
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'grouped-2',
    name: 'Gift Cards Collection',
    description: 'Collection of universal gift cards',
    isActive: true,
    logoImage: {
      url: 'https://mockupbee.com/wp-content/uploads/2022/05/Square-Box-Mockup-D.jpg',
      alt: 'Gift Cards Collection Logo',
    },
    theme: mockThemes[1]!,
    singleProducts: mockSingleProducts.filter(
      p => p.groupedProductId === 'grouped-2'
    ),
    createdAt: '2024-01-16T14:30:00Z',
    updatedAt: '2024-01-16T14:30:00Z',
  },
];

const mockDigitalPinProducts: DigitalPinProduct[] = [
  ...mockGroupedProducts.map(grouped => ({
    id: grouped.id,
    name: grouped.name,
    description: grouped.description,
    type: 'grouped' as const,
    isActive: grouped.isActive,
    groupedProduct: grouped,
    createdAt: grouped.createdAt,
    updatedAt: grouped.updatedAt,
  })),
  ...mockSingleProducts
    .filter(single => !single.groupedProductId)
    .map(single => ({
      id: single.id,
      name: single.name,
      description: single.description,
      type: 'single' as const,
      isActive: single.isActive,
      singleProduct: single,
      createdAt: single.createdAt,
      updatedAt: single.updatedAt,
    })),
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to get color value by key
const getColorValue = (colors: ColorEntry[], key: string): string => {
  const color = colors.find(c => c.key === key);
  return color?.value || '#000000';
};

// Service functions
export const digitalPinProductService = {
  // Get all digital pin products
  async getAllProducts(): Promise<DigitalPinProduct[]> {
    await delay(500);
    return [...mockDigitalPinProducts];
  },

  // Get grouped products
  async getGroupedProducts(): Promise<GroupedProduct[]> {
    await delay(300);
    return [...mockGroupedProducts];
  },

  // Get single products
  async getSingleProducts(): Promise<SingleProduct[]> {
    await delay(300);
    return [...mockSingleProducts];
  },

  // Get themes
  async getThemes(): Promise<ProductTheme[]> {
    await delay(300);
    return [...mockThemes];
  },

  // Create grouped product
  async createGroupedProduct(
    data: CreateGroupedProductRequest
  ): Promise<GroupedProduct> {
    await delay(500);

    // Create theme first
    const theme: ProductTheme = {
      id: `theme-${Date.now()}`,
      name: data.theme.name,
      colors: data.theme.colors,
      bannerImage: data.theme.bannerImage,
      partialImages: data.theme.partialImages.map((partial, index) => ({
        ...partial,
        id: `partial-${Date.now()}-${index}`,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const groupedProduct: GroupedProduct = {
      id: `grouped-${Date.now()}`,
      name: data.name,
      description: data.description,
      isActive: true,
      logoImage: data.logoImage,
      theme,
      singleProducts: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockGroupedProducts.push(groupedProduct);
    mockThemes.push(theme);

    return groupedProduct;
  },

  // Create single product
  async createSingleProduct(
    data: CreateSingleProductRequest
  ): Promise<SingleProduct> {
    await delay(500);

    const singleProduct: SingleProduct = {
      id: `single-${Date.now()}`,
      name: data.name,
      description: data.description,
      price: data.price,
      isActive: true,
      logoImage: data.logoImage,
      groupedProductId: data.groupedProductId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockSingleProducts.push(singleProduct);

    // Update grouped product if associated
    if (data.groupedProductId) {
      const groupedProduct = mockGroupedProducts.find(
        g => g.id === data.groupedProductId
      );
      if (groupedProduct) {
        groupedProduct.singleProducts.push(singleProduct);
      }
    }

    return singleProduct;
  },

  // Update theme
  async updateTheme(
    themeId: string,
    data: Partial<CreateProductThemeRequest>
  ): Promise<ProductTheme> {
    await delay(500);

    const themeIndex = mockThemes.findIndex(t => t.id === themeId);
    if (themeIndex === -1) {
      throw new Error('Theme not found');
    }

    const existingTheme = mockThemes[themeIndex]!;
    const updatedTheme: ProductTheme = {
      id: existingTheme.id,
      name: data.name ?? existingTheme.name,
      colors: data.colors ?? existingTheme.colors,
      bannerImage: data.bannerImage ?? existingTheme.bannerImage,
      partialImages: data.partialImages
        ? data.partialImages.map((partial, index) => ({
            ...partial,
            id: `partial-${Date.now()}-${index}`,
          }))
        : existingTheme.partialImages,
      createdAt: existingTheme.createdAt,
      updatedAt: new Date().toISOString(),
    };

    mockThemes[themeIndex] = updatedTheme;

    // Update grouped products using this theme
    mockGroupedProducts.forEach(grouped => {
      if (grouped.theme.id === themeId) {
        grouped.theme = updatedTheme;
      }
    });

    return updatedTheme;
  },

  // Delete product
  async deleteProduct(productId: string): Promise<void> {
    await delay(300);

    // Remove from grouped products
    const groupedIndex = mockGroupedProducts.findIndex(g => g.id === productId);
    if (groupedIndex !== -1) {
      mockGroupedProducts.splice(groupedIndex, 1);
      return;
    }

    // Remove from single products
    const singleIndex = mockSingleProducts.findIndex(s => s.id === productId);
    if (singleIndex !== -1) {
      mockSingleProducts.splice(singleIndex, 1);
      return;
    }

    throw new Error('Product not found');
  },

  // Toggle product status
  async toggleProductStatus(productId: string): Promise<void> {
    await delay(300);

    // Toggle grouped product
    const groupedProduct = mockGroupedProducts.find(g => g.id === productId);
    if (groupedProduct) {
      groupedProduct.isActive = !groupedProduct.isActive;
      return;
    }

    // Toggle single product
    const singleProduct = mockSingleProducts.find(s => s.id === productId);
    if (singleProduct) {
      singleProduct.isActive = !singleProduct.isActive;
      return;
    }

    throw new Error('Product not found');
  },
};
