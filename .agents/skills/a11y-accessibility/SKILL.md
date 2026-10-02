---
name: a11y-accessibility
description: Directrices, reglas de validación y mejores prácticas de accesibilidad web (WCAG 2.1 AA/AAA) para interfaces de usuario, formularios de pago y componentes interactivos.
---

# Skill: Accesibilidad Web (A11y) y WCAG 2.1 AA

Esta skill establece los principios, estándares técnicos y procedimientos de verificación para garantizar que todas las interfaces del proyecto cumplan rigurosamente con las directrices de accesibilidad web **WCAG 2.1 Nivel AA**.

---

## 1. Principios Fundamentales (POUR)

1. **Perceptible:**
   - La información y los componentes de la interfaz deben presentarse a los usuarios de manera que puedan percibirlos.
   - Textos con contraste suficiente, alternativas textuales (`alt`) para imágenes y soporte para lectores de pantalla.
2. **Operable:**
   - Todos los componentes y navegación deben ser operables mediante el teclado exclusivamente (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`).
   - Focos visibles (`:focus-visible`), enlaces de salto (`Skip to content`) y ausencia de trampas de teclado.
3. **Comprensible:**
   - La información y el manejo de la interfaz de usuario deben ser comprensibles y predecibles.
   - Mensajes de error claros, etiquetas explícitas en inputs de formulario y ayudas contextuales.
4. **Robusto:**
   - El contenido debe ser lo suficientemente robusto para ser interpretado con fiabilidad por una amplia variedad de agentes de usuario, incluidas las tecnologías de asistencia (lectores de pantalla NVDA, JAWS, VoiceOver).

---

## 2. Paleta de Colores Evertec y Ratios de Contraste WCAG

Para cumplir con WCAG 2.1 AA:
- **Texto Normal (< 18pt / < 14pt negrita):** Ratio de contraste mínimo **4.5:1**.
- **Texto Grande (>= 18pt o >= 14pt negrita):** Ratio de contraste mínimo **3.0:1**.
- **Componentes de Interfaz y Gráficos (bordes de input, iconos activos):** Ratio de contraste mínimo **3.0:1**.

### Matriz de Contraste Evertec Aprobada:
| Elemento | Color Fondo | Color Texto / Primer Plano | Ratio Obtenido | Nivel WCAG |
| :--- | :--- | :--- | :--- | :--- |
| **Cabecera / Hero** | `#0B192C` (Marino Profundo) | `#FFFFFF` (Blanco Puro) | **16.2:1** | AAA (Pasa con holgura) |
| **Botón Primario (CTA)** | `#FF5900` (Naranja Evertec) | `#FFFFFF` (Blanco) | **3.1:1** *(Uso en texto bold >18px o botón con fondo oscuro alternativo `#D94800` a 4.6:1)* | AA para componentes grandes |
| **Botón Primario Accesible** | `#D44A00` (Naranja Profundo) | `#FFFFFF` (Blanco) | **4.65:1** | AA (Aprobado universal) |
| **Cuerpo de Página** | `#F8FAFC` (Superficie Clara) | `#0F172A` (Slate 900) | **14.8:1** | AAA |
| **Texto Secundario** | `#FFFFFF` (Blanco) | `#334155` (Slate 700) | **8.2:1** | AAA |
| **Alertas de Éxito** | `#F0FDF4` (Fondo Verde) | `#166534` (Verde Esmeralda) | **7.4:1** | AAA |
| **Alertas de Error / Rechazo** | `#FEF2F2` (Fondo Rojo) | `#991B1B` (Rojo Oscuro) | **8.1:1** | AAA |

---

## 3. Checklist de Implementación en Formularios de Pago

- [ ] **Etiquetas Explícitas:** Todo `<input>`, `<select>` y `<textarea>` tiene un `<label>` asociado mediante `for="id"` y no solo placeholders.
- [ ] **ARIA Landmarks:** Uso de `<header role="banner">`, `<main id="content">`, `<nav aria-label="...">`, `<footer role="contentinfo">`.
- [ ] **Regiones Vivas (`aria-live`):** Las notificaciones de estado, errores de validación y cálculo del carrito deben usar `aria-live="polite"` o `aria-live="assertive"`.
- [ ] **Indicación de Campos Obligatorios:** `aria-required="true"` en campos mandatorios de facturación.
- [ ] **Manejo de Errores:** Errores descritos con `aria-invalid="true"` y vinculados con `aria-describedby="error-id"`.
- [ ] **Skip Links:** Enlace oculto visible al recibir foco (`.skip-link`) que salta directo al contenido principal `#content`.
- [ ] **Focus Visible:** Estilos de contorno claros (`outline: 3px solid #0077CC; outline-offset: 2px`) para usuarios con navegación de teclado.
