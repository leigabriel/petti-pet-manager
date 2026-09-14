import { IonModal } from "@ionic/react";

interface ExitConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

const ExitConfirmModal = ({
    isOpen,
    onConfirm,
    onCancel,
}: ExitConfirmModalProps) => (
    <IonModal
        isOpen={isOpen}
        onDidDismiss={onCancel}
        className="[--width:min(100%,320px)] [--height:auto] [--border-radius:18px] items-center justify-center"
    >
        <div className="w-full bg-white px-6 pt-7 pb-5 text-center font-[IoskeleyMono,Space_Mono,Menlo,Monaco,Consolas,monospace]">
            <h2 className="m-0 text-[18px] font-bold text-[#1912d1]">
                Exit Petti?
            </h2>
            <p className="mt-2 text-[13px] leading-[1.55] text-[#5f5f75]">
                Are you sure you want to close the app?
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
                <button
                    type="button"
                    onClick={onCancel}
                    className="min-h-12 cursor-pointer rounded-[11px] border border-[#e1e1ec] bg-white text-[13px] font-bold text-[#1912d1] transition-[transform,filter] duration-150 active:scale-97 active:brightness-94 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#ffcf40]"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    className="min-h-12 cursor-pointer rounded-[11px] border-0 bg-[#b42318] text-[13px] font-bold text-white transition-[transform,filter] duration-150 active:scale-97 active:brightness-94 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#ffcf40]"
                >
                    Exit
                </button>
            </div>
        </div>
    </IonModal>
);

export default ExitConfirmModal;
