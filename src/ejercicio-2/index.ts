import {Commands} from './comandos';
import * as yargs from 'yargs';
/**
 * Ejecución de los métodos almacenados en la clase Commands
 * mediante la creación de un objeto de esa clase.
 */
const testCommands: Commands = new Commands();

testCommands.catNoPipes();
testCommands.catWithGrep();

yargs.parse();