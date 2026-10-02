import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();

console.log('🧪 =========================================================================');
console.log('🧪 SUITE AGENTEST 007: DOCUMENTACIÓN, TARJETAS SANDBOX Y CASOS DE SOPORTE');
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

// TEST-7.1: Aislamiento en rama activa de spec
await assertTest('TEST-7.1', 'Aislamiento estricto en rama activa de spec (feat/spec-007-*)', () => {
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  if (!currentBranch.startsWith('feat/spec-007-')) {
    throw new Error(`La rama activa '${currentBranch}' no cumple con el patrón 'feat/spec-007-*'`);
  }
});

// TEST-7.2: Existencia e integridad de README.md
await assertTest('TEST-7.2', 'Existencia e integridad del README.md institucional en raíz', () => {
  const readmePath = path.join(rootDir, 'README.md');
  if (!fs.existsSync(readmePath)) {
    throw new Error('README.md no existe en la raíz');
  }
  const content = fs.readFileSync(readmePath, 'utf8');

  const requiredSections = [
    'Evertec PayShop',
    'pnpm install',
    'pnpm start',
    'http://localhost:3000',
    'Matriz de Tarjetas de Prueba Sandbox',
    'Gobernanza SDD y Guardrails Inmutables',
    'Suites de Pruebas Automatizadas',
    'docs/soporte/respuestas-conceptuales-y-casos.md'
  ];

  for (const sec of requiredSections) {
    if (!content.includes(sec)) {
      throw new Error(`README.md no contiene la sección o referencia requerida: '${sec}'`);
    }
  }
});

// TEST-7.3: Respuestas conceptuales completas (7/7)
await assertTest('TEST-7.3', 'Documento de soporte resuelve exhaustivamente las 7 preguntas conceptuales', () => {
  const docPath = path.join(rootDir, 'docs', 'soporte', 'respuestas-conceptuales-y-casos.md');
  if (!fs.existsSync(docPath)) {
    throw new Error('docs/soporte/respuestas-conceptuales-y-casos.md no existe');
  }
  const content = fs.readFileSync(docPath, 'utf8');

  const requiredQuestions = [
    'Pregunta 1: ¿Qué es el RequestId',
    'Pregunta 2: ¿Cuáles son los estados de una transacción?',
    'Pregunta 3: ¿Qué es una preautorización',
    'Pregunta 4: Explica las diferencias entre cobro por suscripción y cobro por recurrencia',
    'Pregunta 5: ¿Cuál es la diferencia entre API Gateway y Webcheckout?',
    'Pregunta 6: ¿Para qué se usa la dispersión en un comercio?',
    'Pregunta 7: ¿Para qué sirve la notificación'
  ];

  for (const q of requiredQuestions) {
    if (!content.includes(q)) {
      throw new Error(`El documento de soporte no incluye la pregunta requerida: '${q}'`);
    }
  }

  // Verificar conceptos clave
  if (!content.includes('APPROVED') || !content.includes('PENDING') || !content.includes('REJECTED')) {
    throw new Error('No se encontraron los estados canónicos APPROVED, PENDING, REJECTED en las respuestas.');
  }
  if (!content.includes('Rent-A-Car') && !content.includes('alquiler')) {
    throw new Error('No se encontró el ejemplo práctico de preautorización.');
  }
});

// TEST-7.4: Gestión y respuestas para los 4 casos de soporte al comercio
await assertTest('TEST-7.4', 'Gestión operativa, diagnóstico técnico y cartas de respuesta para los 4 casos de soporte', () => {
  const docPath = path.join(rootDir, 'docs', 'soporte', 'respuestas-conceptuales-y-casos.md');
  const content = fs.readFileSync(docPath, 'utf8');

  const requiredCases = [
    'Caso 1: Comercio Crítico con "Error 102 Autenticación Fallida"',
    'Caso 2: Comercio CLARO con Error "Autenticación Mal Formada"',
    'Caso 3: Comercio "Sunshine" — Confusión Pedagógica',
    'Caso 4: Comercio "Sunshine" — Escalamiento Hostil'
  ];

  for (const c of requiredCases) {
    if (!content.includes(c)) {
      throw new Error(`El documento de soporte no incluye el caso de soporte: '${c}'`);
    }
  }

  // Validar presencia de cartas formales redactadas
  const letterSnippets = [
    'Estimado [Nombre del Contacto / Director de Tecnología / Gerente]',
    'Estimado Equipo de Ingeniería y Pagos Digitales de CLARO',
    'Hola [Nombre del Contacto / Equipo de Sunshine]',
    'Estimado [Nombre del Directivo / Representante de Sunshine]'
  ];

  for (const snippet of letterSnippets) {
    if (!content.includes(snippet)) {
      throw new Error(`No se encontró la redacción formal de respuesta al cliente para el patrón: '${snippet}'`);
    }
  }
});

// TEST-7.5: Diagramas de secuencia y flujo Mermaid
await assertTest('TEST-7.5', 'Inclusión de diagramas de secuencia y flujo Mermaid en la documentación', () => {
  const docPath = path.join(rootDir, 'docs', 'soporte', 'respuestas-conceptuales-y-casos.md');
  const content = fs.readFileSync(docPath, 'utf8');

  const hasMermaidBlocks = (content.match(/```mermaid/g) || []).length >= 3;
  if (!hasMermaidBlocks) {
    throw new Error('Se requieren al menos 3 diagramas Mermaid en el documento de soporte.');
  }

  if (!content.includes('sequenceDiagram')) {
    throw new Error('Falta diagrama de secuencia en el documento de soporte.');
  }
  if (!content.includes('WebCheckout') || !content.includes('Gateway')) {
    throw new Error('Los diagramas deben ilustrar WebCheckout y API Gateway.');
  }
});

// TEST-7.6: Matriz de tarjetas de prueba para TODOS los estados
await assertTest('TEST-7.6', 'Matriz exhaustiva de tarjetas de prueba para todos los estados financieros', () => {
  const docPath = path.join(rootDir, 'docs', 'soporte', 'respuestas-conceptuales-y-casos.md');
  const content = fs.readFileSync(docPath, 'utf8');

  const requiredCardTokens = [
    '4111 1111 1111 1111', // Visa Aprobada
    '5180 3000 0000 0005', // Mastercard Aprobada
    '3435 7754 9670 001',  // Amex Aprobada
    '3654 5400 0000 08',   // Diners Aprobada
    '4110 7600 0000 0016', // Visa Rechazada
    '5180 3000 0000 0062', // Mastercard Rechazada
    'Fondos Insuficientes',// Causal XA / 51
    '4048 3700 0000 0037', // Pendiente
    '12345'                // Challenge OTP 3DS
  ];

  for (const token of requiredCardTokens) {
    if (!content.includes(token)) {
      throw new Error(`La matriz de tarjetas no contiene el elemento requerido: '${token}'`);
    }
  }
});

// TEST-7.7: Botón de acceso rápido a Tarjetas en Frontend
await assertTest('TEST-7.7', 'Botón interactivo de Tarjetas Sandbox en header de index.html', () => {
  const htmlPath = path.join(rootDir, 'public', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  if (!html.includes('id="test-cards-btn"') || !html.includes('openTestCardsModal()')) {
    throw new Error('Falta botón #test-cards-btn con onclick="openTestCardsModal()" en el encabezado de index.html');
  }
});

// TEST-7.8: Modal accesible de Tarjetas Sandbox en HTML
await assertTest('TEST-7.8', 'Modal accesible #test-cards-modal con roles y atributos ARIA WCAG 2.1 AA', () => {
  const htmlPath = path.join(rootDir, 'public', 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf8');

  if (!html.includes('id="test-cards-modal"') || !html.includes('id="test-cards-overlay"')) {
    throw new Error('Faltan los elementos #test-cards-modal o #test-cards-overlay en index.html');
  }

  if (!html.includes('role="dialog"') || !html.includes('aria-modal="true"') || !html.includes('aria-labelledby="test-cards-modal-title"')) {
    throw new Error('El modal #test-cards-modal no cumple con los atributos de accesibilidad ARIA requeridos');
  }

  if (!html.includes('4111 1111 1111 1111') || !html.includes('5180 3000 0000 0005')) {
    throw new Error('El modal no contiene los números de tarjeta predeterminados para pruebas');
  }
});

// TEST-7.9: Funciones expuestas en public/app.js
await assertTest('TEST-7.9', 'Funciones openTestCardsModal, closeTestCardsModal y copyCardNumber en app.js', () => {
  const appJsPath = path.join(rootDir, 'public', 'app.js');
  const appJs = fs.readFileSync(appJsPath, 'utf8');

  if (!appJs.includes('function openTestCardsModal()') || !appJs.includes('function closeTestCardsModal()')) {
    throw new Error('Faltan las funciones openTestCardsModal o closeTestCardsModal en app.js');
  }

  if (!appJs.includes('function copyCardNumber(') || !appJs.includes('window.copyCardNumber = copyCardNumber')) {
    throw new Error('Falta la función copyCardNumber o su exposición global en window');
  }

  if (!appJs.includes('closeTestCardsModal();')) {
    throw new Error('La función de cierre no está vinculada al listener de la tecla Escape en app.js');
  }
});

// TEST-7.10: Estilos CSS del modal y badges de estado
await assertTest('TEST-7.10', 'Estilos CSS para .nav-btn-cards, .modal-cards-dialog y .test-cards-grid en styles.css', () => {
  const cssPath = path.join(rootDir, 'public', 'styles.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  const requiredClasses = [
    '.nav-btn-cards',
    '.modal-cards-dialog',
    '.test-cards-grid',
    '.test-card-box',
    '.btn-copy-card',
    '.badge-green',
    '.badge-red'
  ];

  for (const cls of requiredClasses) {
    if (!css.includes(cls)) {
      throw new Error(`styles.css no define la clase requerida '${cls}'`);
    }
  }
});

// Balance final
console.log('\n=========================================================================');
if (failedTests === 0) {
  console.log(`🎉 TODOS LOS TESTS DE AGENTEST 007 PASARON EXITOSAMENTE (${passedTests}/10)`);
  console.log('=========================================================================\n');
  process.exit(0);
} else {
  console.error(`💥 SE PRESENTARON ${failedTests} FALLOS EN AGENTEST 007:`);
  failures.forEach(f => console.error(` - [${f.id}] ${f.description}: ${f.error}`));
  console.log('=========================================================================\n');
  process.exit(1);
}
