export const familyData = {
    id: "root",
    layoutOptions: { 
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.layered.spacing.nodeNodeBetweenLayers': 50,
      'elk.spacing.nodeNode': 30,
      'elk.layered.mergeEdges': true
    },
    children: [
      { id: "1", label: "Yo", width: 80, height: 30 },
      { id: "2", label: "Madre", width: 100, height: 30 },
      { id: "3", label: "Padre", width: 100, height: 30 },
      { id: "4", label: "Hermano 1", width: 80, height: 30 },
      { id: "5", label: "Hermano 2", width: 80, height: 30 }
    ],
    complexEdges: [
      { sources: ["2","3"], targets: ["1"] },
      { sources: ["2","3"], targets: ["4"] },
      { sources: ["2","3"], targets: ["5"] }
        ]
    };
  