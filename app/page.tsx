'use client';

import React, { useCallback, useState } from 'react';
import ReactFlow, { ReactFlowProvider, addEdge, MiniMap, Controls, Background, Node, Edge, EdgeChange, NodeChange, Connection } from 'react-flow-renderer';

// Nodes creation (with pos and css)
const initialNodes: Node[] = [
    { id: '1', data: { label: 'Node 1: console.log("Start")' }, position: { x: 100, y: 100 }, style: { background: '#E0E0E0' }},
    { id: '2', data: { label: 'Node 2: console.log("Process 1")' }, position: { x: 300, y: 100 }, style: { background: '#E0E0E0' }},
    { id: '3', data: { label: 'Node 3: console.log("Process 2")' }, position: { x: 500, y: 100 }, style: { background: '#E0E0E0' }},
    { id: '4', data: { label: 'Node 4: console.log("End")' }, position: { x: 700, y: 100 }, style: { background: '#E0E0E0' }},
];

// Edges creation - links the nodes together
const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
  { id: 'e3-4', source: '3', target: '4', animated: true },
].map(edge => ({ ...edge, animated: edge.animated ?? false }));

const FlowPage = () => {
    // Handling nodes and edges states
    const [nodes, setNodes] = useState(initialNodes);
    const [edges, setEdges] = useState(initialEdges);

    // Function for movements or modificationn of nodes
    const onNodesChange = useCallback((changes: NodeChange[]) => {
      setNodes((nds) =>
          nds.map((node) => {
              const change = changes.find((c) => 'id' in c && c.id === node.id);
              // Update nodes after modifications
              return change ? { ...node, ...change } : node;
          })
      );
  }, []); 
   
  // Function for addition, modification and deletion of edfges
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
        setEdges((eds) => changes.reduce((acc, change) => {
            if (change.type === 'remove') {
                // Delete the link
                return acc.filter((edge) => edge.id !== change.id);
            }
            // Add or update link
            return acc;
        }, addEdge(changes[0] as Edge | Connection, eds as Edge[])));
    },
    []
);
    
    // Export conf of nodes and edges to JSON
    const handleExport = () => {
        const flow = { nodes, edges }; // Object creation (contains nodes and edges)
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(flow));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "flow.json");
        downloadAnchorNode.click(); // DL JSON file
        downloadAnchorNode.remove();
    };

    // One by one exec
    const executeFlow = async () => {
        for (const node of nodes) {
            // Yellow during exec
            setNodes((nds) => nds.map((n) => n.id === node.id ? { ...n, style: { background: '#FFD700' } } : n));
            console.log(node.data.label);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 sec iinvterval
            // Green after it's done
            setNodes((nds) => nds.map((n) => n.id === node.id ? { ...n, style: { background: '#90EE90' } } : n));
        }
    };

    return (
        <ReactFlowProvider>
            <div style={{ height: 500 }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    fitView
                >
                    <MiniMap /> 
                    <Controls /> 
                    <Background /> 
                </ReactFlow>
                <button onClick={handleExport}>Export as JSON</button>
                <button onClick={executeFlow}>Execute Flow</button> 
            </div>
        </ReactFlowProvider>
    );
};

export default FlowPage;
