import { familyData } from './data.js';


const elk = new ELK();

const svg = document.getElementById("svg");

// Crear capas para que las líneas queden debajo de los nodos
const svgEdges = document.createElementNS("http://www.w3.org/2000/svg","g");
const svgNodes = document.createElementNS("http://www.w3.org/2000/svg","g");
svg.appendChild(svgEdges);
svg.appendChild(svgNodes);

// Crear marker de flecha
const defs = document.createElementNS("http://www.w3.org/2000/svg","defs");
const arrow = document.createElementNS("http://www.w3.org/2000/svg","marker");
arrow.setAttribute("id","arrowhead");
arrow.setAttribute("markerWidth","10");
arrow.setAttribute("markerHeight","7");
arrow.setAttribute("refX","10");
arrow.setAttribute("refY","3.5");
arrow.setAttribute("orient","auto");
arrow.setAttribute("markerUnits","strokeWidth");
const pathArrow = document.createElementNS("http://www.w3.org/2000/svg","path");
pathArrow.setAttribute("d","M0,0 L10,3.5 L0,7 Z");
pathArrow.setAttribute("fill","green");
arrow.appendChild(pathArrow);
defs.appendChild(arrow);
svg.appendChild(defs);

// Preparar layout para ELK
function prepareLayout(data) {
  const children = data.people.map(n => ({
    id: n.id,
    label: n.label,
    width: n.width || 100,
    height: n.height || 30
  }));
  const edges = [];
  const marriageMap = new Map();

  data.relations.forEach(rel => {
    if(rel.parents.length > 1){
      const key = rel.parents.sort().join(",");
      let marriageId;
      if(marriageMap.has(key)){
        marriageId = marriageMap.get(key);
      } else {
        marriageId = `m_${marriageMap.size}`;
        children.push({ id: marriageId, label: "♥", width: 20, height: 20 });
        marriageMap.set(key, marriageId);
        rel.parents.forEach(src => {
          edges.push({ id: `e_${src}_${marriageId}`, sources: [src], targets: [marriageId], type: "marriage" });
        });
      }
      rel.children.forEach(tgt => {
        edges.push({ id: `e_${marriageId}_${tgt}`, sources: [marriageId], targets: [tgt], type: "child" });
      });
    } else {
      // edge simple
      rel.parents.forEach(src => {
        rel.children.forEach(tgt => {
          edges.push({ id: `e_${src}_${tgt}`, sources: [src], targets: [tgt], type: "child" });
        });
      });
    }
  });

  return { id: "root", children, edges, layoutOptions: data.layoutOptions };
}

// Layout con ELK
elk.layout(prepareLayout(familyData)).then(layout => {

  // Recalcular posición de nodos de matrimonio (centrados entre padres)
  layout.children.forEach(node => {
    if(node.label === "♥"){
      const parentEdges = layout.edges.filter(e => e.targets[0]===node.id && e.type==="marriage");
      if(parentEdges.length === 2){
        const p1 = layout.children.find(n => n.id === parentEdges[0].sources[0]);
        const p2 = layout.children.find(n => n.id === parentEdges[1].sources[0]);
        node.x = (p1.x + p1.width/2 + p2.x + p2.width/2)/2 - node.width/2;
        node.y = p1.y + p1.height/2;
      }
    }
  });

  // Dibujar nodos sobre las líneas
  layout.children.forEach(node => {
    const g = document.createElementNS("http://www.w3.org/2000/svg","g");
    const rect = document.createElementNS("http://www.w3.org/2000/svg","rect");
    rect.setAttribute("x",node.x);
    rect.setAttribute("y",node.y);
    rect.setAttribute("width", node.width || 80);   // valor por defecto si ELK no da tamaño
    rect.setAttribute("height", node.height || 30);
    rect.setAttribute("rx",node.label==="♥"?10:6);
    rect.setAttribute("ry",node.label==="♥"?10:6);
    rect.setAttribute("fill",node.label==="♥"? "#ffcc80":"#90caf9");
    rect.setAttribute("stroke",node.label==="♥"? "#fb8c00":"#1e88e5");

    const text = document.createElementNS("http://www.w3.org/2000/svg","text");
    text.setAttribute("x",node.x+node.width/2);
    text.setAttribute("y",node.y+node.height/2);
    text.setAttribute("dominant-baseline","middle");
    text.setAttribute("text-anchor","middle");
    text.textContent = node.label;

    g.appendChild(rect);
    g.appendChild(text);
    svgNodes.appendChild(g);
  });

  // Dibujar edges
  layout.edges.forEach(edge => {
      
    
    const source = layout.children.find(n => n.id===edge.sources[0]);
    const target = layout.children.find(n => n.id===edge.targets[0]);
    const path = document.createElementNS("http://www.w3.org/2000/svg","path");
    const startX = source.x + source.width/2;
    const startY = source.y + source.height/2;
    const endX = target.x + target.width/2;

    

  
    const endY = target.y; 


    if(edge.type==="marriage"){
      const endY = target.y + target.height/2;
      // Línea recta sin flecha
      path.setAttribute("d",`M${startX} ${startY} L${endX} ${endY}`);
      path.setAttribute("stroke","red");
      path.setAttribute("stroke-width",2);
    } else {
      // Flechas solo en hijos
      const endY = target.y ;
      const midY = (startY + endY)/2;
      path.setAttribute("d",`M${startX} ${startY} L${startX} ${midY} L${endX} ${midY} L${endX} ${endY}`);
      path.setAttribute("stroke","green");
      path.setAttribute("stroke-width",1.5);
      path.setAttribute("marker-end","url(#arrowhead)");
    }
   

    path.setAttribute("fill","none");
    svgEdges.appendChild(path);
  });

});
