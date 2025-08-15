import { familyData } from './data.js';

const svg = document.getElementById("svg");
const elk = new ELK();

// Crear capas para que las líneas queden debajo de los nodos
const svgEdges = document.createElementNS("http://www.w3.org/2000/svg","g");
const svgNodes = document.createElementNS("http://www.w3.org/2000/svg","g");
svg.appendChild(svgEdges);
svg.appendChild(svgNodes);

// Prepara nodos y edges para ELK
function prepareLayout(data) {
  const children = [...data.children];
  const edges = [];
  const marriageMap = new Map();

  data.complexEdges.forEach(edge => {
    if (edge.sources.length > 1) {
      const key = edge.sources.sort().join(",");

      let marriageId;
      if (marriageMap.has(key)) {
        marriageId = marriageMap.get(key);
      } else {
        marriageId = `m_${marriageMap.size}`;
        children.push({ id: marriageId, label: "♥", width: 20, height: 20 });
        marriageMap.set(key, marriageId);

        // Conectar padres → matrimonio
        edge.sources.forEach(src => {
          edges.push({ id: `e_${src}_${marriageId}`, sources: [src], targets: [marriageId], type: "marriage" });
        });
      }

      // Conectar matrimonio → hijos
      edge.targets.forEach(tgt => {
        edges.push({ id: `e_${marriageId}_${tgt}`, sources: [marriageId], targets: [tgt], type: "child" });
      });

    } else {
      // Edge simple
      edge.sources.forEach(src => {
        edge.targets.forEach(tgt => {
          edges.push({ id: `e_${src}_${tgt}`, sources: [src], targets: [tgt], type: "child" });
        });
      });
    }
  });

  return { id: "root", children, edges, layoutOptions: data.layoutOptions };
}

// Layout
elk.layout(prepareLayout(familyData)).then(layout => {

  // Recalcular posición de nodos de matrimonio (centrados entre padres)
  layout.children.forEach(node => {
    if (node.label === "♥") {
      const parentEdges = layout.edges.filter(e => e.targets[0] === node.id && e.type === "marriage");
      if (parentEdges.length === 2) {
        const parent1 = layout.children.find(n => n.id === parentEdges[0].sources[0]);
        const parent2 = layout.children.find(n => n.id === parentEdges[1].sources[0]);

        node.x = (parent1.x + parent1.width/2 + parent2.x + parent2.width/2)/2 - node.width/2;
        node.y = parent1.y + parent1.height/2; // línea horizontal con los padres
      }
    }
  });

  // Dibujar edges (líneas)
  layout.edges.forEach(edge => {
    const source = layout.children.find(n => n.id === edge.sources[0]);
    const target = layout.children.find(n => n.id === edge.targets[0]);
    const path = document.createElementNS("http://www.w3.org/2000/svg","path");

    const startX = source.x + source.width/2;
    const startY = source.y + source.height/2;
    const endX = target.x + target.width/2;
    const endY = target.y + target.height/2;

    if(edge.type === "marriage") {
      path.setAttribute("d", `M${startX} ${startY} L${endX} ${endY}`);
      path.setAttribute("stroke", "red");
      path.setAttribute("stroke-width", 2);
    } else {
      const midY = (startY + endY)/2;
      path.setAttribute("d", `M${startX} ${startY} L${startX} ${midY} L${endX} ${midY} L${endX} ${endY}`);
      path.setAttribute("stroke", "green");
      path.setAttribute("stroke-width", 1.5);
    }

    path.setAttribute("fill", "none");
    svgEdges.appendChild(path);
  });

  // Dibujar nodos (sobre las líneas)
  layout.children.forEach(node => {
    const g = document.createElementNS("http://www.w3.org/2000/svg","g");

    const rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
    rect.setAttribute("x", node.x);
    rect.setAttribute("y", node.y);
    rect.setAttribute("width", node.width);
    rect.setAttribute("height", node.height);
    rect.setAttribute("rx", node.label === "♥" ? 10 : 6);
    rect.setAttribute("ry", node.label === "♥" ? 10 : 6);
    rect.setAttribute("fill", node.label === "♥" ? "#ffcc80" : "#90caf9");
    rect.setAttribute("stroke", node.label === "♥" ? "#fb8c00" : "#1e88e5");

    const text = document.createElementNS("http://www.w3.org/2000/svg","text");
    text.setAttribute("x", node.x + node.width/2);
    text.setAttribute("y", node.y + node.height/2);
    text.setAttribute("dominant-baseline", "middle");
    text.setAttribute("text-anchor", "middle");
    text.textContent = node.label;

    g.appendChild(rect);
    g.appendChild(text);
    svgNodes.appendChild(g);
  });

});
