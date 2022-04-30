import {Commands} from './comandos';
import * as yargs from 'yargs';

const testCommands: Commands = new Commands();

testCommands.checkFileOrDirectory();
testCommands.createADirectory();

yargs.parse();