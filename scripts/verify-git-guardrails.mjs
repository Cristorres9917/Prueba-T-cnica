import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

const rootDir = process.cwd();

console.log('🛡️  ==============================================================');
console.log('🛡️  SUITE DE AUDITORÍA: GUARDRAILS DE GIT Y AGENTE WORKFLOW (SPEC-02)');
console.log('🛡️  ==============================================================\n');

const checks = [];

function recordTest(id, name, fn) {
  try {
    fn();
    checks.push({ id, name, passed: true });
    console.log(`✅ [${id}] ${name}: PASS`);
  } catch (err) {
    checks.push({ id, name, passed: false, error: err.message });
    console.error(`❌ [${id}] ${name}: FAIL -> ${err.message}`);
  }
}

// TEST-2.1: Aislamiento de rama por Spec
recordTest('TEST-2.1', 'Aislamiento de rama (desarrollo en rama feat/spec o main post-merge)', () => {
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  if (currentBranch === 'main') {
    // En main solo es válido si no hay cambios pendientes de desarrollo
    const status = execSync('git status --porcelain', { encoding: 'utf8' }).trim();
    if (status.length > 0) {
      throw new Error('Hay cambios sin confirmar directamente en main. Debe usarse una rama feat/spec-XXX');
    }
  } else {
    if (!currentBranch.startsWith('feat/spec-') && !currentBranch.startsWith('fix/spec-') && !currentBranch.startsWith('chore/spec-') && !currentBranch.startsWith('docs/spec-')) {
      throw new Error(`Nombre de rama no estándar: ${currentBranch}`);
    }
  }
});

// TEST-2.2: Regex de nomenclatura de rama
recordTest('TEST-2.2', 'Validación de nomenclatura regex de ramas por spec', () => {
  const currentBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
  if (currentBranch !== 'main') {
    const specRegex = /^(feat|fix|chore|docs)\/spec-[0-9]{3}-[a-z0-9-]+$/;
    if (!specRegex.test(currentBranch)) {
      throw new Error(`La rama '${currentBranch}' no cumple con el patrón regex ^(feat|fix|chore|docs)\\/spec-[0-9]{3}-[a-z0-9-]+$`);
    }
  }
});

// TEST-2.3: Existencia de skill git-workflow
recordTest('TEST-2.3', 'Existencia e integridad de skill git-workflow', () => {
  const skillPath = path.join(rootDir, '.agents', 'skills', 'git-workflow', 'SKILL.md');
  if (!fs.existsSync(skillPath)) {
    throw new Error('Archivo .agents/skills/git-workflow/SKILL.md no encontrado');
  }
  const content = fs.readFileSync(skillPath, 'utf8');
  if (!content.includes('name: git-workflow') || !content.includes('Merge Gate')) {
    throw new Error('La skill git-workflow no contiene las directivas canónicas');
  }
});

// TEST-2.4: Registro del agente Git-Workflow-Guardian en AGENTS.md
recordTest('TEST-2.4', 'Registro de agente Git-Workflow-Guardian en AGENTS.md', () => {
  const agentsPath = path.join(rootDir, 'AGENTS.md');
  const content = fs.readFileSync(agentsPath, 'utf8');
  if (!content.includes('Git-Workflow-Guardian') || !content.includes('git-workflow')) {
    throw new Error('El agente Git-Workflow-Guardian o su consumo de skill no figuran en AGENTS.md');
  }
});

// TEST-2.5: Existencia de regla branching-strategy.md
recordTest('TEST-2.5', 'Presencia y activación de regla branching-strategy.md', () => {
  const rulePath = path.join(rootDir, '.agents', 'rules', 'branching-strategy.md');
  if (!fs.existsSync(rulePath)) {
    throw new Error('Regla .agents/rules/branching-strategy.md no encontrada');
  }
  const content = fs.readFileSync(rulePath, 'utf8');
  if (!content.includes('trigger: always_on') || !content.includes('Human-in-the-Loop')) {
    throw new Error('La regla branching-strategy.md no está configurada como always_on con compuerta humana');
  }
});

// TEST-2.6: Prohibición explícita de git add .
recordTest('TEST-2.6', 'Prohibición explícita de git add . en guardrails y skills', () => {
  const agentsContent = fs.readFileSync(path.join(rootDir, 'AGENTS.md'), 'utf8');
  const skillContent = fs.readFileSync(path.join(rootDir, '.agents', 'skills', 'git-workflow', 'SKILL.md'), 'utf8');
  if (!agentsContent.includes('G-07: Prohibición de `git add .`')) {
    throw new Error('Guardrail G-07 no documentado en AGENTS.md');
  }
  if (!skillContent.includes('git add .')) {
    throw new Error('Prohibición de comodines no documentada en git-workflow');
  }
});

// TEST-2.7: Integridad de compuertas de entrega y solicitud de merge humano
recordTest('TEST-2.7', 'Integridad de actas de entrega (con compuerta de merge humano en cada spec)', () => {
  const entregasDir = path.join(rootDir, 'docs', 'sdd', '04-entregas');
  const files = fs.readdirSync(entregasDir).filter(f => f.endsWith('.md'));
  if (files.length === 0) {
    throw new Error('No se encontraron actas de entrega');
  }
  for (const file of files) {
    // A partir del Spec-02, toda entrega debe incluir formalmente la compuerta humana
    if (!file.startsWith('001-')) {
      const content = fs.readFileSync(path.join(entregasDir, file), 'utf8');
      if (!content.includes('Human-in-the-Loop') || !content.includes('git merge --no-ff')) {
        throw new Error(`El acta ${file} no define la compuerta de merge humano obligatoria`);
      }
    }
  }
});

// TEST-2.8: Trazabilidad en DEUDAS_TECNICAS y LECCIONES_APRENDIDAS
recordTest('TEST-2.8', 'Trazabilidad y bitácora en DEUDAS_TECNICAS y LECCIONES_APRENDIDAS', () => {
  const deudas = fs.readFileSync(path.join(rootDir, 'DEUDAS_TECNICAS.md'), 'utf8');
  const lecciones = fs.readFileSync(path.join(rootDir, 'LECCIONES_APRENDIDAS.md'), 'utf8');
  if (!deudas.includes('DT-') || !lecciones.includes('Lección')) {
    throw new Error('Los registros vivos no cuentan con estructura de trazabilidad');
  }
});

console.log('\n==============================================================');
const passed = checks.filter(c => c.passed).length;
const failed = checks.filter(c => !c.passed).length;
console.log(`TOTAL TESTS: ${checks.length} | PASSED: ${passed} | FAILED: ${failed}`);
console.log('==============================================================\n');

if (failed === 0) {
  console.log('🎉 SUITE AGENTEST 002 EXITOSA. Puerta de entrega habilitada.');
  process.exit(0);
} else {
  console.error(`⛔ ${failed} PRUEBAS FALLIDAS. La entrega permanece BLOQUEADA.`);
  process.exit(1);
}
