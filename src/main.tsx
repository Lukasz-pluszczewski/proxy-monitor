import React, { useState, useEffect, useCallback } from 'react';
import { render, Box, Text, Newline } from 'ink';
import SelectInput from 'ink-select-input';
import normalizeUrl from './normalizeUrl';

import { GitStatus } from './GitStatus';
import { NpmStatus } from './NpmStatus';
import { setNewProxy } from './setNewProxy';
import { usePersistence } from './usePersistence';

const proxies = {
  HOME: 'http://192.168.1.20:8080',
  OFFICE: 'http://192.168.0.193:8080',
  BRAINHUB_HOUSE: 'http://192.168.8.174:8080',
  DISABLE: null,
};

const Main = () => {
  const [proxyUrl, setProxyUrl] = usePersistence(
    'proxyUrl',
    normalizeUrl(proxies.HOME)
  );
  const handleProxyChange = async (proxy: { label: string; value: string }) => {
    await setNewProxy(normalizeUrl(proxy.value));
    setProxyUrl(normalizeUrl(proxy.value));
  };

  return (
    <Box flexDirection="column">
      <Box flexDirection="column">
        <Box>
          <Text>Config:</Text>
        </Box>
        <Box>
          <Text>PROXY_MONITOR_NPMRC_FILE_PATH: </Text>
          <Text>{process.env.PROXY_MONITOR_NPMRC_FILE_PATH}</Text>
        </Box>
        <Box>
          <Text>PROXY_MONITOR_NPMRC_BACKUP_PATH: </Text>
          <Text>{process.env.PROXY_MONITOR_NPMRC_BACKUP_PATH}</Text>
        </Box>
        <Box>
          <Text>PROXY_MONITOR_NPMRC_TEMPLATE: </Text>
          <Text>{process.env.PROXY_MONITOR_NPMRC_TEMPLATE}</Text>
        </Box>
        <Box>
          <Text>PROXY_MONITOR_PERSISTENCE_FILE: </Text>
          <Text>{process.env.PROXY_MONITOR_PERSISTENCE_FILE}</Text>
        </Box>
        <Box>
          <Text>PROXY_MONITOR_REPO_URL: </Text>
          <Text>{process.env.PROXY_MONITOR_REPO_URL}</Text>
        </Box>
        <Newline />
      </Box>
      <Box>
        <GitStatus proxyUrl={proxyUrl} />
        <NpmStatus proxyUrl={proxyUrl} />
      </Box>
      <Box>
        <SelectInput
          items={Object.entries(proxies).map(([label, value]) => ({
            label: proxyUrl === value ? `# ${label}` : label,
            value,
          }))}
          onSelect={handleProxyChange}
        />
      </Box>
    </Box>
  );
};

render(<Main />);
