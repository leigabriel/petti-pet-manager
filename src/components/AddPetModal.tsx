import { IonContent, IonIcon, IonModal, IonSpinner } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { useState, type FormEvent } from "react";
import {
    getPetDataErrorMessage,
    savePet,
    updatePet,
} from "../services/pets";
import type { Pet, PetInput } from "../types/pet";

interface AddPetModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSaved: (action: "saved" | "updated") => void;
    pet?: Pet | null;
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

const formFromPet = (pet?: Pet | null): PetForm =>
    pet
        ? {
              name: pet.name,
              animalType: pet.animalType,
              breed: pet.breed,
              age: String(pet.age),
              ownerName: pet.ownerName,
              notes: pet.notes,
          }
        : emptyForm;

const limits: Record<Exclude<PetField, "age">, number> = {
    name: 80,
    animalType: 60,
    breed: 80,
    ownerName: 80,
    notes: 1000,
};

const AddPetModal = ({ isOpen, onClose, onSaved, pet }: AddPetModalProps) => {
    const [form, setForm] = useState<PetForm>(emptyForm);
    const [errors, setErrors] = useState<Partial<Record<PetField, string>>>({});
    const [saveError, setSaveError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const prepareForm = () => {
        setForm(formFromPet(pet));
        setErrors({});
        setSaveError("");
    };

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
            const values: PetInput = {
                name: form.name.trim(),
                animalType: form.animalType.trim(),
                breed: form.breed.trim(),
                age: Number(form.age),
                ownerName: form.ownerName.trim(),
                notes: form.notes.trim(),
            };
            if (pet) await updatePet(pet, values);
            else await savePet(values);
            setForm(emptyForm);
            setErrors({});
            onSaved(pet ? "updated" : "saved");
            onClose();
        } catch (error) {
            setSaveError(
                getPetDataErrorMessage(error, pet ? "updated" : "saved"),
            );
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
        placeholder?: string,
    ) => (
        <label className="grid min-w-0 gap-1.5 text-[11px] font-bold tracking-[.01em] text-[#414158]">
            <span>{label}</span>
            <input
                className="min-h-12 min-w-0 w-full rounded-[11px] border border-[#d9d9e6] bg-white px-3.5 py-2.5 text-[14px] font-normal text-[#11112a] shadow-[0_1px_2px_rgb(17_17_42/3%)] transition-[border-color,box-shadow,background] placeholder:text-[#9999aa] selection:bg-[#1912d1] selection:text-white hover:border-[#b9b9cb] focus-visible:border-[#1912d1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1912d1] disabled:bg-[#eeeeF4] disabled:opacity-70 aria-invalid:border-[#b42318] aria-invalid:ring-[#b42318]"
                type={type}
                name={field}
                value={form[field]}
                placeholder={placeholder}
                min={type === "number" ? 0 : undefined}
                max={type === "number" ? 200 : undefined}
                inputMode={type === "number" ? "numeric" : undefined}
                maxLength={
                    field === "age"
                        ? undefined
                        : limits[field as keyof typeof limits]
                }
                required
                disabled={submitting}
                aria-invalid={Boolean(errors[field])}
                aria-describedby={errors[field] ? `${field}-error` : undefined}
                onChange={(event) => updateField(field, event.target.value)}
            />
            {errors[field] && (
                <small
                    id={`${field}-error`}
                    className="text-[10px] leading-[1.35] font-normal text-[#b42318]"
                >
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
            onWillPresent={prepareForm}
            className="items-end [--width:min(100%,480px)] [--height:min(92dvh,680px)] [--border-radius:24px_24px_0_0] [--backdrop-opacity:.42] min-[700px]:items-center min-[700px]:[--border-radius:24px] [&::part(content)]:shadow-[0_-20px_55px_rgb(8_6_78/30%)]"
        >
            <IonContent className="[--background:#fff] [--color:#11112a]">
                <div className="flex h-full flex-col overflow-hidden">
                    <div className="shrink-0 border-b border-[#e7e7ef] bg-white px-5 pt-2.5 pb-4 min-[700px]:pt-5">
                        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-[#d6d6e2] min-[700px]:hidden" />
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h2 className="m-0 text-[21px] leading-tight font-bold text-[#1912d1]">
                                    {pet ? "Edit pet" : "Add pet"}
                                </h2>
                                {/* <p className="mt-1 text-[11px] leading-[1.45] text-[#6b6b80]">
                                Create a complete profile for your pet.
                            </p> */}
                            </div>
                            <button
                                type="button"
                                className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-[#f1f1f7] p-0 text-[22px] text-[#313149] transition-colors hover:bg-[#e8e8f1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1912d1] disabled:cursor-wait disabled:opacity-50"
                                aria-label="Close form"
                                disabled={submitting}
                                onClick={close}
                            >
                                <IonIcon icon={closeOutline} />
                            </button>
                        </div>
                    </div>

                    <form
                        noValidate
                        onSubmit={handleSubmit}
                        className="flex min-h-0 flex-1 flex-col overflow-hidden"
                    >
                        <div className="grid min-h-0 flex-1 content-start grid-cols-1 gap-3.5 overflow-y-auto px-4 py-4 min-[400px]:px-5">
                            {input("name", "Pet name", "text", "e.g. Layi")}
                            <div className="grid min-w-0 grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)_minmax(64px,.65fr)] gap-2 min-[400px]:gap-3">
                                {input(
                                    "animalType",
                                    "Animal type",
                                    "text",
                                    "Cat",
                                )}
                                {input("breed", "Breed", "text", "Domestic")}
                                {input("age", "Age", "number", "3")}
                            </div>
                            {input(
                                "ownerName",
                                "Owner name",
                                "text",
                                "Full name of the owner",
                            )}
                            <label className="grid min-w-0 gap-1.5 text-[11px] font-bold tracking-[.01em] text-[#414158]">
                                <span>Note</span>
                                <textarea
                                    className="min-h-23 min-w-0 w-full resize-none rounded-[11px] border border-[#d9d9e6] bg-white px-3.5 py-3 text-[14px] leading-normal font-normal text-[#11112a] shadow-[0_1px_2px_rgb(17_17_42/3%)] transition-[border-color,box-shadow,background] placeholder:text-[#9999aa] selection:bg-[#1912d1] selection:text-white hover:border-[#b9b9cb] focus-visible:border-[#1912d1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1912d1] disabled:bg-[#eeeeF4] disabled:opacity-70 aria-invalid:border-[#b42318] aria-invalid:ring-[#b42318]"
                                    name="notes"
                                    rows={3}
                                    placeholder="Medical needs, routines, or anything important"
                                    maxLength={limits.notes}
                                    value={form.notes}
                                    required
                                    disabled={submitting}
                                    aria-invalid={Boolean(errors.notes)}
                                    aria-describedby={
                                        errors.notes ? "notes-error" : undefined
                                    }
                                    onChange={(event) =>
                                        updateField("notes", event.target.value)
                                    }
                                />
                                {errors.notes && (
                                    <small
                                        id="notes-error"
                                        className="text-[10px] leading-[1.35] font-normal text-[#b42318]"
                                    >
                                        {errors.notes}
                                    </small>
                                )}
                            </label>
                        </div>

                        <div className="shrink-0 border-t border-[#e7e7ef] bg-white px-4 pt-3 pb-[calc(14px+env(safe-area-inset-bottom))] min-[400px]:px-5">
                            {saveError && (
                                <div
                                    className="mb-2.5 flex items-center justify-between gap-2 rounded-[9px] bg-[#fee9e7] px-3 py-2 text-[10px] leading-[1.45] text-[#842018]"
                                    role="alert"
                                >
                                    <span>{saveError}</span>
                                    <button
                                        className="min-h-9 shrink-0 cursor-pointer border-0 bg-transparent px-2 font-bold text-inherit focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#1912d1]"
                                        type="submit"
                                    >
                                        Retry
                                    </button>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="grid min-h-12 w-full cursor-pointer place-items-center rounded-[11px] border-0 bg-[#1912d1] text-[13px] font-bold text-white shadow-[0_8px_18px_rgb(25_18_209/20%)] transition-[transform,filter] duration-150 hover:brightness-105 active:scale-[.99] active:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1912d1] disabled:cursor-wait disabled:opacity-65"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <span className="inline-flex items-center gap-2">
                                        <IonSpinner
                                            className="size-4"
                                            name="crescent"
                                        />
                                        Saving...
                                    </span>
                                ) : (
                                    pet ? "Update pet" : "Save pet"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </IonContent>
        </IonModal>
    );
};

export default AddPetModal;
