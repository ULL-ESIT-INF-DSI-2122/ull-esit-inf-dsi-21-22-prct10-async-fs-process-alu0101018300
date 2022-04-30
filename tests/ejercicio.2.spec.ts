import 'mocha';
import { expect } from 'chai';

import { Commands } from '../src/ejercicio-2/comandos'

const test: Commands = new Commands();

describe('test Comandos class constructor', () => {
    it('new Commands() returns a Commands Object', () => {
      expect(test).to.be.instanceof(Commands); 
    });
  });

describe('test Comando cat', () => {
  it('object.catFile() returns the correct result', () => {
    expect(test.catFile("pruebas.txt")).to.eq(true); 
  });
});

describe('test Comando grep', () => {
  it('object.grepFile() returns the correct result', () => {
    expect(test.grepFile("pruebas.txt", "pruebas")).to.eq(true); 
  });
});

