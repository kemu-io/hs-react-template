/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const gulp = require('gulp');
const replace = require('gulp-replace');
const strip = require('gulp-strip-comments');
const terser = require('gulp-terser');
const { writeFileSync } = require('fs');

/**
 * 
 * Replaces const enums with enums. Eg:
 * ```typescript
 * // Before
 * export const enum MyEnum {
 *  ...
 * }
 * 
 * // After
 * export enum MyEnum {
 *  ...
 * }
 * ```
 * 
 * Why? Read: https://www.typescriptlang.org/docs/handbook/enums.html
 */
const cleanEnums = () => {
  return gulp.src('dist/**/*.d.ts')
    .pipe(replace(/^(\s*)(export )?(declare )?const enum (\S+) {(\s*)$/gm, '$1$2$3enum $4 {$5'))
    .pipe(gulp.dest('dist'));
};


/** removes comments from js files */
const removeComments = () => {
  return gulp.src('dist/**/*.js')
    .pipe(strip())
    .pipe(gulp.dest('dist'));
};

// Creates `package.json` files for both `dist/cjs` and `dist/mjs`
const createPackages = async () => {
  writeFileSync('dist/mjs/package.json', JSON.stringify({
    type: 'module'
  }));

  writeFileSync('dist/cjs/package.json', JSON.stringify({
    type: 'commonjs'
  }));
};


const minify = () => {
  return gulp.src('dist/**/*.js')
    .pipe(terser())
    .pipe(gulp.dest('dist'));
};

const build = gulp.series(
  cleanEnums,
  removeComments,
  createPackages,
  minify
);

exports.build = build;

