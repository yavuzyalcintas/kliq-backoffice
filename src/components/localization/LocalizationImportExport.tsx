import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, Upload, FileText } from 'lucide-react';
import { localizationService } from '@/services/localizationService';

interface LocalizationImportExportProps {
  languages?: string[];
  onImportComplete?: () => void;
}

export const LocalizationImportExport: React.FC<
  LocalizationImportExportProps
> = ({ languages = ['en', 'tr'], onImportComplete }) => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/json') {
      setImportFile(file);
    } else {
      alert('Please select a valid JSON file');
    }
  };

  const handleImport = async () => {
    if (!importFile || !selectedLanguage) {
      alert('Please select both a language and a file');
      return;
    }

    try {
      setImporting(true);
      const text = await importFile.text();
      const translations = JSON.parse(text);

      await localizationService.importTranslations(
        selectedLanguage,
        translations
      );

      setImportFile(null);
      setSelectedLanguage('');
      if (onImportComplete) {
        onImportComplete();
      }

      alert(
        `Successfully imported ${Object.keys(translations).length} translations for ${selectedLanguage}`
      );
    } catch (error) {
      console.error('Error importing translations:', error);
      alert('Error importing translations. Please check the file format.');
    } finally {
      setImporting(false);
    }
  };

  const handleExport = async () => {
    if (!selectedLanguage) {
      alert('Please select a language to export');
      return;
    }

    try {
      setExporting(true);
      const translations =
        await localizationService.exportTranslations(selectedLanguage);

      // Create and download file
      const blob = new Blob([JSON.stringify(translations, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `translations-${selectedLanguage}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert(
        `Successfully exported ${Object.keys(translations).length} translations for ${selectedLanguage}`
      );
    } catch (error) {
      console.error('Error exporting translations:', error);
      alert('Error exporting translations');
    } finally {
      setExporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>{t('localization.importExport', 'Import / Export')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Language Selection */}
          <div className="space-y-2">
            <Label>{t('localization.selectLanguage', 'Select Language')}</Label>
            <Select
              value={selectedLanguage}
              onValueChange={setSelectedLanguage}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t(
                    'localization.selectLanguage',
                    'Select Language'
                  )}
                />
              </SelectTrigger>
              <SelectContent>
                {languages.map(lang => (
                  <SelectItem key={lang} value={lang}>
                    {lang.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Import Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Upload className="w-4 h-4" />
              <h3 className="font-medium">
                {t('localization.importTranslations', 'Import Translations')}
              </h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="import-file">
                {t('localization.uploadFile', 'Upload JSON file')}
              </Label>
              <Input
                id="import-file"
                type="file"
                accept=".json"
                onChange={handleFileChange}
                disabled={importing}
              />
            </div>

            <Button
              onClick={handleImport}
              disabled={!importFile || !selectedLanguage || importing}
              className="w-full"
            >
              {importing
                ? t('common.loading', 'Loading...')
                : t('localization.import', 'Import')}
            </Button>
          </div>

          {/* Export Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <h3 className="font-medium">
                {t('localization.exportTranslations', 'Export Translations')}
              </h3>
            </div>

            <Button
              onClick={handleExport}
              disabled={!selectedLanguage || exporting}
              className="w-full"
            >
              {exporting
                ? t('common.loading', 'Loading...')
                : t('localization.export', 'Export')}
            </Button>
          </div>

          {/* Instructions */}
          <div className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Import Format:</strong> JSON file with key-value pairs
            </p>
            <p>
              <strong>Export Format:</strong> JSON file with all translations
              for selected language
            </p>
            <p>
              <strong>Example:</strong> {'{'}"common.welcome": "Welcome"{'}'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
