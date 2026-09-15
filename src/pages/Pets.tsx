import { IonIcon, IonSpinner } from "@ionic/react";
import { addOutline, pawOutline, refreshOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import AddPetModal from "../components/AddPetModal";
import AppShell from "../components/AppShell";
import PetDetailsModal from "../components/PetDetailsModal";
import { getPetDataErrorMessage, subscribeToPets } from "../services/pets";
import type { Pet } from "../types/pet";

const Pets = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [editingPet, setEditingPet] = useState<Pet | null>(null);
    const [showAddPet, setShowAddPet] = useState(false);
    const [notice, setNotice] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [retryCount, setRetryCount] = useState(0);

    useEffect(() => {
        let disposed = false;
        let unsubscribe: (() => void) | undefined;

        setLoading(true);
        setError("");

        subscribeToPets(
            (records) => {
                if (disposed) return;
                setPets(records);
                setLoading(false);
            },
            (reason) => {
                if (disposed) return;
                setError(getPetDataErrorMessage(reason, "loaded"));
                setLoading(false);
            },
        )
            .then((stop) => {
                if (disposed) stop();
                else unsubscribe = stop;
            })
            .catch((reason: unknown) => {
                if (disposed) return;
                setError(getPetDataErrorMessage(reason, "loaded"));
                setLoading(false);
            });

        return () => {
            disposed = true;
            unsubscribe?.();
        };
    }, [retryCount]);

    return (
        <AppShell title="Pets">
            <section className="mx-auto w-full max-w-140">
                <div className="my-3.5 mb-6.5 flex items-end justify-between gap-4">
                    <div>
                        <h1 className="mt-1 font-[Mistral,Brush_Script_MT,cursive] text-[clamp(42px,13vw,62px)] leading-[.98] font-normal text-[#1912d1]">
                            Pet Records
                        </h1>
                        <p className="mt-2.5 text-[13px] leading-[1.55] text-[#5f5f75]">
                            Tap a pet to see their complete details.
                        </p>
                    </div>
                    <button
                        type="button"
                        className="mb-1 grid size-12 shrink-0 cursor-pointer place-items-center rounded-full border-0 bg-[#1912d1] text-xl text-white shadow-[0_8px_18px_rgb(25_18_209/20%)] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#ffcf40]"
                        aria-label="Add pet"
                        onClick={() => {
                            setEditingPet(null);
                            setShowAddPet(true);
                        }}
                    >
                        <IonIcon icon={addOutline} />
                    </button>
                </div>

                {loading && (
                    <div
                        className="flex min-h-52.5 flex-col items-center justify-center gap-3 rounded-2xl p-6.5 text-center text-xs leading-[1.55] text-[#5d5d72]"
                        role="status"
                    >
                        <IonSpinner name="crescent" />
                    </div>
                )}

                {!loading && error && (
                    <div
                        className="flex min-h-52.5 flex-col items-center justify-center gap-3 rounded-2xl border border-[#dedeea] bg-[#f7f7fb] p-6.5 text-center text-xs leading-[1.55] text-[#5d5d72]"
                        role="alert"
                    >
                        <p>{error}</p>
                        <button
                            className="inline-flex min-h-11 cursor-pointer items-center gap-1.75 rounded-[9px] border-0 bg-white px-4.25 font-bold text-[#1912d1] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#ffcf40]"
                            type="button"
                            onClick={() => setRetryCount((count) => count + 1)}
                        >
                            <IonIcon icon={refreshOutline} /> Retry
                        </button>
                    </div>
                )}

                {!loading && !error && pets.length === 0 && (
                    <div className="flex min-h-52.5 flex-col items-center justify-center gap-3 rounded-2xl border border-[#dedeea] bg-[#f7f7fb] p-6.5 text-center text-xs leading-[1.55] text-[#5d5d72]">
                        <IonIcon className="text-4xl" icon={pawOutline} />
                        <strong className="text-base text-[#1912d1]">
                            No pets yet
                        </strong>
                        <span>Add your first companion to Petti.</span>
                        <button
                            className="inline-flex min-h-11 cursor-pointer items-center gap-1.75 rounded-[9px] border-0 bg-white px-4.25 font-bold text-[#1912d1] focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#ffcf40]"
                            type="button"
                            onClick={() => setShowAddPet(true)}
                        >
                            Add Pet
                        </button>
                    </div>
                )}

                {!loading && !error && pets.length > 0 && (
                    <div className="grid gap-2.75">
                        {pets.map((pet) => (
                            <button
                                type="button"
                                className="flex min-h-21 w-full cursor-pointer items-center gap-3.25 rounded-[14px] border border-[#e1e1ec] bg-white p-3.25 text-left text-[#1912d1] shadow-[0_10px_22px_rgb(25_18_209/10%)] transition-[transform,filter] duration-150 active:scale-97 active:brightness-94 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#ffcf40]"
                                key={pet.id}
                                onClick={() => setSelectedPet(pet)}
                            >
                                <span className="grid size-11.5 shrink-0 place-items-center rounded-[11px] bg-[#1912d1] text-[22px] text-white">
                                    <IonIcon icon={pawOutline} />
                                </span>
                                <span className="grid min-w-0 gap-1.25">
                                    <strong className="truncate text-[15px]">
                                        {pet.name}
                                    </strong>
                                    <small className="truncate text-[10px] text-[#5d5d72]">
                                        {pet.animalType} · {pet.breed}
                                    </small>
                                </span>
                                <span className="ml-auto shrink-0 text-[10px] text-[#59596f]">
                                    Age {pet.age}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </section>
            {notice && (
                <div
                    className="fixed top-[calc(72px+env(safe-area-inset-top))] left-1/2 z-50 -translate-x-1/2 rounded-[10px] bg-[#1912d1] px-3.5 py-2.5 text-xs whitespace-nowrap text-white shadow-[0_10px_28px_rgb(0_0_0/20%)]"
                    role="status"
                >
                    {notice}
                </div>
            )}
            <AddPetModal
                isOpen={showAddPet}
                pet={editingPet}
                onClose={() => {
                    setShowAddPet(false);
                    setEditingPet(null);
                }}
                onSaved={(action) => {
                    setNotice(action === "updated" ? "Pet updated." : "Pet saved.");
                    window.setTimeout(() => setNotice(""), 3000);
                }}
            />
            <PetDetailsModal
                pet={selectedPet}
                onClose={() => setSelectedPet(null)}
                onEdit={(pet) => {
                    setSelectedPet(null);
                    setEditingPet(pet);
                    setShowAddPet(true);
                }}
                onDeleted={() => {
                    setSelectedPet(null);
                    setNotice("Pet deleted.");
                    window.setTimeout(() => setNotice(""), 3000);
                }}
            />
        </AppShell>
    );
};

export default Pets;
