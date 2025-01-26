/* eslint-disable no-undef */

import gulp from 'gulp';
import { exec } from 'child_process';
import zip from 'gulp-zip';
import { deleteAsync } from 'del';
import { readFileSync, rmSync } from 'fs';
import { writeFile } from 'fs/promises';

// Read a JSON file
const readJsonFile = (filePath) => {
  const fileStr = readFileSync(filePath, 'utf8');
  const file = JSON.parse(fileStr);
  return file;
};

const outputDir = 'build';
const manifest = readJsonFile('./src/manifest.json');
const packageJson = readJsonFile('./package.json');

// Define the service name and version for the zip file name
const serviceName = manifest.name.replace('test.', '');
const version = manifest.version;
// Check if pnpm is used by checking the existence of pnpm-workspace.yml
// const isPnpm = existsSync('pnpm-workspace.yaml');
const isPnpm = false;

/**
 * Get the current platform and architecture
 * @returns {string} The current platform and architecture, e.g. 'osx-arm64'
 */
const getCurrentPlatform = () => {
  const os = process.platform === 'win32' ? 'win' : process.platform === 'darwin' ? 'osx' : '';
  // Get current architecture
  const arch = (() => {
    switch (process.arch) {
      case 'x64': return 'x64';
      case 'ia32': return 'x86';
      case 'arm': return 'arm';
      case 'arm64': return 'arm64';
      default: return '';
    }
  })();

  return `${os}-${arch}`;
};

// Task to run 'npm run pack'
gulp.task('build', (cb) => {
  exec('npm run build', (err, stdout, stderr) => {
    console.log(stdout);
    console.error(stderr);
    cb(err);
  });
});

// Task to copy package.json to the build directory
gulp.task('copy-package-json', async () => {
  if(!isPnpm) {
    return gulp.src('package.json')
      .pipe(gulp.dest(`${outputDir}/`));
  }
});

// Copy all the built files
gulp.task('copy-dist', async () => {
  if(!isPnpm) {
    return gulp.src('dist/**/*')
      .pipe(gulp.dest(`${outputDir}/dist/`));
  }
});

// copy the docs folder
gulp.task('copy-docs', async () => {
  return gulp.src('docs/**/*', { allowEmpty: true })
    .pipe(gulp.dest(`${outputDir}/docs/`));
});

// Remove build directory
gulp.task('clean', () => {
  return deleteAsync([
    outputDir,
  ]);
});

// Task to install production dependencies in the build directory
gulp.task('npm-install-prod', (cb) => {
  exec('npm install --omit=dev --no-save --prefix ./build', (err, stdout, stderr) => {
    console.log(stdout);
    // Windows, npm install creates a symlink to the parent folder in build/node_modules.
    // Here we get rid of it.
    rmSync(`./build/node_modules/${packageJson.name}`, { recursive: true, force: true });
    stderr && console.error(stderr);
    cb(err);
  });
});

// Task to zip the build directory
gulp.task('zip-build', () => {
  return gulp.src(['build/**/**/*'], { dot: true, resolveSymlinks: true })
    .pipe(zip(`${serviceName}@${version}-${getCurrentPlatform()}.zip`))
    .pipe(gulp.dest(`${outputDir}/`));
});

// Delete everything except for the zip file
gulp.task('remove-artifacts', () => {
  return deleteAsync([
    `${outputDir}/**/*`,
    `!${outputDir}/*.zip`,
  ]);
});

// Removes the test. prefix from the manifest name which is not
// allowed in prod services.
gulp.task('patch-manifest', async () => {
  if(manifest.name.startsWith('test.')) {
    manifest.name = manifest.name.slice(5);
  }

  return writeFile('dist/manifest.json', JSON.stringify(manifest, null, 2));
});

// Define the default task
const release = gulp.series(
  'clean',
  'build',
  'copy-dist',
  'copy-docs',
  'patch-manifest',
  'copy-package-json',
  'npm-install-prod',
  'zip-build',
  'remove-artifacts'
);

export { release };
