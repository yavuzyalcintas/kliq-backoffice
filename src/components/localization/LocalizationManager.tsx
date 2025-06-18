import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Plus, Edit, Trash2, Search, BarChart3, FileText } from 'lucide-react';
import { localizationService } from '../../services/localizationService';
import { LocalizationStats } from './LocalizationStats';
import { LocalizationImportExport } from './LocalizationImportExport';

interface LocalizationKey {
  key: string;
  translations: {
    [language: string]: string;
  };
  category?: string;
  description?: string;
}

interface LocalizationManagerProps {
  languages?: string[];
}

export const LocalizationManager: React.FC<LocalizationManagerProps> = ({
  languages = ['en', 'tr'],
}) => {
  const { t, i18n } = useTranslation();
  const [keys, setKeys] = useState<LocalizationKey[]>([]);
  const [filteredKeys, setFilteredKeys] = useState<LocalizationKey[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<LocalizationKey | null>(null);
  const [newKey, setNewKey] = useState<LocalizationKey>({
    key: '',
    translations: {},
    category: '',
    description: '',
  });

  useEffect(() => {
    loadLocalizationKeys();
  }, []);

  useEffect(() => {
    filterKeys();
  }, [keys, searchTerm, selectedCategory]);

  const loadLocalizationKeys = async () => {
    try {
      const loadedKeys = await localizationService.getAllKeys();
      setKeys(loadedKeys);
    } catch (error) {
      console.error('Error loading localization keys:', error);
    }
  };

  const filterKeys = () => {
    let filtered = keys;

    if (searchTerm) {
      filtered = filtered.filter(
        key =>
          key.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
          Object.values(key.translations).some(translation =>
            translation.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(key => key.category === selectedCategory);
    }

    setFilteredKeys(filtered);
  };

  const getCategories = () => {
    const categories = new Set(keys.map(key => key.category).filter(Boolean));
    return Array.from(categories);
  };

  const handleAddKey = async () => {
    try {
      await localizationService.addKey(newKey);
      setNewKey({ key: '', translations: {}, category: '', description: '' });
      setIsAddDialogOpen(false);
      loadLocalizationKeys();
    } catch (error) {
      console.error('Error adding key:', error);
    }
  };

  const handleEditKey = async () => {
    if (!editingKey) return;

    try {
      await localizationService.updateKey(editingKey.key, editingKey);
      setIsEditDialogOpen(false);
      setEditingKey(null);
      loadLocalizationKeys();
    } catch (error) {
      console.error('Error updating key:', error);
    }
  };

  const handleDeleteKey = async (keyToDelete: string) => {
    try {
      await localizationService.deleteKey(keyToDelete);
      loadLocalizationKeys();
    } catch (error) {
      console.error('Error deleting key:', error);
    }
  };

  const openEditDialog = (key: LocalizationKey) => {
    setEditingKey({ ...key });
    setIsEditDialogOpen(true);
  };

  const updateTranslation = (
    language: string,
    value: string,
    isNew = false
  ) => {
    if (isNew) {
      setNewKey(prev => ({
        ...prev,
        translations: { ...prev.translations, [language]: value },
      }));
    } else if (editingKey) {
      setEditingKey(prev => ({
        ...prev!,
        translations: { ...prev!.translations, [language]: value },
      }));
    }
  };

  const handleImportComplete = () => {
    loadLocalizationKeys();
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="keys" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="keys" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>{t('localization.keys', 'Keys')}</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>{t('localization.statistics', 'Statistics')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="import-export"
              className="flex items-center space-x-2"
            >
              <FileText className="w-4 h-4" />
              <span>{t('localization.importExport', 'Import/Export')}</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="keys" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {t('localization.title', 'Localization Management')}
                </CardTitle>
                <Dialog
                  open={isAddDialogOpen}
                  onOpenChange={setIsAddDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      {t('localization.addKey', 'Add Key')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {t(
                          'localization.addNewKey',
                          'Add New Localization Key'
                        )}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">
                          {t('localization.key', 'Key')}
                        </label>
                        <Input
                          value={newKey.key}
                          onChange={e =>
                            setNewKey(prev => ({
                              ...prev,
                              key: e.target.value,
                            }))
                          }
                          placeholder="e.g., common.welcome"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          {t('localization.category', 'Category')}
                        </label>
                        <Input
                          value={newKey.category}
                          onChange={e =>
                            setNewKey(prev => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          placeholder="e.g., common, auth, navigation"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium">
                          {t('localization.description', 'Description')}
                        </label>
                        <Textarea
                          value={newKey.description}
                          onChange={e =>
                            setNewKey(prev => ({
                              ...prev,
                              description: e.target.value,
                            }))
                          }
                          placeholder="Optional description for this key"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          {t('localization.translations', 'Translations')}
                        </label>
                        {languages.map(lang => (
                          <div
                            key={lang}
                            className="flex items-center space-x-2"
                          >
                            <Badge variant="outline" className="w-16">
                              {lang}
                            </Badge>
                            <Input
                              value={newKey.translations[lang] || ''}
                              onChange={e =>
                                updateTranslation(lang, e.target.value, true)
                              }
                              placeholder={`Translation for ${lang}`}
                            />
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => setIsAddDialogOpen(false)}
                        >
                          {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button onClick={handleAddKey}>
                          {t('common.save', 'Save')}
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder={t(
                        'localization.searchKeys',
                        'Search keys or translations...'
                      )}
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue
                      placeholder={t(
                        'localization.selectCategory',
                        'Select Category'
                      )}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t('localization.allCategories', 'All Categories')}
                    </SelectItem>
                    {getCategories()
                      .filter((category): category is string =>
                        Boolean(category)
                      )
                      .map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('localization.key', 'Key')}</TableHead>
                    <TableHead>
                      {t('localization.category', 'Category')}
                    </TableHead>
                    {languages.map(lang => (
                      <TableHead key={lang}>{lang.toUpperCase()}</TableHead>
                    ))}
                    <TableHead>{t('common.actions', 'Actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredKeys.map(key => (
                    <TableRow key={key.key}>
                      <TableCell className="font-mono text-sm">
                        {key.key}
                      </TableCell>
                      <TableCell>
                        {key.category && (
                          <Badge variant="secondary">{key.category}</Badge>
                        )}
                      </TableCell>
                      {languages.map(lang => (
                        <TableCell key={lang} className="max-w-xs">
                          <div
                            className="truncate"
                            title={key.translations[lang]}
                          >
                            {key.translations[lang] || '-'}
                          </div>
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditDialog(key)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  {t('localization.deleteKey', 'Delete Key')}
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  {t(
                                    'localization.deleteKeyConfirmation',
                                    'Are you sure you want to delete the key "{{key}}"? This action cannot be undone.',
                                    { key: key.key }
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>
                                  {t('common.cancel', 'Cancel')}
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteKey(key.key)}
                                >
                                  {t('common.delete', 'Delete')}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {filteredKeys.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm || selectedCategory !== 'all'
                    ? t(
                        'localization.noResults',
                        'No keys found matching your criteria.'
                      )
                    : t('localization.noKeys', 'No localization keys found.')}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {t('localization.editKey', 'Edit Localization Key')}
                </DialogTitle>
              </DialogHeader>
              {editingKey && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      {t('localization.key', 'Key')}
                    </label>
                    <Input value={editingKey.key} disabled />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {t('localization.category', 'Category')}
                    </label>
                    <Input
                      value={editingKey.category || ''}
                      onChange={e =>
                        setEditingKey(prev => ({
                          ...prev!,
                          category: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">
                      {t('localization.description', 'Description')}
                    </label>
                    <Textarea
                      value={editingKey.description || ''}
                      onChange={e =>
                        setEditingKey(prev => ({
                          ...prev!,
                          description: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      {t('localization.translations', 'Translations')}
                    </label>
                    {languages.map(lang => (
                      <div key={lang} className="flex items-center space-x-2">
                        <Badge variant="outline" className="w-16">
                          {lang}
                        </Badge>
                        <Input
                          value={editingKey.translations[lang] || ''}
                          onChange={e =>
                            updateTranslation(lang, e.target.value)
                          }
                          placeholder={`Translation for ${lang}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditDialogOpen(false)}
                    >
                      {t('common.cancel', 'Cancel')}
                    </Button>
                    <Button onClick={handleEditKey}>
                      {t('common.save', 'Save')}
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="stats">
          <LocalizationStats />
        </TabsContent>

        <TabsContent value="import-export">
          <LocalizationImportExport
            languages={languages}
            onImportComplete={handleImportComplete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
