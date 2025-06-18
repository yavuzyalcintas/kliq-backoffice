import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Plus, Upload, Palette, Eye } from 'lucide-react';
import type {
  ProductTheme,
  PartialImage,
  CreateProductThemeRequest,
  ColorEntry,
  ColorKey,
} from './types';
import {
  AVAILABLE_COLOR_KEYS,
  getColorKeyLabel,
  getDefaultColorValue,
} from './types';
import { useTranslation } from 'react-i18next';

interface ThemeEditorProps {
  theme?: ProductTheme;
  onSave: (themeData: CreateProductThemeRequest) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ThemeEditor({
  theme,
  onSave,
  onCancel,
  isLoading,
}: ThemeEditorProps) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<CreateProductThemeRequest>({
    name: theme?.name || '',
    colors: theme?.colors || [
      { key: 'primary', value: '#FF6B35', label: 'Primary Color' },
      { key: 'secondary', value: '#004E89', label: 'Secondary Color' },
      { key: 'accent', value: '#FFE66D', label: 'Accent Color' },
      { key: 'background', value: '#FFFFFF', label: 'Background Color' },
      { key: 'text', value: '#333333', label: 'Text Color' },
    ],
    bannerImage: {
      url: theme?.bannerImage.url || '',
      width: theme?.bannerImage.width || 1200,
      height: theme?.bannerImage.height || 400,
    },
    partialImages:
      theme?.partialImages.map(p => ({
        name: p.name,
        url: p.url,
        position: p.position,
        size: p.size,
      })) || [],
  });

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedPartialImage, setSelectedPartialImage] = useState<
    number | null
  >(null);

  const handleColorChange = (
    index: number,
    field: keyof ColorEntry,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) =>
        i === index ? { ...color, [field]: value } : color
      ),
    }));
  };

  const addColorEntry = () => {
    // Find the first available color key that's not already used
    const usedKeys = formData.colors.map(c => c.key);
    const availableKey = AVAILABLE_COLOR_KEYS.find(
      key => !usedKeys.includes(key)
    );

    if (availableKey) {
      const newColorEntry: ColorEntry = {
        key: availableKey,
        value: getDefaultColorValue(availableKey),
        label: getColorKeyLabel(availableKey),
      };

      setFormData(prev => ({
        ...prev,
        colors: [...prev.colors, newColorEntry],
      }));
    }
  };

  const removeColorEntry = (index: number) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  };

  const handleColorKeyChange = (index: number, newKey: ColorKey) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.map((color, i) =>
        i === index
          ? {
              ...color,
              key: newKey,
              label: getColorKeyLabel(newKey),
              value: color.value, // Keep existing color value
            }
          : color
      ),
    }));
  };

  const handleBannerImageChange = (
    field: keyof typeof formData.bannerImage,
    value: string | number
  ) => {
    setFormData(prev => ({
      ...prev,
      bannerImage: {
        ...prev.bannerImage,
        [field]: value,
      },
    }));
  };

  const addPartialImage = () => {
    setFormData(prev => ({
      ...prev,
      partialImages: [
        ...prev.partialImages,
        {
          name: `Partial Image ${prev.partialImages.length + 1}`,
          url: '',
          position: { x: 0, y: 0 },
          size: { width: 200, height: 150 },
        },
      ],
    }));
  };

  const updatePartialImage = (
    index: number,
    updates: Partial<Omit<PartialImage, 'id'>>
  ) => {
    setFormData(prev => ({
      ...prev,
      partialImages: prev.partialImages.map((partial, i) =>
        i === index ? { ...partial, ...updates } : partial
      ),
    }));
  };

  const removePartialImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      partialImages: prev.partialImages.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Helper function to get color value by key for preview
  const getColorValueByKey = (key: string): string => {
    const color = formData.colors.find(c => c.key === key);
    return color?.value || '#000000';
  };

  const previewStyle = {
    backgroundColor: getColorValueByKey('background'),
    color: getColorValueByKey('text'),
    '--primary': getColorValueByKey('primary'),
    '--secondary': getColorValueByKey('secondary'),
    '--accent': getColorValueByKey('accent'),
  } as React.CSSProperties;

  // Get available color keys for dropdown (excluding already used ones)
  const getAvailableColorKeys = (currentIndex: number) => {
    const usedKeys = formData.colors
      .map((c, i) => (i !== currentIndex ? c.key : null))
      .filter(Boolean) as ColorKey[];
    return AVAILABLE_COLOR_KEYS.filter(key => !usedKeys.includes(key));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {theme
              ? t('digitalPinProducts.editTheme')
              : t('digitalPinProducts.createTheme')}
          </h2>
          <p className="text-muted-foreground">
            {t('digitalPinProducts.themeEditorDescription')}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" type="button">
                <Eye className="w-4 h-4 mr-2" />
                {t('digitalPinProducts.preview')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  {t('digitalPinProducts.themePreview')}
                </DialogTitle>
              </DialogHeader>
              <div
                style={previewStyle}
                className="p-6 rounded-lg border relative overflow-hidden"
              >
                {formData.bannerImage.url && (
                  <div
                    className="relative rounded-lg overflow-hidden mb-4"
                    style={{
                      height: `${formData.bannerImage.height}px`,
                      maxHeight: '300px',
                    }}
                  >
                    <img
                      src={formData.bannerImage.url}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                    {formData.partialImages.map((partial, index) => (
                      <div
                        key={index}
                        className="absolute border-2 border-accent bg-accent/20"
                        style={{
                          left: `${partial.position.x}px`,
                          top: `${partial.position.y}px`,
                          width: `${partial.size.width}px`,
                          height: `${partial.size.height}px`,
                        }}
                      >
                        {partial.url && (
                          <img
                            src={partial.url}
                            alt={partial.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <h3
                  style={{ color: getColorValueByKey('primary') }}
                  className="text-2xl font-bold mb-2"
                >
                  {formData.name || 'Theme Preview'}
                </h3>
                <div className="flex gap-2 flex-wrap">
                  {formData.colors.map((color, index) => (
                    <Badge
                      key={index}
                      style={{
                        backgroundColor: color.value,
                        color: getColorValueByKey('background'),
                      }}
                    >
                      {color.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">
            {t('digitalPinProducts.basicInfo')}
          </TabsTrigger>
          <TabsTrigger value="colors">
            {t('digitalPinProducts.colors')}
          </TabsTrigger>
          <TabsTrigger value="images">
            {t('digitalPinProducts.images')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('digitalPinProducts.basicInformation')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">
                  {t('digitalPinProducts.themeName')}
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={e =>
                    setFormData(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder={t('digitalPinProducts.enterThemeName')}
                  required
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                {t('digitalPinProducts.colorScheme')}
              </CardTitle>
              <Button
                type="button"
                onClick={addColorEntry}
                size="sm"
                disabled={formData.colors.length >= AVAILABLE_COLOR_KEYS.length}
              >
                <Plus className="w-4 h-4 mr-2" />
                {t('digitalPinProducts.addColor')}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.colors.map((color, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{color.label}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeColorEntry(index)}
                        disabled={formData.colors.length <= 1}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>{t('digitalPinProducts.colorType')}</Label>
                        <Select
                          value={color.key}
                          onValueChange={(value: ColorKey) =>
                            handleColorKeyChange(index, value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {/* Show current selection */}
                            <SelectItem value={color.key}>
                              {getColorKeyLabel(color.key)}
                            </SelectItem>
                            {/* Show other available options (excluding current) */}
                            {AVAILABLE_COLOR_KEYS.filter(
                              key =>
                                key !== color.key &&
                                !formData.colors.some(
                                  (c, i) => i !== index && c.key === key
                                )
                            ).map(key => (
                              <SelectItem key={key} value={key}>
                                {getColorKeyLabel(key)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>{t('digitalPinProducts.colorValue')}</Label>
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={color.value}
                            onChange={e =>
                              handleColorChange(index, 'value', e.target.value)
                            }
                            className="w-12 h-10 p-1 border rounded"
                          />
                          <Input
                            type="text"
                            value={color.value}
                            onChange={e =>
                              handleColorChange(index, 'value', e.target.value)
                            }
                            placeholder="#000000"
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {formData.colors.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Palette className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>{t('digitalPinProducts.noColorsAdded')}</p>
                    <p className="text-sm">
                      {t('digitalPinProducts.addColorHint')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('digitalPinProducts.bannerImage')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="bannerUrl">
                    {t('digitalPinProducts.imageUrl')}
                  </Label>
                  <Input
                    id="bannerUrl"
                    value={formData.bannerImage.url}
                    onChange={e =>
                      handleBannerImageChange('url', e.target.value)
                    }
                    placeholder="https://example.com/banner.jpg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="bannerWidth">
                      {t('digitalPinProducts.width')}
                    </Label>
                    <Input
                      id="bannerWidth"
                      type="number"
                      value={formData.bannerImage.width}
                      onChange={e =>
                        handleBannerImageChange(
                          'width',
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="bannerHeight">
                      {t('digitalPinProducts.height')}
                    </Label>
                    <Input
                      id="bannerHeight"
                      type="number"
                      value={formData.bannerImage.height}
                      onChange={e =>
                        handleBannerImageChange(
                          'height',
                          parseInt(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{t('digitalPinProducts.partialImages')}</CardTitle>
              <Button type="button" onClick={addPartialImage} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                {t('digitalPinProducts.addPartialImage')}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.partialImages.map((partial, index) => (
                <div key={index} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{partial.name}</h4>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removePartialImage(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>{t('digitalPinProducts.imageName')}</Label>
                      <Input
                        value={partial.name}
                        onChange={e =>
                          updatePartialImage(index, { name: e.target.value })
                        }
                        placeholder="Image name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('digitalPinProducts.imageUrl')}</Label>
                      <Input
                        value={partial.url}
                        onChange={e =>
                          updatePartialImage(index, { url: e.target.value })
                        }
                        placeholder="https://example.com/image.png"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>X {t('digitalPinProducts.position')}</Label>
                      <Input
                        type="number"
                        value={partial.position.x}
                        onChange={e =>
                          updatePartialImage(index, {
                            position: {
                              ...partial.position,
                              x: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Y {t('digitalPinProducts.position')}</Label>
                      <Input
                        type="number"
                        value={partial.position.y}
                        onChange={e =>
                          updatePartialImage(index, {
                            position: {
                              ...partial.position,
                              y: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('digitalPinProducts.width')}</Label>
                      <Input
                        type="number"
                        value={partial.size.width}
                        onChange={e =>
                          updatePartialImage(index, {
                            size: {
                              ...partial.size,
                              width: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{t('digitalPinProducts.height')}</Label>
                      <Input
                        type="number"
                        value={partial.size.height}
                        onChange={e =>
                          updatePartialImage(index, {
                            size: {
                              ...partial.size,
                              height: parseInt(e.target.value) || 0,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              ))}

              {formData.partialImages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>{t('digitalPinProducts.noPartialImages')}</p>
                  <p className="text-sm">
                    {t('digitalPinProducts.addPartialImageHint')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? t('common.loading') : t('common.save')}
        </Button>
      </div>
    </form>
  );
}
