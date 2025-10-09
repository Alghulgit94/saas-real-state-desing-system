Implementa un formulario de reservación siguiendo estos requerimientos:

## Recursos Base

- Usa el mockup de baja fidelidad: reservation_form_mockup.png
- Aplica estrictamente la guía de diseño: @STYLE_GUIDE.md
- Apóyate en el agente front-end-architecture para la estructura

## Funcionalidades Requeridas

### Campos del Formulario

1. **Datos Personales**

   - Input de nombre (requerido)
   - Input de apellido (requerido)
   - Input de correo electrónico (requerido, validación de email)
   - Input de número de teléfono (requerido, validación de formato)

2. **Información del Lote**

   - Mostrar detalle del lote a reservar (read-only)
   - Los datos del lote deben obtenerse de los parámetros URL
   - Mostrar: ID del lote, ubicación, precio, dimensiones (según disponibilidad en URL)

3. **Mensaje Adicional**

   - Textarea para mensaje opcional
   - Indicar claramente que es opcional

4. **Botón de Envío**
   - Implementar función POST al endpoint del backend (crear placeholder: /api/reservations)
   - Manejar estados: idle, loading, success, error
   - Mostrar feedback visual según el estado

## Requisitos Técnicos

### Responsive Design

- Mobile-first approach
- Breakpoints según @STYLE_GUIDE.md
- Layout adaptativo para pantallas pequeñas (stack vertical)
- Layout para pantallas grandes (grid o flexbox optimizado)

### Validación

- Validación en tiempo real de campos requeridos
- Mensajes de error claros siguiendo el design system
- Prevenir envío si hay errores

### Estado y UX

- Mostrar indicadores de carga durante el envío
- Mensajes de éxito/error post-envío
- Limpiar formulario tras envío exitoso
- Mantener datos del lote siempre visibles

### Estructura de Datos para POST

```json
{
    "reservation":{
         "lead":{
            "firstName": "",
            "lastName": "",
            "email": "",
            "phone": "",
            "additionalMessage": ""
         },
        "lot":{
            "id": "", // desde URL
            "details": {} // desde URL
        },
        "timestamp": ""
    }
}
Consideraciones de Implementación

Usa los componentes y tokens de diseño de @STYLE_GUIDE.md
Implementa manejo de errores robusto
Asegura accesibilidad (ARIA labels, navegación por teclado)
Optimiza para performance (lazy loading si aplica)
Documenta las funciones principales

Analiza primero el mockup y el design system, luego procede con la implementación completa del componente.
```
