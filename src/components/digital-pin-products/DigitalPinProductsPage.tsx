import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DataTable } from '@/components/ui/data-table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus,
  Search,
  Palette,
  Package,
  ShoppingCart,
  Edit,
  Trash2,
  Power,
  PowerOff,
} from 'lucide-react';
import { format } from 'date-fns';
import type { Column } from '@/components/ui/data-table';
import type {
  GroupedProduct,
  SingleProduct,
  ProductTheme,
  CreateGroupedProductRequest,
  CreateProductThemeRequest,
  CreateSingleProductRequest,
} from './types';
import { ThemeEditor } from './ThemeEditor';
import { GroupedProductEditor } from './GroupedProductEditor';
import { digitalPinProductService } from '@/services/digitalPinProductService';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export function DigitalPinProductsPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [isThemeEditorOpen, setIsThemeEditorOpen] = useState(false);
  const [isCreateGroupedOpen, setIsCreateGroupedOpen] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<
    ProductTheme | undefined
  >();
  const [activeTab, setActiveTab] = useState('grouped');
  const [isGroupedProductEditorOpen, setIsGroupedProductEditorOpen] =
    useState(false);
  const [isSingleProductEditorOpen, setIsSingleProductEditorOpen] =
    useState(false);

  // Queries
  const { data: groupedProducts, isLoading: groupedLoading } = useQuery({
    queryKey: ['groupedProducts'],
    queryFn: digitalPinProductService.getGroupedProducts,
  });

  const { data: singleProducts, isLoading: singleLoading } = useQuery({
    queryKey: ['singleProducts'],
    queryFn: digitalPinProductService.getSingleProducts,
  });

  const { data: themes, isLoading: themesLoading } = useQuery({
    queryKey: ['themes'],
    queryFn: digitalPinProductService.getThemes,
  });

  // Mutations
  const createGroupedMutation = useMutation({
    mutationFn: digitalPinProductService.createGroupedProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digitalPinProducts'] });
      queryClient.invalidateQueries({ queryKey: ['groupedProducts'] });
      queryClient.invalidateQueries({ queryKey: ['themes'] });
      toast.success(t('digitalPinProducts.groupedProductCreated'));
      setIsCreateGroupedOpen(false);
    },
    onError: error => {
      toast.error(t('digitalPinProducts.createError'));
      console.error('Error creating grouped product:', error);
    },
  });

  const updateThemeMutation = useMutation({
    mutationFn: ({
      themeId,
      data,
    }: {
      themeId: string;
      data: CreateProductThemeRequest;
    }) => digitalPinProductService.updateTheme(themeId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themes'] });
      queryClient.invalidateQueries({ queryKey: ['groupedProducts'] });
      toast.success(t('digitalPinProducts.themeUpdated'));
      setIsThemeEditorOpen(false);
      setSelectedTheme(undefined);
    },
    onError: error => {
      toast.error(t('digitalPinProducts.updateError'));
      console.error('Error updating theme:', error);
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: digitalPinProductService.toggleProductStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digitalPinProducts'] });
      queryClient.invalidateQueries({ queryKey: ['groupedProducts'] });
      queryClient.invalidateQueries({ queryKey: ['singleProducts'] });
      toast.success(t('digitalPinProducts.statusUpdated'));
    },
    onError: error => {
      toast.error(t('digitalPinProducts.statusUpdateError'));
      console.error('Error toggling status:', error);
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: digitalPinProductService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digitalPinProducts'] });
      queryClient.invalidateQueries({ queryKey: ['groupedProducts'] });
      queryClient.invalidateQueries({ queryKey: ['singleProducts'] });
      toast.success(t('digitalPinProducts.productDeleted'));
    },
    onError: error => {
      toast.error(t('digitalPinProducts.deleteError'));
      console.error('Error deleting product:', error);
    },
  });

  const createSingleProductMutation = useMutation({
    mutationFn: digitalPinProductService.createSingleProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['digitalPinProducts'] });
      queryClient.invalidateQueries({ queryKey: ['singleProducts'] });
      toast.success(t('digitalPinProducts.singleProductCreated'));
      setIsSingleProductEditorOpen(false);
    },
    onError: error => {
      toast.error(t('digitalPinProducts.createError'));
      console.error('Error creating single product:', error);
    },
  });

  // Table columns for grouped products
  const groupedProductColumns: Column<GroupedProduct>[] = [
    {
      header: t('digitalPinProducts.logo'),
      accessorKey: 'logoImage',
      cell: product => (
        <div className="flex items-center justify-center w-12 h-12">
          {product.logoImage?.url ? (
            <img
              src={product.logoImage.url}
              alt={product.logoImage.alt || product.name}
              className="w-10 h-10 object-cover rounded border"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center">
              <Package className="w-5 h-5 text-gray-400" />
            </div>
          )}
        </div>
      ),
    },
    {
      header: t('digitalPinProducts.name'),
      accessorKey: 'name',
      sortable: true,
      sortType: 'string',
    },
    {
      header: t('digitalPinProducts.description'),
      accessorKey: 'description',
      cell: product => (
        <span className="text-muted-foreground truncate max-w-xs">
          {product.description}
        </span>
      ),
    },
    {
      header: t('digitalPinProducts.theme'),
      accessorKey: 'theme',
      cell: product => (
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded border"
            style={{
              backgroundColor:
                product.theme.colors.find(c => c.key === 'primary')?.value ||
                '#000000',
            }}
          />
          <span>{product.theme.name}</span>
        </div>
      ),
      sortable: true,
      sortType: 'string',
    },
    {
      header: t('digitalPinProducts.products'),
      accessorKey: 'singleProducts',
      cell: product => (
        <Badge variant="secondary">
          {product.singleProducts.length} {t('digitalPinProducts.products')}
        </Badge>
      ),
    },
    {
      header: t('digitalPinProducts.status'),
      accessorKey: 'isActive',
      cell: product => (
        <Badge variant={product.isActive ? 'default' : 'secondary'}>
          {product.isActive
            ? t('digitalPinProducts.active')
            : t('digitalPinProducts.inactive')}
        </Badge>
      ),
      sortable: true,
      sortType: 'string',
    },
    {
      header: t('digitalPinProducts.created'),
      accessorKey: 'createdAt',
      cell: product => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(product.createdAt), 'MMM dd, yyyy')}
        </span>
      ),
      sortable: true,
      sortType: 'date',
    },
    {
      header: t('digitalPinProducts.actions'),
      accessorKey: 'id',
      cell: product => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedTheme(product.theme);
              setIsThemeEditorOpen(true);
            }}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleStatusMutation.mutate(product.id)}
          >
            {product.isActive ? (
              <PowerOff className="w-4 h-4" />
            ) : (
              <Power className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteProductMutation.mutate(product.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Table columns for single products
  const singleProductColumns: Column<SingleProduct>[] = [
    {
      header: t('digitalPinProducts.logo'),
      accessorKey: 'logoImage',
      cell: product => (
        <div className="flex items-center justify-center w-12 h-12">
          {product.logoImage?.url ? (
            <img
              src={product.logoImage.url}
              alt={product.logoImage.alt || product.name}
              className="w-10 h-10 object-cover rounded border"
            />
          ) : (
            <div className="w-10 h-10 bg-gray-100 rounded border flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-gray-400" />
            </div>
          )}
        </div>
      ),
    },
    {
      header: t('digitalPinProducts.name'),
      accessorKey: 'name',
      sortable: true,
      sortType: 'string',
    },
    {
      header: t('digitalPinProducts.description'),
      accessorKey: 'description',
      cell: product => (
        <span className="text-muted-foreground truncate max-w-xs">
          {product.description}
        </span>
      ),
    },
    {
      header: t('digitalPinProducts.price'),
      accessorKey: 'price',
      cell: product => <span className="font-semibold">${product.price}</span>,
      sortable: true,
      sortType: 'number',
    },
    {
      header: t('digitalPinProducts.groupedProduct'),
      accessorKey: 'groupedProductId',
      cell: product => {
        if (!product.groupedProductId) {
          return (
            <Badge variant="outline">
              {t('digitalPinProducts.standalone')}
            </Badge>
          );
        }
        const grouped = groupedProducts?.find(
          g => g.id === product.groupedProductId
        );
        return grouped ? (
          <Badge variant="secondary">{grouped.name}</Badge>
        ) : (
          <Badge variant="destructive">
            {t('digitalPinProducts.notFound')}
          </Badge>
        );
      },
    },
    {
      header: t('digitalPinProducts.status'),
      accessorKey: 'isActive',
      cell: product => (
        <Badge variant={product.isActive ? 'default' : 'secondary'}>
          {product.isActive
            ? t('digitalPinProducts.active')
            : t('digitalPinProducts.inactive')}
        </Badge>
      ),
      sortable: true,
      sortType: 'string',
    },
    {
      header: t('digitalPinProducts.created'),
      accessorKey: 'createdAt',
      cell: product => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(product.createdAt), 'MMM dd, yyyy')}
        </span>
      ),
      sortable: true,
      sortType: 'date',
    },
    {
      header: t('digitalPinProducts.actions'),
      accessorKey: 'id',
      cell: product => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleStatusMutation.mutate(product.id)}
          >
            {product.isActive ? (
              <PowerOff className="w-4 h-4" />
            ) : (
              <Power className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => deleteProductMutation.mutate(product.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  // Filter data based on search term
  const filteredGroupedProducts =
    groupedProducts?.filter(
      product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.theme.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const filteredSingleProducts =
    singleProducts?.filter(
      product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleCreateGroupedProduct = (data: CreateGroupedProductRequest) => {
    createGroupedMutation.mutate(data);
  };

  const handleUpdateTheme = (data: CreateProductThemeRequest) => {
    if (selectedTheme) {
      updateThemeMutation.mutate({
        themeId: selectedTheme.id,
        data,
      });
    }
  };

  // SingleProduct creation dialog
  const SingleProductEditor = () => {
    const [productData, setProductData] = useState({
      name: '',
      description: '',
      price: 0,
      logoImage: {
        url: '',
        alt: '',
      },
      groupedProductId: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      const singleProductData: CreateSingleProductRequest = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        logoImage: productData.logoImage.url
          ? {
              url: productData.logoImage.url,
              alt: productData.logoImage.alt || productData.name,
            }
          : undefined,
        groupedProductId: productData.groupedProductId || undefined,
      };

      createSingleProductMutation.mutate(singleProductData);
    };

    return (
      <Dialog
        open={isSingleProductEditorOpen}
        onOpenChange={setIsSingleProductEditorOpen}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {t('digitalPinProducts.createSingleProduct')}
            </DialogTitle>
            <DialogDescription>
              {t('digitalPinProducts.singleProductDescription')}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="singleProductName">
                  {t('digitalPinProducts.productName')}
                </Label>
                <Input
                  id="singleProductName"
                  value={productData.name}
                  onChange={e =>
                    setProductData(prev => ({ ...prev, name: e.target.value }))
                  }
                  placeholder={t('digitalPinProducts.enterProductName')}
                  required
                />
              </div>
              <div>
                <Label htmlFor="singleProductPrice">
                  {t('digitalPinProducts.price')}
                </Label>
                <Input
                  id="singleProductPrice"
                  type="number"
                  min="0"
                  step="0.01"
                  value={productData.price}
                  onChange={e =>
                    setProductData(prev => ({
                      ...prev,
                      price: parseFloat(e.target.value) || 0,
                    }))
                  }
                  placeholder="0.00"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="singleProductDescription">
                {t('digitalPinProducts.productDescription')}
              </Label>
              <Textarea
                id="singleProductDescription"
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

            <div>
              <Label htmlFor="groupedProductSelect">
                {t('digitalPinProducts.groupedProduct')}{' '}
                {t('digitalPinProducts.optional')}
              </Label>
              <Select
                value={productData.groupedProductId}
                onValueChange={value =>
                  setProductData(prev => ({ ...prev, groupedProductId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t('digitalPinProducts.selectGroupedProduct')}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">
                    {t('digitalPinProducts.standalone')}
                  </SelectItem>
                  {groupedProducts?.map(grouped => (
                    <SelectItem key={grouped.id} value={grouped.id}>
                      {grouped.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>
                {t('digitalPinProducts.logoImage')}{' '}
                {t('digitalPinProducts.optional')}
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="singleLogoUrl">
                    {t('digitalPinProducts.logoUrl')}
                  </Label>
                  <Input
                    id="singleLogoUrl"
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
                  <Label htmlFor="singleLogoAlt">
                    {t('digitalPinProducts.logoAlt')}
                  </Label>
                  <Input
                    id="singleLogoAlt"
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsSingleProductEditorOpen(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                disabled={
                  createSingleProductMutation.isPending ||
                  !productData.name ||
                  productData.price <= 0
                }
              >
                {createSingleProductMutation.isPending
                  ? t('common.loading')
                  : t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t('digitalPinProducts.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('digitalPinProducts.description')}
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog
            open={isCreateGroupedOpen}
            onOpenChange={setIsCreateGroupedOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                {t('digitalPinProducts.createGroupedProduct')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {t('digitalPinProducts.createGroupedProduct')}
                </DialogTitle>
              </DialogHeader>
              <GroupedProductEditor
                onSave={handleCreateGroupedProduct}
                onCancel={() => setIsCreateGroupedOpen(false)}
                isLoading={createGroupedMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder={t('digitalPinProducts.searchPlaceholder')}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="grouped" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            {t('digitalPinProducts.groupedProducts')}
            {groupedProducts && (
              <Badge variant="secondary" className="ml-2">
                {groupedProducts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="single" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            {t('digitalPinProducts.singleProducts')}
            {singleProducts && (
              <Badge variant="secondary" className="ml-2">
                {singleProducts.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="themes" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            {t('digitalPinProducts.themes')}
            {themes && (
              <Badge variant="secondary" className="ml-2">
                {themes.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="grouped" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('digitalPinProducts.groupedProducts')}</CardTitle>
            </CardHeader>
            <CardContent>
              {groupedLoading ? (
                <div className="text-center py-8">
                  <p>{t('common.loading')}</p>
                </div>
              ) : (
                <DataTable
                  columns={groupedProductColumns}
                  data={filteredGroupedProducts}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="single" className="space-y-4">
          <div className="flex justify-between items-center">
            <div></div>
            <Button onClick={() => setIsSingleProductEditorOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              {t('digitalPinProducts.createSingleProduct')}
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>{t('digitalPinProducts.singleProducts')}</CardTitle>
            </CardHeader>
            <CardContent>
              {singleLoading ? (
                <div className="text-center py-8">
                  <p>{t('common.loading')}</p>
                </div>
              ) : (
                <DataTable
                  columns={singleProductColumns}
                  data={filteredSingleProducts}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="themes" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {themesLoading ? (
              <div className="col-span-full text-center py-8">
                <p>{t('common.loading')}</p>
              </div>
            ) : (
              themes?.map(theme => (
                <Card key={theme.id} className="overflow-hidden">
                  <div
                    className="h-32 bg-gradient-to-r relative"
                    style={{
                      background: `linear-gradient(135deg, ${
                        theme.colors.find(c => c.key === 'primary')?.value ||
                        '#FF6B35'
                      }, ${
                        theme.colors.find(c => c.key === 'secondary')?.value ||
                        '#004E89'
                      })`,
                    }}
                  >
                    {theme.bannerImage.url && (
                      <img
                        src={theme.bannerImage.url}
                        alt={theme.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <h3 className="text-white font-semibold truncate">
                        {theme.name}
                      </h3>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex gap-1">
                        {theme.colors.slice(0, 3).map((color, index) => (
                          <div
                            key={color.key}
                            className="w-4 h-4 rounded border"
                            style={{ backgroundColor: color.value }}
                            title={`${color.label}: ${color.value}`}
                          />
                        ))}
                      </div>
                      <Badge variant="outline">
                        {theme.partialImages.length}{' '}
                        {t('digitalPinProducts.partialImages')}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedTheme(theme);
                          setIsThemeEditorOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {t('common.edit')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Theme Editor Dialog */}
      <Dialog open={isThemeEditorOpen} onOpenChange={setIsThemeEditorOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedTheme
                ? t('digitalPinProducts.editTheme')
                : t('digitalPinProducts.createTheme')}
            </DialogTitle>
          </DialogHeader>
          <ThemeEditor
            theme={selectedTheme}
            onSave={handleUpdateTheme}
            onCancel={() => {
              setIsThemeEditorOpen(false);
              setSelectedTheme(undefined);
            }}
            isLoading={updateThemeMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <SingleProductEditor />
    </div>
  );
}
