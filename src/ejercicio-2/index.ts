import {Commands} from './comandos';
import * as yargs from 'yargs';

const testCommands = new Commands();

testCommands.catNoPipes();
testCommands.catWithGrep();

yargs.parse();