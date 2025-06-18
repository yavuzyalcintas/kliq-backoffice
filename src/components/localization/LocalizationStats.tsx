import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { localizationService } from '@/services/localizationService';

interface TranslationStats {
  totalKeys: number;
  languages: {
    [lang: string]: {
      total: number;
      missing: number;
      complete: number;
    };
  };
}

export const LocalizationStats: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<TranslationStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const translationStats = await localizationService.getTranslationStats();
      setStats(translationStats);
    } catch (error) {
      console.error('Error loading translation stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {t('localization.translationStats', 'Translation Statistics')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            {t('common.loading', 'Loading...')}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t('localization.translationStats', 'Translation Statistics')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {t('localization.totalKeys', 'Total Keys')}
            </span>
            <Badge variant="outline">{stats.totalKeys}</Badge>
          </div>

          {Object.entries(stats.languages).map(([language, languageStats]) => {
            const percentage =
              stats.totalKeys > 0
                ? (languageStats.complete / stats.totalKeys) * 100
                : 0;

            return (
              <div key={language} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="uppercase">
                      {language}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {languageStats.complete} / {languageStats.total}
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {t('localization.complete', 'Complete')}:{' '}
                    {languageStats.complete}
                  </span>
                  <span>
                    {t('localization.missing', 'Missing')}:{' '}
                    {languageStats.missing}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
