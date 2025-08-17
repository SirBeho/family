export const familyData = {
    layoutOptions: { 
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.layered.spacing.nodeNodeBetweenLayers': 50,
      'elk.spacing.nodeNode': 50,
      'elk.padding': '[20,20,20,20]',  
      'elk.layered.crossingMinimization': 'LAYER_SWEEP',
      'elk.spacing.edgeNodeBetweenLayers': 40
    },
    people: [
      // Yo y hermanos
      { id: "1", label: "Yo" }, 
      { id: "4", label: "Hermano 1" }, 
      { id: "5", label: "Hermano 2" },
  
      // Padres
      { id: "2", label: "Madre" }, 
      { id: "3", label: "Padre" },
  
      // Abuelos maternos
      { id: "6", label: "Abuela Materna" }, 
      { id: "7", label: "Abuelo Materno" },
  
      // Abuelos paternos
      { id: "8", label: "Abuela Paterna" }, 
      { id: "9", label: "Abuelo Paterno" },
  
      // Tíos (hermanos de padres)
      { id: "10", label: "Tío Materno" }, 
      { id: "11", label: "Tía Paterna" }, 
  
      // Cónyuge del tío
      { id: "14", label: "Tía Política" }, 
  
      // Primos
      { id: "12", label: "Primo 1" }, 
      { id: "13", label: "Prima 1" }, 
      { id: "15", label: "Primo 2" }, 
      { id: "16", label: "Prima 2" },
  
      // Cónyuges de primos
      { id: "17", label: "Esposo Primo 2" }, 
      { id: "18", label: "Esposa Prima 2" },
  
      // Padres de cónyuges
      { id: "19", label: "Suegra Primo 2" }, 
      { id: "20", label: "Suegro Primo 2" }, 
      { id: "21", label: "Suegra Prima 2" }, 
      { id: "22", label: "Suegro Prima 2" },
      { id: "23", label: "hijo de ellos" },
      { id: "24", label: "hijo Primo 1" },
      { id: "25", label: "hijo Primo 3" },
      { id: "26", label: "thyago" },
      { id: "27", label: "padres suegra prima2" },
      { id: "28", label: "padres suegra prima2" },
 

    ],
    relations: [
      // Padres → hijos
      { parents: ["2","3"], children: ["1","4","5"] },
  
      // Abuelos → padres y tíos
      { parents: ["6","7"], children: ["2","10"] }, // abuelos maternos → madre y su hermano
      { parents: ["8","9"], children: ["3","11"] }, // abuelos paternos → padre y su hermana
      { parents: ["28","27"], children: ["3","11"] }, // abuelos paternos → padre y su hermana
  
      // Tíos → primos
      { parents: ["10","14"], children: ["15"] },   // tío materno + esposa → primo 2
      { parents: ["11"], children: ["12"] },        // tía paterna → primo 1
      { parents: ["11"], children: ["13"] },        // tía paterna → prima 1
      { parents: ["15","17"], children: ["23"] },       // primo 2 + esposa (hijos aún no tiene)
      { parents: ["16","18"], children: ["25"] },       // prima 2 + esposo (hijos aún no tiene)
      { parents: ["12"], children: ["24"] },       // prima 2 + esposo (hijos aún no tiene)
      { parents: ["1"], children: ["26"] },       // prima 2 + esposo (hijos aún no tiene)
  
      // Padres de cónyuges (opcional, para mostrar origen)
      { parents: ["19","20"], children: ["17"] },   // padres del esposo primo 2
      { parents: ["21","22"], children: ["18"] } ,
      { parents: ["10","14"], children: ["15","16"] } ,  // padres de la esposa prima 2
    ]
  };
  