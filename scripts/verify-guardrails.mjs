import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();

console.log('🔍 Iniciando verificación de Guardrails y Estructura SDD...\n');

const checks = [];

function recordCheck(name, passed, detail) {
  checks.push({ name, passed, detail });
  const icon = passed ? '✅' : '❌';
  console.log(`${icon} [${name}]: ${detail}`);
}

// 1. Verificar .npmrc
try {
  const npmrcPath = path.join(rootDir, '.npmrc');
  if (fs.existsSync(npmrcPath)) {
    const content = fs.readFileSync(npmrcPath, 'utf8');
    const hasReleaseAge = /minimum-release-age\s*=\s*2880/.test(content);
    recordCheck('Guardrail .npmrc', hasReleaseAge, hasReleaseAge ? 'minimum-release-age=2880 configurado (48h de cooldown)' : 'Falta minimum-release-age=2880');
  } else {
    recordCheck('Guardrail .npmrc', false, 'Archivo .npmrc no encontrado');
  }
} catch (e) {
  recordCheck('Guardrail .npmrc', false, e.message);
}

// 2. Verificar pnpm-workspace.yaml
try {
  const wsPath = path.join(rootDir, 'pnpm-workspace.yaml');
  if (fs.existsSync(wsPath)) {
    const content = fs.readFileSync(wsPath, 'utf8');
    const hasWsAge = /minimumReleaseAge\s*:\s*2880/.test(content);
    recordCheck('Guardrail pnpm-workspace', hasWsAge, hasWsAge ? 'minimumReleaseAge: 2880 configurado (48h)' : 'Falta minimumReleaseAge: 2880');
  } else {
    recordCheck('Guardrail pnpm-workspace', false, 'pnpm-workspace.yaml no encontrado');
  }
} catch (e) {
  recordCheck('Guardrail pnpm-workspace', false, e.message);
}

// 3. Verificar package.json y bloqueo de npm
try {
  const pkgPath = path.join(rootDir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const hasPreinstall = pkg.scripts?.preinstall && pkg.scripts.preinstall.includes('pnpm');
    const hasEngines = pkg.engines?.npm === 'please-use-pnpm';
    recordCheck('Guardrail package.json', hasPreinstall && hasEngines, 'Hook preinstall intercepta npm y engines prohíben npm');
  } else {
    recordCheck('Guardrail package.json', false, 'package.json no encontrado');
  }
} catch (e) {
  recordCheck('Guardrail package.json', false, e.message);
}

// 4. Verificar Arnés Antigravity (AGENTS.md y GEMINI.md)
try {
  const hasAgents = fs.existsSync(path.join(rootDir, 'AGENTS.md'));
  const hasGemini = fs.existsSync(path.join(rootDir, 'GEMINI.md'));
  recordCheck('Arnés Base (AGENTS & GEMINI)', hasAgents && hasGemini, 'AGENTS.md y GEMINI.md están activos en raíz');
} catch (e) {
  recordCheck('Arnés Base', false, e.message);
}

// 5. Verificar Reglas (.agents/rules)
try {
  const hasGuardrailsRule = fs.existsSync(path.join(rootDir, '.agents', 'rules', 'guardrails.md'));
  const hasLifecycleRule = fs.existsSync(path.join(rootDir, '.agents', 'rules', 'sdd-lifecycle.md'));
  recordCheck('Reglas de Arnés', hasGuardrailsRule && hasLifecycleRule, 'Reglas guardrails.md y sdd-lifecycle.md presentes');
} catch (e) {
  recordCheck('Reglas de Arnés', false, e.message);
}

// 6. Verificar Skills (.agents/skills)
try {
  const hasValidatorSkill = fs.existsSync(path.join(rootDir, '.agents', 'skills', 'sdd-validator', 'SKILL.md'));
  const hasAuthSkill = fs.existsSync(path.join(rootDir, '.agents', 'skills', 'placetopay-auth', 'SKILL.md'));
  recordCheck('Skills de Arnés', hasValidatorSkill && hasAuthSkill, 'Skills sdd-validator y placetopay-auth configuradas');
} catch (e) {
  recordCheck('Skills de Arnés', false, e.message);
}

// 7. Verificar Registros Vivos (DEUDAS y LECCIONES)
try {
  const hasDeudas = fs.existsSync(path.join(rootDir, 'DEUDAS_TECNICAS.md'));
  const hasLecciones = fs.existsSync(path.join(rootDir, 'LECCIONES_APRENDIDAS.md'));
  recordCheck('Registros Vivos SDD', hasDeudas && hasLecciones, 'DEUDAS_TECNICAS.md y LECCIONES_APRENDIDAS.md activos');
} catch (e) {
  recordCheck('Registros Vivos SDD', false, e.message);
}

// 8. Verificar Taxonomía SDD (docs/sdd)
try {
  const hasIntent = fs.existsSync(path.join(rootDir, 'docs', 'sdd', '00-intents', '001-intent-estructura-y-arnes.md'));
  const hasSpec = fs.existsSync(path.join(rootDir, 'docs', 'sdd', '01-specs', '001-spec-estructura-arnes-seguridad.md'));
  const hasPlan = fs.existsSync(path.join(rootDir, 'docs', 'sdd', '02-plans', '001-plan-estructura-arnes.md'));
  const hasAgentest = fs.existsSync(path.join(rootDir, 'docs', 'sdd', '03-agentest', '001-agentest-estructura-arnes.md'));
  recordCheck('Taxonomía Documental SDD', hasIntent && hasSpec && hasPlan && hasAgentest, 'Fases 00-Intent, 01-Spec, 02-Plan y 03-Agentest completadas');
} catch (e) {
  recordCheck('Taxonomía Documental SDD', false, e.message);
}

// 9. Verificar Puerta de Entrega Vacía
try {
  const entregasDir = path.join(rootDir, 'docs', 'sdd', '04-entregas');
  let isClean = false;
  if (fs.existsSync(entregasDir)) {
    const files = fs.readdirSync(entregasDir).filter(f => f.endsWith('.md'));
    isClean = files.length === 0;
  }
  recordCheck('Puerta de Entrega Segura', isClean, isClean ? 'Carpeta 04-entregas sin documentos prematuros' : 'Se encontraron archivos de entrega no autorizados');
} catch (e) {
  recordCheck('Puerta de Entrega Segura', false, e.message);
}

console.log('\n------------------------------------------------------------');
const failedCount = checks.filter(c => !c.passed).length;
if (failedCount === 0) {
  console.log('🎉 TODOS LOS GUARDRAILS Y COMPONENTES SDD ESTÁN VERIFICADOS (9/9)\n');
  process.exit(0);
} else {
  console.error(`⚠️ SE ENCONTRARON ${failedCount} FALLOS DE VERIFICACIÓN\n`);
  process.exit(1);
}
