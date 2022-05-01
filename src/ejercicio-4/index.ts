import {Commands} from './comandos';
import * as yargs from 'yargs';
/**
 * Ejecución de los métodos almacenados en la clase Commands
 * mediante la creación de un objeto de esa clase.
 */
const testCommands: Commands = new Commands();

testCommands.checkFileOrDirectory();
testCommands.createADirectory();
testCommands.listFilesfromDirectory();
testCommands.showContent();
testCommands.removeFileOrDirectory();
testCommands.CopyMoveFileOrDirectory();

yargs.parse();