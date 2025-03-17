import "reactflow/dist/style.css";
import { FormEvent, ReactNode, useCallback, useContext, useEffect, useRef, useState } from "react";
import ReactFlow, { Background } from "reactflow";
import { AddNodeEdge } from "./AddNodeEdge";
import { CommonDrawerProps, CurrentDrawer } from "./Drawers";
import { editor, EditorProvider } from "./Editor";
import { GraphProvider, graph } from "./Graph";
import { allNodes } from "./Nodes";
import { generateEdge, generateNode } from "./nodeGeneration";
import { positionNodes } from "./positionNodes";
import Modal from "@src/components/Modal";

const edgeTypes = {
  "add-node": AddNodeEdge,
};

type ChooseNodeDrawerProps = {
  sourceNodeId?: string;
  targetNodeId?: string;
  sourceEdgeLabel?: ReactNode | null | undefined;
} & CommonDrawerProps;

function ReactFlowSandbox() {
  const {
    addNodeAfterEdge,
    nodes,
    edges,
    reactFlowInstance,
    setReactFlowInstance,
    fitZoomToGraph,
    setNodes,
    setEdges,
  } = useContext(graph);
  const [currentEditingNode, setCurrentEditingNode] = useState<ChooseNodeDrawerProps>({})
  const {editNodeModal, setEditNodeModal, drawerProps} = useContext(editor);
  
  useEffect(() => {
    if (Object.values(drawerProps).length !== 0){
      setCurrentEditingNode(drawerProps)
    }
  }, [drawerProps])

  useEffect(() => {
    if(!editNodeModal){
      setCurrentEditingNode({})
    }
  }, [editNodeModal])

  const [centeredGraphAtStart, setCenteredGraphAtStart] = useState(false);
  const reactFlowRef = useRef<HTMLDivElement>(null);

  const tryCenteringGraph = useCallback(() => {
    if (centeredGraphAtStart) {
      return;
    }

    fitZoomToGraph(reactFlowRef);

    const viewport = reactFlowInstance?.getViewport();
    if (viewport && viewport.x !== 0 && viewport.y !== 0) {
      return setCenteredGraphAtStart(true);
    }

    const retryTimeInMs = 50;
    setTimeout(() => tryCenteringGraph(), retryTimeInMs);
  }, [centeredGraphAtStart, fitZoomToGraph, reactFlowInstance]);

  useEffect(() => {
    tryCenteringGraph();
  }, [tryCenteringGraph]);

  useEffect(() => {
    const initialNodes = [
      generateNode({ nodeName: "start", id: "start" }),
      generateNode({ nodeName: "end" }),
    ];
    const initialEdges = [
      generateEdge({
        source: "start",
        target: initialNodes[1].id,
      }),
    ];
    const [positionedNodes, positionedEdges] = positionNodes(
      initialNodes,
      initialEdges
    );
    setNodes(positionedNodes);
    setEdges(positionedEdges);
  }, []);

  const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const formValues: Record<string, string> = {};

    // looping through FormData entries to populate the formValues object
    formData.forEach((value, key) => {
      formValues[key] = value as string;
    });
  
    if (currentEditingNode.id !== undefined) {
      const edge = edges.find((edge) => edge.id === currentEditingNode.id)!;
      addNodeAfterEdge({
        nodeName: "conditional",
        edge,
        nodeLabel: formValues.variables
      });
    }
    setEditNodeModal(false)
  }

  return (
    <div className="h-full flex flex-col overflow-hidden w-full relative">
      <Modal isOpen={editNodeModal} id="node-modal" onClose={() => {setEditNodeModal(false); setCurrentEditingNode({} as ChooseNodeDrawerProps)}}>
        <form onSubmit={handleFormSubmit} className="flex flex-col m-auto items-center max-w-[80%]">
          <h1>Add your rule</h1>
          <div className="py-2">
            <label htmlFor="variable">Variable: </label>
            <input name="variable" id="variable" className="input-basics" placeholder="insert your variable here" />
          </div>
          <div className="py-2">
          <label htmlFor="comparison">Comparison: </label>
          <select id="comparison">
            <option value="" disabled selected hidden className="text-gray-400">Select Comparison</option>
            <option value="=">Equal to</option>
            <option value="<">Less than</option>
            <option value="<=">Lesse than or equal to</option>
            <option value=">=">Greater than or equal to</option>
            <option value=">">Greater than</option>
          </select>
          </div>
          <div className="py-2">
            <label htmlFor="value">Value: </label>
            <input name="value" id="value" className="input-basics" placeholder="insert your variable here" />
          </div>
          <div className="py-2">
            <label htmlFor="what-if-true">if true, show: </label>
            <input name="what-if-true" id="what-if-true" className="input-basics" placeholder="insert your variable here" />
          </div>
          <div className="py-2">
            <label htmlFor="what-if-false">If false, show: </label>
            <input name="what-if-false" id="what-if-false" className="input-basics" placeholder="insert your variable here" />
          </div>
          <button type="submit">Enviar</button>
        </form>
      </Modal>
        <ReactFlow
          ref={reactFlowRef}
          nodes={nodes}
          edges={edges}
          edgeTypes={edgeTypes}
          nodeTypes={allNodes}
          onInit={setReactFlowInstance}
          nodesDraggable={false}
          deleteKeyCode={null}
        >
          <Background className="bg-N-75" size={2} color="#C1C4D6" />
        </ReactFlow>
        <CurrentDrawer />
    </div>
  );
}

export function GraphEditor() {
  return (
    <EditorProvider>
      <GraphProvider>
        <ReactFlowSandbox />
      </GraphProvider>
    </EditorProvider>
  );
}
