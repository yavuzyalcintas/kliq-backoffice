import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ThemeEditor } from './ThemeEditor';
import type {
  CreateGroupedProductRequest,
  CreateProductThemeRequest,
} from './types';
import { useTranslation } from 'react-i18next';

interface GroupedProductEditorProps {
  onSave: (data: CreateGroupedProductRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function GroupedProductEditor({
  onSave,
  onCancel,
  isLoading,
}: GroupedProductEditorProps) {
  const { t } = useTranslation();

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    logoImage: {
      url: '',
      alt: '',
    },
  });

  const [currentTheme, setCurrentTheme] = useState<CreateProductThemeRequest>({
    name: '',
    colors: [
      { key: 'primary', value: '#FF6B35', label: 'Primary Color' },
      { key: 'secondary', value: '#004E89', label: 'Secondary Color' },
      { key: 'accent', value: '#FFE66D', label: 'Accent Color' },
      { key: 'background', value: '#FFFFFF', label: 'Background Color' },
      { key: 'text', value: '#333333', label: 'Text Color' },
    ],
    bannerImage: {
      url: '',
      width: 1200,
      height: 400,
    },
    partialImages: [],
  });

  const handleThemeChange = (themeData: CreateProductThemeRequest) => {
    setCurrentTheme(themeData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const groupedProductData: CreateGroupedProductRequest = {
      name: productData.name,
      description: productData.description,
      logoImage: productData.logoImage.url
        ? {
            url: productData.logoImage.url,
            alt: productData.logoImage.alt || productData.name,
          }
        : undefined,
      theme: currentTheme,
    };

    onSave(groupedProductData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">
          {t('digitalPinProducts.createGroupedProduct')}
        </h2>
        <p className="text-muted-foreground">
          {t('digitalPinProducts.groupedProductDescription')}
        </p>
      </div>

      <Tabs defaultValue="product" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="product">
            {t('digitalPinProducts.productInfo')}
          </TabsTrigger>
          <TabsTrigger value="theme">
            {t('digitalPinProducts.theme')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="product" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {t('digitalPinProducts.productInformation')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="productName">
                  {t('digitalPinProducts.productName')}
                </Label>
                <Input
                  id="productName"
                  value={productData.name}
                  onChange={e =>
                    setProductData(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder={t('digitalPinProducts.enterProductName')}
                  required
                />
              </div>
              <div>
                <Label htmlFor="productDescription">
                  {t('digitalPinProducts.productDescription')}
                </Label>
                <Textarea
                  id="productDescription"
                  value={productData.description}
                  onChange={e =>
                    setProductData(prev => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder={t('digitalPinProducts.enterProductDescription')}
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <Label>{t('digitalPinProducts.logoImage')}</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="logoUrl">
                      {t('digitalPinProducts.logoUrl')}
                    </Label>
                    <Input
                      id="logoUrl"
                      value={productData.logoImage.url}
                      onChange={e =>
                        setProductData(prev => ({
                          ...prev,
                          logoImage: { ...prev.logoImage, url: e.target.value },
                        }))
                      }
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div>
                    <Label htmlFor="logoAlt">
                      {t('digitalPinProducts.logoAlt')}
                    </Label>
                    <Input
                      id="logoAlt"
                      value={productData.logoImage.alt}
                      onChange={e =>
                        setProductData(prev => ({
                          ...prev,
                          logoImage: { ...prev.logoImage, alt: e.target.value },
                        }))
                      }
                      placeholder={t('digitalPinProducts.logoAltPlaceholder')}
                    />
                  </div>
                </div>

                {productData.logoImage.url && (
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-muted-foreground">
                      {t('digitalPinProducts.logoPreview')}:
                    </div>
                    <img
                      src={productData.logoImage.url}
                      alt={productData.logoImage.alt || productData.name}
                      className="w-16 h-16 object-cover rounded border"
                      onError={e => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="space-y-4">
          <ThemeEditor
            onSave={handleThemeChange}
            onCancel={onCancel}
            isLoading={false}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button
          type="submit"
          disabled={isLoading || !productData.name || !currentTheme.name}
        >
          {isLoading ? t('common.loading') : t('common.create')}
        </Button>
      </div>
    </form>
  );
}
