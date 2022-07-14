import { useState, useEffect, useCallback } from 'react';
import { loadFileContents, saveFileContents } from './fsUtils';
import { jsonParse } from './jsonParse';

const persistenceFilePath = process.env.PROXY_MONITOR_PERSISTENCE_FILE;

export const usePersistence = <T>(
  key: string,
  initialValue: T = null
): [T, (newValue: T) => void] => {
  const [value, setValue] = useState(initialValue);
  useEffect(async () => {
    const fileContents = await loadFileContents(persistenceFilePath);
    const parsed = jsonParse(fileContents);
    if (!(key in parsed)) {
      parsed[key] = initialValue;
      await saveFileContents(persistenceFilePath, JSON.stringify(parsed));
    }
    setValue(parsed[key]);
  }, [key]);

  const handleValueChange = useCallback(
    async (newValue: T) => {
      setValue(newValue);
      const fileContents = await loadFileContents(persistenceFilePath);
      const parsed = jsonParse(fileContents);
      parsed[key] = newValue;
      await saveFileContents(persistenceFilePath, JSON.stringify(parsed));
    },
    [key]
  );

  return [value, handleValueChange];
};
