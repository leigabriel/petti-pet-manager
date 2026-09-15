import { IonContent, IonIcon, IonModal, IonSpinner } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { useRef, useState } from "react";
import { deletePet, getPetDataErrorMessage } from "../services/pets";
import type { Pet } from "../types/pet";

const EditIcon = () => (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.7566 2.62145C16.5852 0.792851 19.55 0.792851 21.3786 2.62145C23.2072 4.45005 23.2072 7.41479 21.3786 9.24339L11.8933 18.7287C11.3514 19.2706 11.0323 19.5897 10.6774 19.8665C10.2592 20.1927 9.80655 20.4725 9.32766 20.7007C8.92136 20.8943 8.49334 21.037 7.76623 21.2793L4.43511 22.3897L3.63303 22.6571C2.98247 22.8739 2.26522 22.7046 1.78032 22.2197C1.29542 21.7348 1.1261 21.0175 1.34296 20.367L2.72068 16.2338C2.96303 15.5067 3.10568 15.0787 3.29932 14.6724C3.52755 14.1935 3.80727 13.7409 4.13354 13.3226C4.41035 12.9677 4.72939 12.6487 5.27137 12.1067L14.7566 2.62145ZM4.40051 20.8201L7.24203 19.8729C8.03314 19.6092 8.36927 19.4958 8.68233 19.3466C9.06287 19.1653 9.42252 18.943 9.75492 18.6837C10.0284 18.4704 10.2801 18.2205 10.8698 17.6308L18.4393 10.0614C17.6506 9.78321 16.6346 9.26763 15.6835 8.31651C14.7324 7.36538 14.2168 6.34939 13.9387 5.56075L6.36917 13.1302C5.77951 13.7199 5.52959 13.9716 5.3163 14.2451C5.05704 14.5775 4.83476 14.9371 4.65341 15.3177C4.50421 15.6307 4.3908 15.9669 4.12709 16.758L3.17992 19.5995L4.40051 20.8201ZM15.1554 4.34404C15.1896 4.519 15.2474 4.75684 15.3438 5.03487C15.561 5.66083 15.9712 6.48288 16.7442 7.25585C17.5171 8.02881 18.3392 8.43903 18.9651 8.6562C19.2432 8.75266 19.481 8.81046 19.656 8.84466L20.3179 8.18272C21.5607 6.93991 21.5607 4.92492 20.3179 3.68211C19.0751 2.4393 17.0601 2.4393 15.8173 3.68211L15.1554 4.34404Z"
            fill="currentColor"
        />
    </svg>
);

const DeleteIcon = () => (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.0924 1.25H8.90788C7.33861 1.24998 6.08032 1.24996 5.10577 1.38767C4.09802 1.53007 3.25979 1.83575 2.64218 2.55292C2.02457 3.27008 1.84661 4.14438 1.85528 5.1621C1.86366 6.1463 2.05033 7.39066 2.28314 8.94256L3.49937 17.0508C3.67587 18.2275 3.81878 19.1804 4.02849 19.9262C4.24683 20.7027 4.56045 21.3453 5.13662 21.8415C5.71279 22.3377 6.39485 22.5525 7.19513 22.6533C7.96377 22.75 8.92732 22.75 10.1173 22.75H13.883C15.073 22.75 16.0365 22.75 16.8052 22.6533C17.6054 22.5525 18.2875 22.3377 18.8637 21.8415C19.4398 21.3453 19.7535 20.7027 19.9718 19.9262C20.1815 19.1805 20.3244 18.2276 20.5009 17.0509L21.7172 8.94253C21.95 7.39065 22.1366 6.14629 22.145 5.1621C22.1537 4.14438 21.9757 3.27008 21.3581 2.55292C20.7405 1.83575 19.9023 1.53007 18.8945 1.38767C17.92 1.24996 16.6617 1.24998 15.0924 1.25ZM3.77879 3.53175C4.05882 3.20658 4.47927 2.9911 5.31565 2.87292C6.17295 2.75177 7.32479 2.75 8.96727 2.75H15.033C16.6755 2.75 17.8273 2.75177 18.6846 2.87292C19.521 2.9911 19.9415 3.20658 20.2215 3.53175C20.5015 3.85692 20.6523 4.30468 20.6451 5.14933C20.6448 5.18248 20.6443 5.21604 20.6435 5.25H20.5005C20.5003 5.25 20.5007 5.25 20.5005 5.25H7.00045C7.00025 5.25 7.00065 5.25 7.00045 5.25H3.35678C3.35603 5.21603 3.35551 5.18248 3.35522 5.14933C3.34803 4.30468 3.49876 3.85692 3.77879 3.53175ZM5.18949 6.75H3.48546C3.53687 7.15852 3.60161 7.61096 3.67631 8.1155L3.75015 8.18934L5.18949 6.75ZM4.05013 10.6106L4.6686 14.7338L6.37599 12.9365L4.05013 10.6106ZM5.15659 17.9593C5.17275 18.0594 5.18872 18.1563 5.20463 18.25H5.39887L5.15659 17.9593ZM6.99527 19.75C6.99879 19.75 7.00232 19.75 7.00584 19.75H13.9972C13.9991 19.75 14.0009 19.75 14.0027 19.75H18.4577C18.299 20.2287 18.1176 20.5044 17.8848 20.7049C17.6171 20.9355 17.261 21.0841 16.6178 21.165C15.9538 21.2486 15.0849 21.25 13.833 21.25H10.1673C8.91538 21.25 8.04651 21.2486 7.38247 21.165C6.73934 21.0841 6.38321 20.9355 6.11546 20.7049C5.88266 20.5044 5.70127 20.2287 5.54256 19.75H6.99527ZM15.7131 18.25H18.1895L16.9018 16.9623L15.7131 18.25ZM19.0007 16.9399C19.0087 16.8869 19.0168 16.8332 19.0249 16.7788L19.404 14.2515L17.92 15.8592L19.0007 16.9399ZM19.856 11.2381L20.2249 8.77879C20.3197 8.14673 20.4033 7.5881 20.4704 7.09045L18.16 9.40079L19.856 11.2381ZM18.6895 6.75H15.7131L17.1418 8.2977L18.6895 6.75ZM12.2532 6.75H8.81081L10.5761 8.51531L12.2532 6.75ZM11.6895 18.25H9.31081L10.5002 17.0607L11.6895 18.25ZM7.40946 11.8486L4.81081 9.25L7.00015 7.06066L9.54266 9.60317L7.40946 11.8486ZM8.47047 12.9097L10.6037 10.6642L12.6895 12.75L10.5002 14.9393L8.47047 12.9097ZM11.5608 16L13.7502 13.8107L15.8403 15.9008L13.7385 18.1777L11.5608 16ZM14.8108 12.75L16.8585 14.7977L18.9795 12.5L17.0985 10.4623L14.8108 12.75ZM13.7502 11.6893L16.0803 9.35921L13.9923 7.09721L11.6371 9.57632L13.7502 11.6893ZM7.437 13.9975L9.43949 16L7.27782 18.1617L5.50363 16.0326L7.437 13.9975Z"
            fill="currentColor"
        />
    </svg>
);

interface PetDetailsModalProps {
    pet: Pet | null;
    onClose: () => void;
    onEdit: (pet: Pet) => void;
    onDeleted: () => void;
}

const PetDetailsModal = ({
    pet,
    onClose,
    onEdit,
    onDeleted,
}: PetDetailsModalProps) => {
    const modal = useRef<HTMLIonModalElement>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState("");

    const handleDelete = async () => {
        if (
            !pet ||
            deleting ||
            !window.confirm(
                `Delete ${pet.name}'s record? This action cannot be undone.`,
            )
        ) {
            return;
        }

        setDeleting(true);
        setDeleteError("");
        try {
            await deletePet(pet);
            await modal.current?.dismiss(undefined, "deleted");
        } catch (error) {
            setDeleteError(getPetDataErrorMessage(error, "deleted"));
            setDeleting(false);
        }
    };

    const handleDismiss = (role?: string) => {
        setDeleting(false);
        setDeleteError("");

        if (role === "deleted") {
            onDeleted();
        } else {
            onClose();
        }
    };

    return (
        <IonModal
            ref={modal}
            isOpen={Boolean(pet)}
            canDismiss={async (_data, role) =>
                role === "deleted" || !deleting
            }
            onDidDismiss={(event) => handleDismiss(event.detail.role)}
            className="items-end [--width:min(100%,620px)] [--height:min(92%,800px)] [--border-radius:22px_22px_0_0] min-[700px]:items-center min-[700px]:[--border-radius:22px] [&::part(content)]:shadow-[0_-20px_55px_rgb(8_6_78/35%)]"
        >
            <IonContent className="[--background:#f7f7fb] [--color:#11112a]">
                {pet && (
                    <div className="mx-auto min-h-full w-full max-w-140 px-5 pt-6 pb-[calc(28px+env(safe-area-inset-bottom))]">
                        <div className="mb-5 flex items-start justify-between gap-4">
                            <h2 className="mt-0.5 text-[27px] leading-[1.2] font-bold text-[#1912d1]">
                                {pet.name}
                            </h2>
                            <button
                                type="button"
                                className="grid size-11 shrink-0 cursor-pointer place-items-center border-0 bg-transparent p-0 text-[26px] text-[#1912d1] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#ffcf40] disabled:opacity-50"
                                aria-label="Close details"
                                disabled={deleting}
                                onClick={() => modal.current?.dismiss()}
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
                            {pet.updatedAt && (
                                <div>
                                    <dt>Updated</dt>
                                    <dd>{pet.updatedAt.toLocaleDateString()}</dd>
                                </div>
                            )}
                        </dl>

                        {deleteError && (
                            <p
                                className="mt-3 rounded-[9px] bg-[#fee9e7] px-3 py-2 text-[10px] leading-[1.45] text-[#842018]"
                                role="alert"
                            >
                                {deleteError}
                            </p>
                        )}

                        <div className="mt-4 grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-[11px] border border-[#1912d1] bg-white px-4 text-xs font-bold text-[#1912d1] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#ffcf40] disabled:opacity-50"
                                disabled={deleting}
                                onClick={() => onEdit(pet)}
                            >
                                <EditIcon /> Edit
                            </button>
                            <button
                                type="button"
                                className="inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-[11px] border-0 bg-[#b42318] px-4 text-xs font-bold text-white focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#ffcf40] disabled:cursor-wait disabled:opacity-65"
                                disabled={deleting}
                                onClick={handleDelete}
                            >
                                {deleting ? (
                                    <IonSpinner className="size-4" name="crescent" />
                                ) : (
                                    <DeleteIcon />
                                )}
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                )}
            </IonContent>
        </IonModal>
    );
};

export default PetDetailsModal;
