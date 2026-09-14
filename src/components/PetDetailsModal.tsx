import { IonContent, IonIcon, IonModal } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import type { Pet } from "../types/pet";

interface PetDetailsModalProps {
    pet: Pet | null;
    onClose: () => void;
}

const PetDetailsModal = ({ pet, onClose }: PetDetailsModalProps) => (
    <IonModal
        isOpen={Boolean(pet)}
        onDidDismiss={onClose}
        className="items-end [--width:min(100%,620px)] [--height:min(92%,800px)] [--border-radius:22px_22px_0_0] min-[700px]:items-center min-[700px]:[--border-radius:22px] [&::part(content)]:shadow-[0_-20px_55px_rgb(8_6_78/35%)]"
    >
        <IonContent className="[--background:#f7f7fb] [--color:#11112a] font-[IoskeleyMono,Space_Mono,Menlo,Monaco,Consolas,monospace]">
            {pet && (
                <div className="mx-auto min-h-full w-full max-w-140 px-5 pt-6 pb-[calc(28px+env(safe-area-inset-bottom))]">
                    <div className="mb-6 flex items-start justify-between gap-4">
                        <div>
                            <h2 className="mt-0.5 text-[27px] leading-[1.2] font-bold text-[#1912d1]">
                                {pet.name}
                            </h2>
                        </div>
                        <button
                            type="button"
                            className="grid size-11 shrink-0 cursor-pointer place-items-center border-0 bg-transparent p-0 text-[26px] text-[#1912d1] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#ffcf40]"
                            aria-label="Close details"
                            onClick={onClose}
                        >
                            <IonIcon icon={closeOutline} />
                        </button>
                    </div>
                    <dl className="grid gap-px overflow-hidden rounded-[13px] border border-[#ddddea] bg-[#ddddea] [&_dd]:m-0 [&_dd]:wrap-anywhere [&_dd]:text-xs [&_dd]:leading-[1.55] [&_dt]:text-[10px] [&_dt]:text-[#69697e] [&_dt]:uppercase [&>div]:grid [&>div]:grid-cols-[minmax(110px,35%)_1fr] [&>div]:gap-3.5 [&>div]:bg-white [&>div]:p-3.75">
                        <div>
                            <dt>Animal type</dt>
                            <dd>{pet.animalType}</dd>
                        </div>
                        <div>
                            <dt>Breed</dt>
                            <dd>{pet.breed}</dd>
                        </div>
                        <div>
                            <dt>Age</dt>
                            <dd>{pet.age}</dd>
                        </div>
                        <div>
                            <dt>Owner</dt>
                            <dd>{pet.ownerName}</dd>
                        </div>
                        <div className="grid-cols-1!">
                            <dt>Notes</dt>
                            <dd>{pet.notes}</dd>
                        </div>
                        {pet.createdAt && (
                            <div>
                                <dt>Added</dt>
                                <dd>{pet.createdAt.toLocaleDateString()}</dd>
                            </div>
                        )}
                    </dl>
                </div>
            )}
        </IonContent>
    </IonModal>
);

export default PetDetailsModal;
