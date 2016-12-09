#!/usr/bin/env node

import path from 'path';
import program from 'commander';
import shelljs from 'shelljs';
import Server from '../server';

program
  .option('-h, --host <host>', 'host to listen on')
  .option('-p, --port <port>', 'port to listen on')
  .option('-c, --config-dir [dir-name]', 'storybook config directory')
  .option('-r, --react-native-dir [dir-name]', 'react native directory')
  .parse(process.argv);

const projectDir = path.resolve();
const configDir = path.resolve(program.configDir || './storybook');
const reactNativeDir = path.resolve(program.reactNativeDir || 'node_modules/react-native');
const listenAddr = [program.port];
if (program.host) {
  listenAddr.push(program.host);
}

const server = new Server({configDir});
server.listen(...listenAddr, function (err) {
  if (err) {
    throw err;
  }
  const address = `http://${program.host || 'localhost'}:${program.port}/`;
  console.info(`\nReact Native Storybook started on => ${address}\n`);
});

// RN packager
shelljs.exec([
  `node ${reactNativeDir}/local-cli/cli.js start`,
  `--projectRoots ${configDir}`,
  `--root ${projectDir}`,
].join(' '), {async: true});
