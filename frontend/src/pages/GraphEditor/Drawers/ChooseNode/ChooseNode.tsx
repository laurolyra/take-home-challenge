import { DiamondSvg } from "assets/Diamond";
import { Drawer } from "components/Drawer";
import { editor } from "@src/pages/GraphEditor/Editor";
import { useContext } from "react";

import { ChooseNodeButton } from "./ChooseNodeButton";

export const ChooseNodeDrawer = () => {
  const { drawerVisible, closeEditorDrawer, setEditNodeModal } = useContext(editor);

  const handleNodeOptionModal = () => {
    closeEditorDrawer();
    setEditNodeModal(true)
  }

  return (
    <Drawer
      title="Add a new block"
      content={
        <>
          <div className="grid grid-cols-2 gap-4">
            <ChooseNodeButton
              preview={
                <DiamondSvg className="h-12 w-20 stroke-4 stroke-Y-350 text-Y-300" />
              }
              label="Conditional"
              onClick={handleNodeOptionModal}
            />
          </div>
        </>
      }
      onClose={closeEditorDrawer}
      visible={drawerVisible}
    />
  );
};
