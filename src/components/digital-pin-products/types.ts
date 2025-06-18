export interface PartialImage {
  id: string;
  name: string;
  url: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}

// Available color keys that users can select from
export const AVAILABLE_COLOR_KEYS = [
  'primary',
  'secondary',
  'accent',
  'background',
  'text',
  'border',
  'success',
  'warning',
  'error',
  'info',
  'highlight',
  'muted',
  'surface',
  'overlay',
  'shadow',
] as const;

export type ColorKey = (typeof AVAILABLE_COLOR_KEYS)[number];

export interface ColorEntry {
  key: ColorKey;
  value: string;
  label: string;
}

export interface ProductTheme {
  id: string;
  name: string;
  colors: ColorEntry[];
  bannerImage: {
    url: string;
    width: number;
    height: number;
  };
  partialImages: PartialImage[];
  createdAt: string;
  updatedAt: string;
}

export interface SingleProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  isActive: boolean;
  logoImage?: {
    url: string;
    alt?: string;
  };
  groupedProductId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GroupedProduct {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  logoImage?: {
    url: string;
    alt?: string;
  };
  theme: ProductTheme;
  singleProducts: SingleProduct[];
  createdAt: string;
  updatedAt: string;
}

export interface DigitalPinProduct {
  id: string;
  name: string;
  description: string;
  type: 'grouped' | 'single';
  isActive: boolean;
  groupedProduct?: GroupedProduct;
  singleProduct?: SingleProduct;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductThemeRequest {
  name: string;
  colors: ColorEntry[];
  bannerImage: {
    url: string;
    width: number;
    height: number;
  };
  partialImages: Omit<PartialImage, 'id'>[];
}

export interface CreateGroupedProductRequest {
  name: string;
  description: string;
  logoImage?: {
    url: string;
    alt?: string;
  };
  theme: CreateProductThemeRequest;
}

export interface CreateSingleProductRequest {
  name: string;
  description: string;
  price: number;
  logoImage?: {
    url: string;
    alt?: string;
  };
  groupedProductId?: string;
}

// Helper function to get color key labels
export const getColorKeyLabel = (key: ColorKey): string => {
  const labels: Record<ColorKey, string> = {
    primary: 'Primary Color',
    secondary: 'Secondary Color',
    accent: 'Accent Color',
    background: 'Background Color',
    text: 'Text Color',
    border: 'Border Color',
    success: 'Success Color',
    warning: 'Warning Color',
    error: 'Error Color',
    info: 'Info Color',
    highlight: 'Highlight Color',
    muted: 'Muted Color',
    surface: 'Surface Color',
    overlay: 'Overlay Color',
    shadow: 'Shadow Color',
  };
  return labels[key];
};

// Helper function to get default color value
export const getDefaultColorValue = (key: ColorKey): string => {
  const defaults: Record<ColorKey, string> = {
    primary: '#FF6B35',
    secondary: '#004E89',
    accent: '#FFE66D',
    background: '#FFFFFF',
    text: '#333333',
    border: '#E0E0E0',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    highlight: '#8B5CF6',
    muted: '#6B7280',
    surface: '#F9FAFB',
    overlay: '#000000',
    shadow: '#00000026',
  };
  return defaults[key];
};
