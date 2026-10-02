import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();

console.log('🧪 =========================================================================');
console.log('🧪 SUITE AGENTEST 008: PRUEBAS EN POSTMAN Y EVIDENCIAS FOTOGRÁFICAS');
console.log('🧪 =========================================================================\n');

let passedTests = 0;
let failedTests = 0;
const failures = [];

async function assertTest(id, description, testFn) {
  try {
    await testFn();
    console.log(`✅ [${id}] ${description}: PASS`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [${id}] ${description}: FAIL -> ${err.message}`);
    failedTests++;
    failures.push({ id, description, error: err.message });
  }
}

// TEST-8.1: Aislamiento en rama activa de spec
await assertTest('TEST-8.1', 'Aislamiento estricto en rama activa de spec (feat/spec-008-*)', () => {
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  if (!currentBranch.startsWith('feat/spec-008-')) {
    throw new Error(`La rama activa '${currentBranch}' no cumple con el patrón 'feat/spec-008-*'`);
  }
});

// TEST-8.2: Integridad y sintaxis de postman_collection.json
await assertTest('TEST-8.2', 'Integridad y estructura v2.1.0 de postman_collection.json', () => {
  const postmanPath = path.join(rootDir, 'postman_collection.json');
  if (!fs.existsSync(postmanPath)) {
    throw new Error('postman_collection.json no existe en la raíz');
  }
  const json = JSON.parse(fs.readFileSync(postmanPath, 'utf8'));

  if (!json.info || !json.item || json.item.length < 3) {
    throw new Error('La colección de Postman debe contener al menos 3 carpetas principales');
  }

  const folderNames = json.item.map(f => f.name);
  if (!folderNames.some(n => n.includes('WebCheckout'))) {
    throw new Error('Falta carpeta de Placetopay WebCheckout en la colección de Postman');
  }
  if (!folderNames.some(n => n.includes('Gateway'))) {
    throw new Error('Falta carpeta de Placetopay API Gateway en la colección de Postman');
  }
  if (!folderNames.some(n => n.includes('Local'))) {
    throw new Error('Falta carpeta de Backend Local en la colección de Postman');
  }
});

// TEST-8.3: Existencia física de las 6 capturas de pantalla
await assertTest('TEST-8.3', 'Existencia física e integridad de las 6 capturas en Evidencias fotograficas/', () => {
  const imgDir = path.join(rootDir, 'Evidencias fotograficas');
  if (!fs.existsSync(imgDir)) {
    throw new Error('La carpeta Evidencias fotograficas/ no existe');
  }

  const expectedImages = [
    'Screenshot 2026-10-02 011855.png',
    'Screenshot 2026-10-02 011953.png',
    'Screenshot 2026-10-02 012054.png',
    'Screenshot 2026-10-02 012249.png',
    'Screenshot 2026-10-02 012339.png',
    'Screenshot 2026-10-02 012414.png'
  ];

  for (const imgName of expectedImages) {
    const fullPath = path.join(imgDir, imgName);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Falta la captura fotográfica: ${imgName}`);
    }
    const stat = fs.statSync(fullPath);
    if (stat.size < 1000) {
      throw new Error(`La captura ${imgName} tiene un tamaño anómalo (${stat.size} bytes)`);
    }
  }
});

// TEST-8.4: Existencia e integridad de guia-pruebas-postman-y-evidencias.md
await assertTest('TEST-8.4', 'Existencia del documento guia-pruebas-postman-y-evidencias.md en docs/soporte/', () => {
  const docPath = path.join(rootDir, 'docs', 'soporte', 'guia-pruebas-postman-y-evidencias.md');
  if (!fs.existsSync(docPath)) {
    throw new Error('docs/soporte/guia-pruebas-postman-y-evidencias.md no existe');
  }
  const content = fs.readFileSync(docPath, 'utf8');

  if (!content.includes('POST /api/session') || !content.includes('POST /gateway/process')) {
    throw new Error('El documento no cubre los métodos esenciales de WebCheckout y Gateway');
  }
});

// TEST-8.5: Explicación de API 1 (Crear Sesión WebCheckout)
await assertTest('TEST-8.5', 'Explicación humanizada y concisa de API 1 vinculando Screenshot 011855', () => {
  const docPath = path.join(rootDir, 'docs', 'soporte', 'guia-pruebas-postman-y-evidencias.md');
  const content = fs.readFileSync(docPath, 'utf8');

  if (!content.includes('Screenshot 2026-10-02 011855.png')) {
    throw new Error('Falta enlace a Screenshot 2026-10-02 011855.png en API 1');
  }
  if (!content.includes('3875483') || !content.includes('processUrl')) {
    throw new Error('No se documentaron los campos requestId (3875483) o processUrl de la respuesta');
  }
});

// TEST-8.6: Explicación de API 2 (Consultar Sesión WebCheckout)
await assertTest('TEST-8.6', 'Explicación de API 2 (Consulta de estado) vinculando Screenshot 011953', () => {
  const docPath = path.join(rootDir, 'docs', 'soporte', 'guia-pruebas-postman-y-evidencias.md');
  const content = fs.readFileSync(docPath, 'utf8');

  if (!content.includes('Screenshot 2026-10-02 011953.png')) {
    throw new Error('Falta enlace a Screenshot 2026-10-02 011953.png en API 2');
  }
  if (!content.includes('PENDING') || !content.includes('PC')) {
    throw new Error('Falta explicación del estado PENDING y razón PC');
  }
});

// TEST-8.7: Explicación de API 3 (Pago Directo Aprobado)
await assertTest('TEST-8.7', 'Explicación de API 3 (Pago Directo Aprobado) vinculando Screenshot 012054', () => {
  const docPath = path.join(rootDir, 'docs', 'soporte', 'guia-pruebas-postman-y-evidencias.md');
  const content = fs.readFileSync(docPath, 'utf8');

  if (!content.includes('Screenshot 2026-10-02 012054.png')) {
    throw new Error('Falta enlace a Screenshot 2026-10-02 012054.png en API 3');
  }
  if (!content.includes('1599921884') || !content.includes('APPROVED')) {
    throw new Error('Falta mención de la internalReference 1599921884 o estado APPROVED');
  }
});

// TEST-8.8: Explicación de API 4 (Consulta en Gateway Directo)
await assertTest('TEST-8.8', 'Explicación de API 4 (Consulta Gateway Directo) vinculando Screenshot 012249', () => {
  const docPath = path.join(rootDir, 'docs', 'soporte', 'guia-pruebas-postman-y-evidencias.md');
  const content = fs.readFileSync(docPath, 'utf8');

  if (!content.includes('Screenshot 2026-10-02 012249.png')) {
    throw new Error('Falta enlace a Screenshot 2026-10-02 012249.png en API 4');
  }
  if (!content.includes('/gateway/query')) {
    throw new Error('Falta endpoint /gateway/query en API 4');
  }
});

// TEST-8.9: Explicación de APIs 5 y 6 (Rechazos y Fondos Insuficientes)
await assertTest('TEST-8.9', 'Explicación de APIs 5 y 6 (Rechazos y Fondos Insuficientes) vinculando Screenshots 012339 y 012414', () => {
  const docPath = path.join(rootDir, 'docs', 'soporte', 'guia-pruebas-postman-y-evidencias.md');
  const content = fs.readFileSync(docPath, 'utf8');

  if (!content.includes('Screenshot 2026-10-02 012339.png') || !content.includes('Screenshot 2026-10-02 012414.png')) {
    throw new Error('Faltan los enlaces a Screenshots 012339 y 012414 en las secciones de rechazo');
  }
  if (!content.includes('REJECTED') || !content.includes('Fondos Insuficientes')) {
    throw new Error('Falta documentación de causales de rechazo financiero');
  }
});

// TEST-8.10: Vinculación y actualización en README.md
await assertTest('TEST-8.10', 'Sección de Postman y guía de evidencias vinculada en README.md', () => {
  const readmePath = path.join(rootDir, 'README.md');
  const content = fs.readFileSync(readmePath, 'utf8');

  if (!content.includes('postman_collection.json')) {
    throw new Error('README.md no vincula postman_collection.json');
  }
  if (!content.includes('guia-pruebas-postman-y-evidencias.md')) {
    throw new Error('README.md no vincula guia-pruebas-postman-y-evidencias.md');
  }
  if (!content.includes('pnpm run test:spec8')) {
    throw new Error('README.md no menciona el comando pnpm run test:spec8');
  }
});

// Balance final
console.log('\n=========================================================================');
if (failedTests === 0) {
  console.log(`🎉 TODOS LOS TESTS DE AGENTEST 008 PASARON EXITOSAMENTE (${passedTests}/10)`);
  console.log('=========================================================================\n');
  process.exit(0);
} else {
  console.error(`💥 SE PRESENTARON ${failedTests} FALLOS EN AGENTEST 008:`);
  failures.forEach(f => console.error(` - [${f.id}] ${f.description}: ${f.error}`));
  console.log('=========================================================================\n');
  process.exit(1);
}
