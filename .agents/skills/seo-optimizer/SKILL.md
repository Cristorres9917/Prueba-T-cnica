---
name: seo-optimizer
description: Estándares, directrices y validación de optimización para motores de búsqueda (SEO On-Page), metadatos OpenGraph, Twitter Cards y marcado semántico Schema.org.
---

# Skill: Optimización SEO Técnico y Estructura Semántica

Esta skill define los requisitos de arquitectura de información, marcado estructurado y metadatos para posicionar y catalogar de forma óptima el e-commerce y checkout de demostración de Evertec / Placetopay.

---

## 1. Requisitos de Metadatos Obligatorios

Toda página HTML del mockup debe incluir en su `<head>`:

1. **Codificación y Viewport:**
   - `<meta charset="UTF-8">`
   - `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">`
2. **Identidad y Snippet:**
   - `<title>` descriptivo (entre 50 y 60 caracteres).
   - `<meta name="description" content="...">` (entre 120 y 155 caracteres) con palabras clave naturales.
   - `<link rel="canonical" href="...">`
3. **OpenGraph (Facebook / WhatsApp / LinkedIn):**
   - `og:type = "website"` o `"product"`
   - `og:title`, `og:description`, `og:image`, `og:url`, `og:site_name = "Evertec Placetopay Store"`
4. **Twitter Cards:**
   - `twitter:card = "summary_large_image"`
   - `twitter:title`, `twitter:description`, `twitter:image`
5. **Favicon e Iconos:**
   - Enlace a favicon SVG/PNG corporativo de Evertec.

---

## 2. Marcado Estructurado JSON-LD (Schema.org)

Se debe incrustar un bloque `<script type="application/ld+json">` que describa:
- La organización (`@type: "Organization"`, nombre "Evertec / Placetopay", URL oficial).
- El catálogo de productos (`@type: "ItemList"` con elementos `@type: "Product"` conteniendo `name`, `image`, `description`, `offers: { price, priceCurrency: "COP", availability: "InStock" }`).

---

## 3. Estructura Jerárquica Semántica (HTML5)

- Exactamente **un solo `<h1>`** por página, que sintetice el propósito principal.
- Niveles `<h2>` para secciones lógicas (Catálogo de Productos, Carrito de Compras, Proceso de Checkout, Auditoría Transaccional).
- Niveles `<h3>` para nombres de productos o sub-bloques de facturación.
- Elementos estructurales estándar: `<header>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.
- Textos alternativos descriptivos en todas las imágenes de productos (`alt="Nombre y especificación del producto"`).
