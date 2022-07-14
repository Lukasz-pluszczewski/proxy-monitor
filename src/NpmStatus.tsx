import React, { useState, useEffect, useCallback } from 'react';
import { Box, Newline, Text } from 'ink';
import Spinner from 'ink-spinner';
import swich from 'swich';
import normalizeUrl from './normalizeUrl';
import { OkSymbol } from './OkSymbol';
import { ErrorSymbol } from './ErrorSymbol';
import { STATUS } from './constants';
import { execCommand } from './execCommand';
import { jsonParse } from './jsonParse';

export const getNpmConfig = async () => {
  const stdout = await execCommand(['npm', 'config', 'list', '--json']);

  return jsonParse(stdout);
};

export const NpmStatus = ({ proxyUrl }) => {
  const [status, setStatus] = useState(STATUS.LOADING);
  const [httpProxy, setHttpProxy] = useState(null);
  const [httpsProxy, setHttpsProxy] = useState(null);
  const [globalConfig, setGlobalConfig] = useState(null);

  const checkStatus = useCallback(async () => {
    const config = await getNpmConfig();

    setStatus(
      normalizeUrl(config.proxy) === proxyUrl &&
        normalizeUrl(config['https-proxy']) === proxyUrl
        ? STATUS.OK
        : STATUS.ERROR
    );
    setHttpProxy(config.proxy);
    setHttpsProxy(config['https-proxy']);
    setGlobalConfig(config.globalconfig);
  }, [proxyUrl]);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, [proxyUrl, checkStatus]);

  return (
    <Box paddingX={2} borderStyle="single">
      <Text>
        <Text>
          {swich([
            [STATUS.LOADING, <Spinner type="dots" />],
            [STATUS.OK, <OkSymbol />],
            [STATUS.ERROR, <ErrorSymbol />],
          ])(status)}
        </Text>
        <Text bold> NPM proxy config</Text>
        <Newline />
        <Text>HTTP proxy: {httpProxy}</Text>
        <Newline />
        <Text>HTTPS proxy: {httpsProxy}</Text>
        <Newline />
        <Text>.npmrc path: {globalConfig}</Text>
      </Text>
    </Box>
  );
};
