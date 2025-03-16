import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string
  children: JSX.Element;
}

const ESCAPE_KEY = '27'

const Modal = ({ isOpen, onClose, id, children}: ModalProps) => {
  const handleBackDropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault
    const target = e.target as HTMLElement;
    if (target.id !== id) return;
    onClose()
  }

  if (!isOpen) return null;

  useEffect(() => {
    if(!window) return;
    
    const keyUpListener = (e: KeyboardEvent) => {
      if (e.key === ESCAPE_KEY) onClose()
    }

    window.addEventListener('keyup', keyUpListener);
  
    return () => {
      window.removeEventListener('keyup', keyUpListener)
    }

  }, [])

  return (
  <div
    id={id}
    onClick={handleBackDropClick}
    className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-75"
    >
      <div className="w-[75vw] h-[75vh] p-5 bg-N-75 rounded-xl shadow-2xl relative flex flex-col justify-between">
          <div className="flex flex-row-reverse">
            <button onClick={onClose} className="w-5 h-5 bg-transparent border-none cursor-pointer relative">
              <div className="absolute w-5 h-0.5 bg-black transform rotate-45" />
              <div className="absolute w-5 h-0.5 bg-black transform -rotate-45" />
            </button>
          </div>
          {children}
      </div>
  </div>
  )
};
export default Modal;
