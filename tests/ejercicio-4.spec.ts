import 'mocha';
import { expect } from 'chai';

import { Commands } from '../src/ejercicio-4/comandos'

/**
 * Objeto para las pruebas
 */
const test: Commands = new Commands();

describe('test Comandos class constructor', () => {
    it('new Commands() returns a Commands Object', () => {
      expect(test).to.be.instanceof(Commands); 
    });
  });

describe('test Comando check', () => {
  it('object.FileOrDirectory() returns the correct result', () => {
    expect(test.FileOrDirectory("pruebas.txt")).to.eq(true); 
  });
});

describe('test Comando cat', () => {
  it('object.catFunction() returns the correct result', () => {
    expect(test.catFunction("pruebas.txt")).to.eq(true); 
  });
});

describe('test Comando mkdir', () => {
  it('object.newDir() returns the correct result', () => {
    expect(test.newDir("hola")).to.eq(true); 
  });
});

describe('test Comando move', () => {
  it('object.move() returns the correct result', () => {
    expect(test.move("pruebas.txt", "./hola", false)).to.eq(true); 
  });
});

describe('test Comando rm', () => {
  it('object.remove() returns the correct result', () => {
    expect(test.remove("./hola/pruebas.txt")).to.eq(true); 
  });
  it('object.remove() returns the correct result', () => {
    expect(test.remove("hola")).to.eq(true); 
  });
});

describe('test Comando list', () => {
  it('object.list() returns the correct result', () => {
    expect(test.list("./tests")).to.eq(true); 
  });
});

