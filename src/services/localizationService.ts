export interface LocalizationKey {
  key: string;
  translations: {
    [language: string]: string;
  };
  category?: string;
  description?: string;
}

// In-memory storage for localization keys
const localizationKeys: LocalizationKey[] = [];

export const localizationService = {
  /**
   * Get all localization keys
   */
  getAllKeys: async (): Promise<LocalizationKey[]> => {
    return Promise.resolve([...localizationKeys]);
  },

  /**
   * Get a specific localization key
   */
  getKey: async (key: string): Promise<LocalizationKey | null> => {
    const foundKey = localizationKeys.find(k => k.key === key);
    return Promise.resolve(foundKey || null);
  },

  /**
   * Add a new localization key
   */
  addKey: async (keyData: LocalizationKey): Promise<void> => {
    // Validate key format
    if (!keyData.key || keyData.key.trim() === '') {
      throw new Error('Key is required');
    }

    // Check if key already exists
    const existingKey = localizationKeys.find(k => k.key === keyData.key);
    if (existingKey) {
      throw new Error(`Key "${keyData.key}" already exists`);
    }

    // Add the new key
    localizationKeys.push({
      ...keyData,
      key: keyData.key.trim(),
    });

    // In a real application, you would save to backend here
    console.log('Added new localization key:', keyData);
  },

  /**
   * Update an existing localization key
   */
  updateKey: async (
    key: string,
    keyData: Partial<LocalizationKey>
  ): Promise<void> => {
    const existingKeyIndex = localizationKeys.findIndex(k => k.key === key);
    if (existingKeyIndex === -1) {
      throw new Error(`Key "${key}" not found`);
    }

    // Update the key
    const existingKey = localizationKeys[existingKeyIndex]!;
    localizationKeys[existingKeyIndex] = {
      ...existingKey,
      ...keyData,
      key: key, // Ensure key doesn't change
      translations: keyData.translations ?? existingKey.translations,
    };

    // In a real application, you would save to backend here
    console.log('Updated localization key:', key, keyData);
  },

  /**
   * Delete a localization key
   */
  deleteKey: async (key: string): Promise<void> => {
    const existingKeyIndex = localizationKeys.findIndex(k => k.key === key);
    if (existingKeyIndex === -1) {
      throw new Error(`Key "${key}" not found`);
    }

    // Remove the key
    localizationKeys.splice(existingKeyIndex, 1);

    // In a real application, you would save to backend here
    console.log('Deleted localization key:', key);
  },

  /**
   * Search localization keys
   */
  searchKeys: async (
    query: string,
    category?: string
  ): Promise<LocalizationKey[]> => {
    let filtered = localizationKeys;

    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        key =>
          key.key.toLowerCase().includes(lowerQuery) ||
          Object.values(key.translations).some(translation =>
            translation.toLowerCase().includes(lowerQuery)
          ) ||
          (key.description &&
            key.description.toLowerCase().includes(lowerQuery))
      );
    }

    if (category && category !== 'all') {
      filtered = filtered.filter(key => key.category === category);
    }

    return Promise.resolve(filtered);
  },

  /**
   * Get categories
   */
  getCategories: async (): Promise<string[]> => {
    const categories = new Set(
      localizationKeys
        .map(key => key.category)
        .filter((category): category is string => Boolean(category))
    );
    return Promise.resolve(Array.from(categories));
  },

  /**
   * Export translations to JSON format
   */
  exportTranslations: async (
    language: string
  ): Promise<Record<string, string>> => {
    const translations: Record<string, string> = {};

    localizationKeys.forEach(key => {
      if (key.translations[language]) {
        translations[key.key] = key.translations[language];
      }
    });

    return Promise.resolve(translations);
  },

  /**
   * Import translations from JSON format
   */
  importTranslations: async (
    language: string,
    translations: Record<string, string>
  ): Promise<void> => {
    for (const [key, value] of Object.entries(translations)) {
      const existingKey = localizationKeys.find(k => k.key === key);
      if (existingKey) {
        existingKey.translations[language] = value;
      } else {
        localizationKeys.push({
          key,
          translations: { [language]: value },
          category: 'imported',
        });
      }
    }

    // In a real application, you would save to backend here
    console.log(
      `Imported ${Object.keys(translations).length} translations for language: ${language}`
    );
  },

  /**
   * Get missing translations for a language
   */
  getMissingTranslations: async (
    language: string
  ): Promise<LocalizationKey[]> => {
    const missing = localizationKeys.filter(key => !key.translations[language]);
    return Promise.resolve(missing);
  },

  /**
   * Get translation statistics
   */
  getTranslationStats: async (): Promise<{
    totalKeys: number;
    languages: {
      [lang: string]: { total: number; missing: number; complete: number };
    };
  }> => {
    const languages = new Set<string>();
    localizationKeys.forEach(key => {
      Object.keys(key.translations).forEach(lang => languages.add(lang));
    });

    const stats = {
      totalKeys: localizationKeys.length,
      languages: {} as {
        [lang: string]: { total: number; missing: number; complete: number };
      },
    };

    languages.forEach(lang => {
      const total = localizationKeys.length;
      const complete = localizationKeys.filter(
        key => key.translations[lang]
      ).length;
      const missing = total - complete;

      stats.languages[lang] = { total, missing, complete };
    });

    return Promise.resolve(stats);
  },
};
