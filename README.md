# 🎾 NYC · US Open 2026 — App Web & PWA Interactiva

Aplicación web interactiva, moderna y offline-ready (**PWA**) para dar seguimiento y personalizar el itinerario de viaje a **Nueva York & US Open 2026** (4 al 10 de septiembre de 2026) para **Lalo & Fefe**.

---

## ✨ Características Principales

* ⏰ **Reloj Dual en Vivo & Cuenta Regresiva**: Hora en CDMX vs NYC (EDT, +2h) y cuenta regresiva al despegue del vuelo MEX→EWR (4 de septiembre 07:10).
* 📅 **Itinerario Interactivo Día a Día**: Los 7 días detallados con horarios, notas, mapa directo de Google Maps, badges y tareas completadas con animaciones.
* ✏️ **Pantallas de Edición CRUD**: Modifica horarios, notas, direcciones, reordena actividades o añade nuevas paradas en cualquier día del viaje.
* 💡 **Hub de Recomendaciones con 3 Formatos de Entrada**:
  * **Formulario móvil interactivo**.
  * **Smart Paste**: Pega texto de WhatsApp/Instagram y detecta nombre, categoría y tips automáticamente.
  * **Carga Masiva CSV / Respaldo JSON**: Descarga y sube archivos de Excel/CSV o haz respaldos totales con 1 clic.
* 🏆 **Módulo Arthur Ashe & Go City**:
  * Control de las 4 sesiones de tenis (Nivel 300 y Nivel 200 Loge).
  * Contador del trago oficial *Honey Deuce* ($25 USD) con vasos de colección.
  * Activación de Go City Pass (Intrepid, Top of the Rock y MoMA).
* 📚 **Wishlist de Libros Strand**: Finanzas (CFA), mercados (Soros, Lowenstein) y tecnología (Ousterhout, Staff Engineer, Bitcoin).
* 💵 **Presupuesto & Cash-Only Planner**: Conversor USD/MXN y cálculo del efectivo físico requerido para Joe's Pizza, Corner Bistro, Chinatown Flushing y DUMBO.
* 📶 **PWA 100% Offline**: Funciona en el metro de NY o en el avión sin conexión a internet ni datos celulares.

---

## 🚀 Cómo Ejecutar en Local

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Abrir en el navegador:
# http://localhost:3000/
# O en el móvil conectado a la misma red WiFi:
# http://TU-IP-LOCAL:3000/
```

---

## ☁️ Cómo Desplegar Gratis en Vercel (Recomendado)

1. Sube este repositorio a tu cuenta de **GitHub**.
2. Entra a [vercel.com](https://vercel.com) e inicia sesión con GitHub.
3. Haz clic en **Add New Project** e importa este repositorio.
4. Elige el preset **Vite** y presiona **Deploy**.
5. ¡Listo! Tendrás una URL HTTPS gratuita y permanente (ej: `https://viaje-nyc-usopen.vercel.app`) lista para instalar en tu celular.

---

## 📲 Cómo Instalar en el Celular (PWA)

* **En iPhone (Safari)**: Toca el botón **Compartir** > **"Añadir a pantalla de inicio"**.
* **En Android (Chrome)**: Toca el menú `⋮` > **"Instalar aplicación"**.
