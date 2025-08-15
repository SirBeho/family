import { familyData } from './data.js';

const svg = document.getElementById("svg");
const elk = new ELK();

// Prepara nodos y edges para ELK
function prepareLayout(data) {
    const children = [...data.children];
    const edges = [];
    const marriageMap = new Map();
  
    data.complexEdges.forEach(edge => {
      if (edge.sources.length > 1) {
        const key = edge.sources.sort().join(","); // clave única por padres
  
        let marriageId;
        if (marriageMap.has(key)) {
          marriageId = marriageMap.get(key);
        } else {
          marriageId = `m_${marriageMap.size}`; // id único
          children.push({ id: marriageId, label: "♥", width: 20, height: 20 });
          marriageMap.set(key, marriageId);
  
          // Crear edges padres → matrimonio
          edge.sources.forEach(src => {
            // verifica que el nodo padre exista
            if (!children.find(n => n.id === src)) {
              console.error("Nodo padre no existe:", src);
            }
            edges.push({ id: `e_${src}_${marriageId}`, sources: [src], targets: [marriageId], type: "marriage" });
          });
        }
  
        // Crear edges matrimonio → hijos
        edge.targets.forEach(tgt => {
          // verifica que el nodo hijo exista
          if (!children.find(n => n.id === tgt)) {
            console.error("Nodo hijo no existe:", tgt);
          }
          edges.push({ id: `e_${marriageId}_${tgt}`, sources: [marriageId], targets: [tgt], type: "child" });
        });
  
      } else {
        // edge simple
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
  layout.children.forEach(node => {
    const g = document.createElementNS("http://www.w3.org/2000/svg","g");
    const rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
    rect.setAttribute("x", node.x);
    rect.setAttribute("y", node.y);
    rect.setAttribute("width", node.width);
    rect.setAttribute("height", node.height);
    rect.setAttribute("rx", node.label==="♥"?10:6);
    rect.setAttribute("ry", node.label==="♥"?10:6);
    rect.setAttribute("fill", node.label==="♥"? "#ffcc80":"#90caf9");
    rect.setAttribute("stroke", node.label==="♥"? "#fb8c00":"#1e88e5");
    const text = document.createElementNS("http://www.w3.org/2000/svg","text");
    text.setAttribute("x", node.x+node.width/2);
    text.setAttribute("y", node.y+node.height/2);
    text.setAttribute("dominant-baseline","middle");
    text.setAttribute("text-anchor","middle");
    text.textContent = node.label;
    g.appendChild(rect);
    g.appendChild(text);
    svg.appendChild(g);
  });

  layout.edges.forEach(edge => {
    const source = layout.children.find(n => n.id===edge.sources[0]);
    const target = layout.children.find(n => n.id===edge.targets[0]);
    const path = document.createElementNS("http://www.w3.org/2000/svg","path");
    const startX = source.x+source.width/2;
    const startY = source.y+source.height/2;
    const endX = target.x+target.width/2;
    const endY = target.y+target.height/2;

    if(edge.type==="marriage"){
      path.setAttribute("d",`M${startX} ${startY} L${endX} ${endY}`);
      path.setAttribute("stroke","red");
      path.setAttribute("stroke-width",2);
    } else {
      const midY = (startY+endY)/2;
      path.setAttribute("d",`M${startX} ${startY} L${startX} ${midY} L${endX} ${midY} L${endX} ${endY}`);
      path.setAttribute("stroke","green");
      path.setAttribute("stroke-width",1.5);
    }
    path.setAttribute("fill","none");
    svg.appendChild(path);
  });
});
