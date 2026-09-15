import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const downloadableDocuments = ['resume.md', 'career-description.md'];

function includeDownloadableDocuments() {
  return {
    name: 'include-downloadable-documents',
    generateBundle() {
      downloadableDocuments.forEach((fileName) => {
        this.emitFile({
          type: 'asset',
          fileName: `docs/${fileName}`,
          source: readFileSync(resolve(process.cwd(), 'docs', fileName), 'utf8'),
        });
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), includeDownloadableDocuments()],
});
