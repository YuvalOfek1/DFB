// Latin American Spanish: only the words that differ from Spain.
// Spain uses es.js as written; Latin America differs in a few everyday words.
export default {
  setupIntro: 'Los espectadores nunca ven esta pantalla. Mantén presionado el título “Notas” para volver a abrirla.',
  addList: 'Agregar lista',
  manageSubscription: 'Administrar suscripción',
  deleteListConfirm: (title) => `¿Eliminar “${title}”?`,
  goodToKnowSteps: [
    ['Forzar otra palabra en el momento.', 'Mantén presionada la nota en lugar de tocarla. Se abre el teclado de letras: escribe el número y la palabra, por ejemplo “17 Plátano”, y presiona Intro.'],
    ['No falta nada.', 'Si la palabra a forzar ya está en la lista, intercambia su lugar con el elemento de su número, así que la lista sigue teniendo exactamente los mismos elementos.'],
    ['Se reinicia sola.', 'Al volver a la lista de notas (con el botón o deslizando desde el borde izquierdo) se recupera el orden original.'],
    ['El momento justo.', 'Haz la entrada secreta mientras la atención está en otra parte y tómatelo con calma después. Practica hasta poder hacerlo sin mirar.'],
  ],
  routineSteps: [
    ['Haz una predicción.', 'Escribe en un papel la palabra a forzar de la lista que vas a usar y dáselo a alguien para que lo guarde.'],
    ['Muestra la lista.', 'Abre la nota y deja que el espectador la recorra. Todos los elementos son distintos.'],
    ['Pide un número.', 'Pide cualquier número del 1 al total de la lista. Deja que cambie de opinión.'],
    ['Ingrésalo en secreto.', 'Mientras miran la predicción, toca cualquier parte de la nota. Se abre el teclado numérico, pero no aparece nada de lo que escribes. Escribe su número y vuelve a tocar la nota.'],
    ['Revela.', 'Gira la pantalla hacia ellos, baja hasta su número y deja que lean el elemento en voz alta. Después abre la predicción.'],
  ],
  secretMenuText: 'Mantén presionado el título grande “Notas” para abrir la configuración. Ahí eliges la palabra a forzar de cada lista, editas las listas o creas las tuyas.',
  legal: (store) => `El pago se carga a tu ${store}. La suscripción se renueva automáticamente cada mes, a menos que la canceles al menos 24 horas antes de que termine el periodo actual. Puedes administrarla o cancelarla en la configuración de tu cuenta.`,

  // Welcome page
  gettingStartedSteps: [
    ['Abre Foldwise antes del truco.', 'Ábrela antes de que alguien esté mirando. Se abre directamente con el aspecto de Notas, así nadie ve el ícono de Foldwise.'],
    ['Elige tu lista y tu palabra.', 'Mantén presionado el título grande “Notas” para abrir la configuración y elige una lista y la palabra que vas a predecir.'],
    ['Practica una vez.', 'Prueba la entrada secreta unas cuantas veces a solas antes de hacerla frente a alguien.'],
  ],

  // Home screen
  homeIntro: 'Trucos de adivinación escondidos en apps de apariencia normal. Mira lo que vive tu público y desbloquea Foldwise para ver el video de demostración, el método y el truco.',
  trickTutorial: 'Video de demostración y cómo hacerlo',
};
