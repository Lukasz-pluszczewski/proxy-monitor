import React, { useState, useEffect, useCallback } from 'react';
import { simpleGit, SimpleGitOptions } from 'simple-git';
import normalizeUrl from './normalizeUrl';
import { Box, Newline, Text } from 'ink';
import Spinner from 'ink-spinner';
import swich from 'swich';
import { OkSymbol } from './OkSymbol';
import { ErrorSymbol } from './ErrorSymbol';
import { STATUS } from './constants';

export const gitOptions: Partial<SimpleGitOptions> = {
  baseDir: process.cwd(),
  binary: 'git',
  maxConcurrentProcesses: 6,
};

export const GitStatus = ({ proxyUrl }) => {
  const [status, setStatus] = useState(STATUS.LOADING);
  const [git, setGit] = useState(null);
  const [currentConfig, setCurrentConfig] = useState(null);

  useEffect(() => {
    setGit(simpleGit(gitOptions));
  }, []);

  const checkStatus = useCallback(async () => {
    if (git) {
      const result = await git.getConfig(
        `http.https://${process.env.PROXY_MONITOR_REPO_URL}.proxy`,
        'global'
      );
      setCurrentConfig(result.value);
      if (result.value === 'null' && !proxyUrl) {
        setStatus(STATUS.OK);
      } else {
        setStatus(
          normalizeUrl(result.value) === proxyUrl ? STATUS.OK : STATUS.ERROR
        );
      }
    }
  }, [proxyUrl, git]);

  useEffect(() => {
    checkStatus();
    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, [git, proxyUrl, checkStatus]);

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
        <Text bold> GIT proxy config</Text>
        <Newline />
        <Text>Proxy: {currentConfig}</Text>
      </Text>
    </Box>
  );
};
