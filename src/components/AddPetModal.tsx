import { IonContent, IonIcon, IonModal, IonSpinner } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { useState, type FormEvent } from "react";
import { getPetDataErrorMessage, savePet } from "../services/pets";
import type { PetInput } from "../types/pet";

interface AddPetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved: () => void;
}

type PetForm = Omit<PetInput, "age"> & { age: string };
type PetField = keyof PetForm;

const emptyForm: PetForm = {
    name: "",
    animalType: "",
    breed: "",
    age: "",
    ownerName: "",
    notes: "",
};

const limits: Record<Exclude<PetField, "age">, number> = {
    name: 80,
    animalType: 60,
    breed: 80,
    ownerName: 80,
    notes: 1000,
};

const AddPetModal = ({ isOpen, onClose, onSaved }: AddPetModalProps) => {
    const [form, setForm] = useState<PetForm>(emptyForm);
    const [errors, setErrors] = useState<Partial<Record<PetField, string>>>({});
    const [saveError, setSaveError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const updateField = (field: PetField, value: string) => {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: undefined }));
        setSaveError("");
    };

    const validate = () => {
        const nextErrors: Partial<Record<PetField, string>> = {};

        (Object.keys(form) as PetField[]).forEach((field) => {
            if (!form[field].trim())
                nextErrors[field] = "This field is required.";
        });

        (Object.keys(limits) as Array<keyof typeof limits>).forEach((field) => {
            if (form[field].trim().length > limits[field]) {
                nextErrors[field] = `Use ${limits[field]} characters or fewer.`;
            }
        });

        const age = Number(form.age);
        if (form.age && (!Number.isInteger(age) || age < 0 || age > 200)) {
            nextErrors.age = "Enter a whole age from 0 to 200.";
        }

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!validate() || submitting) return;

        setSubmitting(true);
        setSaveError("");

        try {
            await savePet({
                name: form.name.trim(),
                animalType: form.animalType.trim(),
                breed: form.breed.trim(),
                age: Number(form.age),
                ownerName: form.ownerName.trim(),
                notes: form.notes.trim(),
            });
            setForm(emptyForm);
            setErrors({});
            onSaved();
            onClose();
        } catch (error) {
            setSaveError(getPetDataErrorMessage(error, "saved"));
        } finally {
            setSubmitting(false);
        }
    };

    const close = () => {
        if (!submitting) onClose();
    };

    const input = (
        field: PetField,
        label: string,
        type: "text" | "number" = "text",
    ) => (
        <label className="grid gap-1 text-xs font-bold text-[#313149]">
            <span>{label} *</span>
            <input
                className="min-h-11 w-full rounded-[10px] border border-[#d7d7e4] bg-white px-3 py-2.5 text-[15px] font-normal text-[#11112a] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#ffcf40] aria-invalid:border-[#b42318]"
                type={type}
                value={form[field]}
                min={type === "number" ? 0 : undefined}
                max={type === "number" ? 200 : undefined}
                inputMode={type === "number" ? "numeric" : undefined}
                maxLength={
                    field === "age"
                        ? undefined
                        : limits[field as keyof typeof limits]
                }
                aria-invalid={Boolean(errors[field])}
                onChange={(event) => updateField(field, event.target.value)}
            />
            {errors[field] && (
                <small className="text-[11px] font-normal text-[#b42318]">
                    {errors[field]}
                </small>
            )}
        </label>
    );

    return (
        <IonModal
            isOpen={isOpen}
            canDismiss={!submitting}
            onDidDismiss={close}
            className="items-end [--width:min(100%,420px)] [--height:min(82dvh,640px)] [--border-radius:22px_22px_0_0] min-[700px]:items-center min-[700px]:[--border-radius:22px] [&::part(content)]:shadow-[0_-20px_55px_rgb(8_6_78/35%)]"
        >
            <IonContent className="[--background:#f7f7fb] [--color:#11112a] font-[IoskeleyMono,Space_Mono,Menlo,Monaco,Consolas,monospace]">
                <div className="flex h-full flex-col px-4 pt-4 pb-[calc(20px+env(safe-area-inset-bottom))]">
                    <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                            <h2 className="mt-0.5 text-[22px] leading-[1.2] font-bold text-[#1912d1]">
                                Add a pet
                            </h2>
                        </div>
                        <button
                            type="button"
                            className="grid size-10 shrink-0 cursor-pointer place-items-center border-0 bg-transparent p-0 text-[24px] text-[#1912d1] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#ffcf40]"
                            aria-label="Close form"
                            onClick={close}
                        >
                            <IonIcon icon={closeOutline} />
                        </button>
                    </div>

                    <form
                        noValidate
                        onSubmit={handleSubmit}
                        className="flex flex-1 flex-col gap-2.5 overflow-hidden"
                    >
                        <div className="grid flex-1 grid-cols-1 gap-2.5 overflow-y-auto">
                            {input("name", "Pet name")}
                            {input("animalType", "Animal type")}
                            <div className="grid grid-cols-2 gap-2.5">
                                {input("breed", "Breed")}
                                {input("age", "Age", "number")}
                            </div>
                            {input("ownerName", "Owner name")}
                            <label className="grid gap-1 text-xs font-bold text-[#313149]">
                                <span>Notes *</span>
                                <textarea
                                    className="w-full resize-none rounded-[10px] border border-[#d7d7e4] bg-white px-3 py-2.5 text-[15px] font-normal text-[#11112a] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#ffcf40] aria-invalid:border-[#b42318]"
                                    rows={2}
                                    maxLength={limits.notes}
                                    value={form.notes}
                                    aria-invalid={Boolean(errors.notes)}
                                    onChange={(event) =>
                                        updateField("notes", event.target.value)
                                    }
                                />
                                {errors.notes && (
                                    <small className="text-[11px] font-normal text-[#b42318]">
                                        {errors.notes}
                                    </small>
                                )}
                            </label>
                        </div>

                        {saveError && (
                            <div
                                className="flex items-center justify-between gap-2 rounded-[9px] bg-[#fee9e7] p-2.5 text-[11px] leading-[1.45] text-[#842018]"
                                role="alert"
                            >
                                <span>{saveError}</span>
                                <button
                                    className="min-h-10 min-w-10 cursor-pointer border-0 bg-transparent font-bold text-inherit focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#ffcf40]"
                                    type="submit"
                                >
                                    Retry
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            className="grid min-h-12 shrink-0 cursor-pointer place-items-center rounded-[11px] border-0 bg-[#1912d1] text-[13px] font-bold text-white shadow-[0_9px_20px_rgb(25_18_209/22%)] transition-[transform,filter] duration-150 active:scale-97 active:brightness-94 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#ffcf40] disabled:cursor-wait disabled:opacity-65"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <IonSpinner name="crescent" />
                            ) : (
                                "Save Pet"
                            )}
                        </button>
                    </form>
                </div>
            </IonContent>
        </IonModal>
    );
};

export default AddPetModal;
