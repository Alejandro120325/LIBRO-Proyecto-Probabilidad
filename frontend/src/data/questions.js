export const games = {
  1: {
    title: "Detective Bayesiano",
    subtitle: "Investiga la evidencia y descubre la probabilidad oculta.",
    topic: "Regla de Bayes",
    questions: [
      {
        prompt: "Una condición afecta al 1% de la población. Una prueba tiene 90% de sensibilidad y 5% de falsos positivos. ¿Cuál es P(condición | positivo)?",
        options: ["15,38%", "90%", "5%", "64,62%"], answer: 0,
        explanation: "P(+)=0,90×0,01 + 0,05×0,99 = 0,0585. Entonces P(C|+)=0,009/0,0585=15,38%.",
      },
      {
        prompt: "Si P(A)=0,30, P(B|A)=0,80 y P(B)=0,50, ¿cuánto vale P(A|B)?",
        options: ["0,24", "0,48", "0,62", "0,80"], answer: 1,
        explanation: "P(A|B)=[0,80×0,30]/0,50=0,24/0,50=0,48.",
      },
      {
        prompt: "En la fórmula de Bayes, ¿qué representa P(B|A)?",
        options: ["La probabilidad previa de A", "La probabilidad total de B", "La probabilidad de observar B cuando ocurre A", "La probabilidad posterior"], answer: 2,
        explanation: "P(B|A) es la verosimilitud: qué tan probable es observar la evidencia B si la hipótesis A es cierta.",
      },
      {
        prompt: "El 70% de productos viene de M1 y el 30% de M2. Sus tasas de aprobación son 90% y 20%. ¿Cuál es la probabilidad total de aprobación?",
        options: ["55%", "63%", "69%", "90%"], answer: 2,
        explanation: "P(A)=0,70×0,90 + 0,30×0,20 = 0,63+0,06=0,69.",
      },
      {
        prompt: "El 40% de correos es spam. Un filtro detecta 80% del spam y marca por error 10% del correo legítimo. Si marcó un correo, ¿qué probabilidad hay de que sea spam?",
        options: ["32%", "60%", "80%", "84,21%"], answer: 3,
        explanation: "P(S|M)=0,40×0,80 / [(0,40×0,80)+(0,60×0,10)] = 0,32/0,38 = 84,21%.",
      },
      {
        prompt: "¿Cuál es el paso clave antes de aplicar Bayes con dos causas posibles?",
        options: ["Ordenar los datos", "Calcular la probabilidad total de la evidencia", "Restar la media", "Multiplicar todas las probabilidades"], answer: 1,
        explanation: "El denominador P(B) debe sumar todas las formas mutuamente excluyentes en que puede ocurrir la evidencia.",
      },
    ],
  },
  2: {
    title: "Reto de Datos",
    subtitle: "Ordena, calcula y elige la medida correcta.",
    topic: "Media, mediana y moda",
    questions: [
      { prompt: "¿Cuál es la media de 4, 6, 8 y 10?", options: ["6", "7", "8", "9"], answer: 1, explanation: "(4+6+8+10)/4 = 28/4 = 7." },
      { prompt: "¿Cuál es la mediana de 2, 3, 5, 8 y 9?", options: ["3", "5", "5,4", "8"], answer: 1, explanation: "Hay cinco datos ordenados; el tercero, 5, ocupa el centro." },
      { prompt: "¿Cuál es la moda de 1, 2, 2, 3 y 4?", options: ["1", "2", "3", "No existe"], answer: 1, explanation: "El valor 2 aparece dos veces y los demás una sola vez." },
      { prompt: "Los datos 12, 4, 8 y 6 están desordenados. ¿Cuál es su media?", options: ["6,5", "7", "7,5", "8"], answer: 2, explanation: "El orden no afecta la media: (12+4+8+6)/4 = 30/4 = 7,5." },
      { prompt: "¿Cuál es la mediana de 3, 7, 9 y 11?", options: ["7", "8", "9", "10"], answer: 1, explanation: "Con cuatro datos se promedian los dos centrales: (7+9)/2 = 8." },
      { prompt: "En 6, 7, 7, 8, 9, 9, ¿cuál es la moda?", options: ["7", "9", "7 y 9", "8"], answer: 2, explanation: "7 y 9 aparecen dos veces; la distribución es bimodal." },
      { prompt: "Las calificaciones son 8, 9, 10, 7 y 6. ¿Cuál es la media?", options: ["7", "8", "8,5", "9"], answer: 1, explanation: "La suma es 40 y hay 5 notas: 40/5 = 8." },
      { prompt: "Ordena mentalmente 5, 1, 3, 9, 7 y 11. ¿Cuál es la mediana?", options: ["5", "6", "7", "9"], answer: 1, explanation: "Ordenados: 1,3,5,7,9,11. La mediana es (5+7)/2 = 6." },
    ],
  },
  3: {
    title: "Laboratorio Aleatorio",
    subtitle: "Experimenta con monedas, dados y distribuciones.",
    topic: "Variables aleatorias",
    questions: [
      { prompt: "Al lanzar un dado justo, ¿cuál es P(X>4)?", options: ["1/6", "1/3", "1/2", "2/3"], answer: 1, explanation: "Los resultados favorables son 5 y 6: 2 de 6, es decir, 1/3." },
      { prompt: "¿Cuál es el valor esperado de un dado justo?", options: ["3", "3,5", "4", "6"], answer: 1, explanation: "E(X)=(1+2+3+4+5+6)/6=21/6=3,5." },
      { prompt: "Se lanzan dos monedas. Si X es el número de caras, ¿cuánto vale P(X=1)?", options: ["1/4", "1/3", "1/2", "3/4"], answer: 2, explanation: "De CC, CS, SC y SS, dos resultados tienen exactamente una cara: 2/4=1/2." },
      { prompt: "¿Cuál de estas variables es continua?", options: ["Número de estudiantes", "Resultado de un dado", "Cantidad de llamadas", "Tiempo de espera"], answer: 3, explanation: "El tiempo puede tomar cualquier valor real dentro de un intervalo; las otras variables son contables." },
      { prompt: "Para una variable Bernoulli con P(X=1)=0,5, ¿cuál es su varianza?", options: ["0,25", "0,5", "1", "2"], answer: 0, explanation: "Var(X)=p(1-p)=0,5×0,5=0,25." },
      { prompt: "¿Qué condición debe cumplir una función de probabilidad discreta?", options: ["La suma debe ser 0", "Cada probabilidad debe superar 1", "Todas las probabilidades suman 1", "El valor esperado debe ser entero"], answer: 2, explanation: "Cada probabilidad está entre 0 y 1 y la suma sobre todos los valores posibles debe ser exactamente 1." },
    ],
  },
};

export function getGame(unitId) {
  return games[Number(unitId)];
}
