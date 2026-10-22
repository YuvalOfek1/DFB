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
    ['Muestra la lista.', 'Abre la nota y deja que el espectador recorra toda la lista. Todos los elementos son distintos.'],
    ['Pide un número.', 'Primero recupera el teléfono, para que elija sin ver la lista. Pide cualquier número del 1 al total de la lista. Deja que cambie de opinión.'],
    ['Ingrésalo en secreto.', 'Justo después de que diga el número, señala la predicción doblada y recuérdales a todos que se escribió antes de que eligiera. Mientras todos la miran, toca cualquier parte de la nota. Se abre el teclado numérico, pero no aparece nada de lo que escribes. Escribe su número y vuelve a tocar la nota.'],
    ['Revela.', 'Gira la pantalla hacia ellos, baja hasta su número y deja que lean el elemento en voz alta. Después abre la predicción.'],
  ],
  legal: (store) => `El pago se carga a tu ${store}. La suscripción se renueva automáticamente cada mes, a menos que la canceles al menos 24 horas antes de que termine el periodo actual. Puedes administrarla o cancelarla en la configuración de tu cuenta.`,

  // Home screen
  homeIntro: 'Trucos de adivinación escondidos en apps de apariencia normal. Mira lo que vive tu público y desbloquea Foldwise para ver el video de demostración, el método y el truco.',
  trickTutorial: 'Video de demostración y cómo hacerlo',

  // Welcome
  welcomeKeyText: 'Mantén presionado el título grande “Notas” para abrir la configuración. Ahí eliges la palabra que vas a predecir, editas las listas y encuentras el tutorial. Tu público nunca la ve.',
  welcomeLearnSteps: [
    ['El truco de Notas', 'Alguien dice cualquier número y encuentra ahí tu predicción.'],
    ['Cómo hacerlo', 'Un video de demostración y una guía paso a paso: qué decir, cuándo hacer el movimiento secreto y cómo revelarlo.'],
    ['Tus propias listas', 'Famosos, películas, lugares o lo que tú escribas.'],
    ['Más trucos', 'Cada truco nuevo en cuanto salga.'],
  ],
};
