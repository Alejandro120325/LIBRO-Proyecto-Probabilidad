export const chapters = [
    {
        id: 1,
        unit: "Unidad 1",
        title: "Regla de Bayes",
        subtitle: "Probabilidad condicional aplicada",
        badge: "Probabilidad",
        color: "from-cyan-400 to-blue-600",
        introduction:
            "La Regla de Bayes permite actualizar una probabilidad cuando aparece nueva información. Se usa cuando queremos saber la probabilidad de que ocurra una causa sabiendo que ya ocurrió un efecto.",
        keyPoints: [
            "Relaciona una causa con una evidencia observada.",
            "Se usa mucho en diagnósticos, predicciones y toma de decisiones.",
            "Trabaja con probabilidades condicionales.",
            "Ayuda a cambiar una probabilidad inicial cuando aparece nueva información."
        ],
        formulas: [
            {
                name: "Fórmula principal de Bayes",
                expression: "P(A|B) = [P(B|A) · P(A)] / P(B)",
                description:
                    "Permite calcular la probabilidad de A sabiendo que ocurrió B."
            },
            {
                name: "Probabilidad total",
                expression: "P(B) = P(B|A) · P(A) + P(B|Aᶜ) · P(Aᶜ)",
                description:
                    "Sirve para calcular la probabilidad total del evento B considerando varios casos posibles."
            }
        ],
        exercises: [
            {
                title: "Ejercicio de diagnóstico",
                statement:
                    "Una enfermedad afecta al 2% de una población. Una prueba detecta la enfermedad correctamente el 95% de las veces. Si una persona no está enferma, la prueba da positivo por error el 4% de las veces. Si una persona da positivo, ¿cuál es la probabilidad de que realmente esté enferma?",
                steps: [
                    "Definimos A: la persona está enferma.",
                    "Definimos B: la prueba sale positiva.",
                    "P(A) = 0.02",
                    "P(B|A) = 0.95",
                    "P(Aᶜ) = 0.98",
                    "P(B|Aᶜ) = 0.04",
                    "Aplicamos Bayes: P(A|B) = [0.95 · 0.02] / [(0.95 · 0.02) + (0.04 · 0.98)]",
                    "P(A|B) = 0.019 / 0.0582",
                    "P(A|B) ≈ 0.3265"
                ],
                answer:
                    "La probabilidad de que realmente esté enferma es aproximadamente 32.65%."
            }
        ],
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        videoNote:
            "Aquí puedes colocar un video explicativo sobre la Regla de Bayes."
    },
    {
        id: 2,
        unit: "Unidad 2",
        title: "Media, Mediana y Moda",
        subtitle: "Estadística básica descriptiva",
        badge: "Estadística",
        color: "from-emerald-400 to-teal-600",
        introduction:
            "La media, la mediana y la moda son medidas de tendencia central. Sirven para resumir un conjunto de datos y entender cuál es el valor más representativo.",
        keyPoints: [
            "La media es el promedio de los datos.",
            "La mediana es el valor central cuando los datos están ordenados.",
            "La moda es el dato que más se repite.",
            "Estas medidas ayudan a interpretar información de manera rápida."
        ],
        formulas: [
            {
                name: "Media aritmética",
                expression: "x̄ = (x₁ + x₂ + x₃ + ... + xₙ) / n",
                description:
                    "Se suman todos los datos y se divide para la cantidad total de datos."
            },
            {
                name: "Mediana",
                expression: "Dato central de una lista ordenada",
                description:
                    "Si la cantidad de datos es impar, se toma el valor del centro. Si es par, se promedian los dos valores centrales."
            },
            {
                name: "Moda",
                expression: "Mo = dato con mayor frecuencia",
                description:
                    "Es el valor que aparece más veces dentro del conjunto de datos."
            }
        ],
        exercises: [
            {
                title: "Ejercicio con datos ordenados",
                statement:
                    "Dado el conjunto de datos: 4, 7, 7, 9, 10, 13. Calcula la media, mediana y moda.",
                steps: [
                    "Datos: 4, 7, 7, 9, 10, 13",
                    "Media: sumamos todos los datos.",
                    "4 + 7 + 7 + 9 + 10 + 13 = 50",
                    "Dividimos para la cantidad de datos: 50 / 6 = 8.33",
                    "Mediana: como hay 6 datos, tomamos los dos centrales: 7 y 9.",
                    "Mediana = (7 + 9) / 2 = 8",
                    "Moda: el número que más se repite es 7."
                ],
                answer:
                    "Media = 8.33, Mediana = 8, Moda = 7."
            }
        ],
        videoUrl: "",
        videoNote:
            "Aquí puedes colocar un video explicativo sobre media, mediana y moda."
    },
    {
        id: 3,
        unit: "Unidad 3",
        title: "Variables Aleatorias",
        subtitle: "Valores numéricos asociados a experimentos",
        badge: "Distribuciones",
        color: "from-violet-400 to-fuchsia-600",
        introduction:
            "Una variable aleatoria asigna un valor numérico a cada resultado posible de un experimento aleatorio. Puede ser discreta o continua.",
        keyPoints: [
            "Una variable aleatoria discreta toma valores contables.",
            "Una variable aleatoria continua puede tomar infinitos valores dentro de un intervalo.",
            "Se puede representar mediante una tabla de probabilidades.",
            "El valor esperado indica el promedio teórico de una variable aleatoria."
        ],
        formulas: [
            {
                name: "Valor esperado",
                expression: "E(X) = Σ x · P(x)",
                description:
                    "Es el promedio teórico de una variable aleatoria discreta."
            },
            {
                name: "Varianza",
                expression: "Var(X) = E(X²) - [E(X)]²",
                description:
                    "Mide qué tanto se dispersan los valores respecto al valor esperado."
            }
        ],
        exercises: [
            {
                title: "Ejercicio con dos monedas",
                statement:
                    "Se lanzan dos monedas al mismo tiempo. La variable aleatoria X representa el número de sellos obtenidos. Encuentra la función de probabilidad y el valor esperado.",
                steps: [
                    "Espacio muestral: CC, CS, SC, SS.",
                    "X puede tomar los valores 0, 1 y 2.",
                    "P(X = 0) = 1/4 porque solo ocurre en CC.",
                    "P(X = 1) = 2/4 porque ocurre en CS y SC.",
                    "P(X = 2) = 1/4 porque ocurre en SS.",
                    "E(X) = 0(1/4) + 1(2/4) + 2(1/4).",
                    "E(X) = 0 + 0.5 + 0.5 = 1."
                ],
                answer:
                    "La función de probabilidad es P(0)=1/4, P(1)=2/4, P(2)=1/4. El valor esperado es E(X)=1."
            }
        ],
        videoUrl: "",
        videoNote:
            "Aquí puedes colocar un video explicativo sobre variables aleatorias."
    }
];