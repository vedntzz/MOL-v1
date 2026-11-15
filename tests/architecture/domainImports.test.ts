import { readdirSync, readFileSync, statSync } from 'fs';
import { dirname, join, resolve, sep } from 'path';

const DOMAIN_DIR = resolve(__dirname, '../../src/domain');
const DATA_DIR = resolve(__dirname, '../../src/data');
const SAMPLE_FILE = join(DOMAIN_DIR, 'pricing', 'priceTractor.ts');

// Matches the quoted specifier in: from '…', import '…', import('…'), require('…').
const SPECIFIER = /(?:\bfrom\s*|^\s*import\s*|\bimport\s*\(\s*|\brequire\s*\(\s*)['"]([^'"]+)['"]/gm;

function importSpecifiersIn(source: string): string[] {
  return [...source.matchAll(SPECIFIER)].map((match) => match[1] ?? '');
}

function isReactOrExpoPackage(specifier: string): boolean {
  return /^(react|expo)($|[-/])/.test(specifier) || specifier.startsWith('@expo/');
}

function reachesDataLayer(specifier: string, fromFile: string): boolean {
  if (!specifier.startsWith('.')) return /^src\/data($|\/)/.test(specifier);
  const target = resolve(dirname(fromFile), specifier);
  return target === DATA_DIR || target.startsWith(DATA_DIR + sep);
}

function forbiddenImportsIn(source: string, fromFile: string): string[] {
  return importSpecifiersIn(source).filter(
    (specifier) => isReactOrExpoPackage(specifier) || reachesDataLayer(specifier, fromFile),
  );
}

function domainSourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return domainSourceFiles(path);
    return /\.tsx?$/.test(name) ? [path] : [];
  });
}

describe('domain import scanner', () => {
  test('flags an import from react', () => {
    expect(forbiddenImportsIn("import { useState } from 'react';", SAMPLE_FILE)).toEqual(['react']);
  });

  test('flags an import from react-native', () => {
    expect(forbiddenImportsIn("import { View } from 'react-native';", SAMPLE_FILE)).toEqual(['react-native']);
  });

  test('flags an import from an expo package', () => {
    expect(forbiddenImportsIn("import * as SQLite from 'expo-sqlite';", SAMPLE_FILE)).toEqual(['expo-sqlite']);
  });

  test('flags an import from a scoped @expo package', () => {
    expect(forbiddenImportsIn("import x from '@expo/vector-icons';", SAMPLE_FILE)).toEqual(['@expo/vector-icons']);
  });

  test('flags a require of expo', () => {
    expect(forbiddenImportsIn("const e = require('expo');", SAMPLE_FILE)).toEqual(['expo']);
  });

  test('flags a dynamic import of react', () => {
    expect(forbiddenImportsIn("const r = await import('react');", SAMPLE_FILE)).toEqual(['react']);
  });

  test('flags a relative import that reaches src/data', () => {
    expect(forbiddenImportsIn("import { loadRules } from '../../data/rules/loadRules';", SAMPLE_FILE)).toEqual([
      '../../data/rules/loadRules',
    ]);
  });

  test('flags a type-only import from src/data', () => {
    expect(forbiddenImportsIn("import type { Row } from '../../data/db/schema';", SAMPLE_FILE)).toEqual([
      '../../data/db/schema',
    ]);
  });

  test('flags an absolute src/data import', () => {
    expect(forbiddenImportsIn("import { x } from 'src/data/db/schema';", SAMPLE_FILE)).toEqual(['src/data/db/schema']);
  });

  test('allows an import from another domain module', () => {
    expect(forbiddenImportsIn("import { bandForScore } from '../scoring/bandForScore';", SAMPLE_FILE)).toEqual([]);
  });

  test('allows a package that merely starts with the letters react', () => {
    expect(forbiddenImportsIn("import r from 'reactive-math';", SAMPLE_FILE)).toEqual([]);
  });

  test('allows a domain file named data', () => {
    expect(forbiddenImportsIn("import { d } from './data';", SAMPLE_FILE)).toEqual([]);
  });
});

test('no file in src/domain imports react, expo or src/data', () => {
  const offenders = domainSourceFiles(DOMAIN_DIR).flatMap((file) =>
    forbiddenImportsIn(readFileSync(file, 'utf8'), file).map((spec) => `${file}: ${spec}`),
  );
  expect(offenders).toEqual([]);
});
