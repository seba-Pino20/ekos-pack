# Ekos Pack

Sitio web corporativo para **Ekos Pack SpA**, empresa chilena con dos líneas de negocio: venta de minerales industriales y servicios de construcción / obras menores con certificación SEC.

🌐 En producción: [ekospack.cl](https://ekospack.cl)

> Proyecto freelance desarrollado para un cliente. El código se publica como parte de mi portafolio; la marca, los logos y las fotografías pertenecen al cliente.

## Funcionalidades

- **Portal de entrada en pantalla dividida**: dos paneles en diagonal (Industrial / Construcción) que se expanden al pasar el mouse, con un comportamiento adaptado a móviles.
- Una vista interna para cada división, con navbar, colores y contenido propios.
- Catálogo de minerales (carbonato de calcio, barita, grafito, talco, etc.).
- Formulario de cotización protegido con **Google reCAPTCHA v3**, que envía las solicitudes a un **Google Apps Script** indicando la división de origen.
- Mapa de Google embebido, términos legales y diseño responsive.

## Stack

- React 19 + Vite
- Tailwind CSS
- lucide-react (íconos)
- Google reCAPTCHA v3

## Cómo ejecutarlo

```bash
npm install
cp .env.example .env.local   # completa tus propias claves
npm run dev
```

Variables de entorno (`.env.local`):

| Variable | Descripción |
| --- | --- |
| `VITE_RECAPTCHA_SITE_KEY` | Clave de sitio de reCAPTCHA v3 |
| `VITE_FORM_ENDPOINT` | URL del Google Apps Script que recibe el formulario |

Para generar la versión de producción: `npm run build` (la salida queda en `dist/`).
