import { IonIcon } from "@ionic/react";
import { addOutline, listOutline } from "ionicons/icons";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddPetModal from "../components/AddPetModal";
import AppShell from "../components/AppShell";

const Home = () => {
    const navigate = useNavigate();
    const [showAddPet, setShowAddPet] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSaved = () => {
        setSaved(true);
        window.setTimeout(() => setSaved(false), 3000);
    };

    return (
        <AppShell title="Home">
            <section className="flex min-h-[calc(100dvh-184px-env(safe-area-inset-top)-env(safe-area-inset-bottom))] flex-col items-center justify-center text-center">
                <div>
                    <h1 className="m-0 font-[Mistral,Brush_Script_MT,cursive] text-[clamp(42px,13vw,62px)] leading-[.98] font-normal text-[#1912d1] [@media(max-height:650px)]:text-[38px]">
                        Hello Lei!
                    </h1>
                    <p className="mt-2.5 text-[13px] leading-[1.55] text-[#5f5f75] [@media(max-height:650px)]:mt-1.25">
                        Keep the details that matter close to your heart. Add your pets and view them anytime.
                    </p>
                </div>

                <img
                    className="mx-auto my-[clamp(12px,3dvh,28px)] max-h-[min(36dvh,310px)] w-[min(72vw,310px)] object-contain [@media(max-height:650px)]:my-2 [@media(max-height:650px)]:max-h-[24dvh] [@media(max-height:650px)]:w-[min(52vw,190px)]"
                    src="/images/petti-home.png"
                    alt="Petti cat companion"
                />

                <div className="grid w-full max-w-105 grid-cols-2 gap-3">
                    <button
                        type="button"
                        className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border border-[#e2e2ee] bg-[#1912d1] px-2 py-3.5 text-white shadow-[0_12px_25px_rgb(25_18_209/12%)] transition-[transform,filter] duration-150 active:scale-97 active:brightness-94 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#ffcf40] [@media(max-height:650px)]:max-h-30"
                        onClick={() => setShowAddPet(true)}
                    >
                        <IonIcon className="text-[25px]" icon={addOutline} />
                        <span className="text-[13px] font-bold">Add Pet</span>
                    </button>
                    <button
                        type="button"
                        className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-[14px] border border-[#212631]/20 bg-[#ebebeb] px-2 py-3.5 text-[#1912d1] shadow-[0_12px_25px_rgb(25_18_209/12%)] transition-[transform,filter] duration-150 active:scale-97 active:brightness-94 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#ffcf40] [@media(max-height:650px)]:max-h-30"
                        onClick={() => navigate("/pets")}
                    >
                        <IonIcon className="text-[25px]" icon={listOutline} />
                        <span className="text-[13px] font-bold">View Pets</span>
                    </button>
                </div>
            </section>

            {saved && (
                <div
                    className="fixed top-[calc(72px+env(safe-area-inset-top))] left-1/2 z-50 -translate-x-1/2 rounded-[10px] bg-[#1912d1] px-3.5 py-2.5 text-xs whitespace-nowrap text-white shadow-[0_10px_28px_rgb(0_0_0/20%)]"
                    role="status"
                >
                    Pet saved.
                </div>
            )}
            <AddPetModal
                isOpen={showAddPet}
                onClose={() => setShowAddPet(false)}
                onSaved={handleSaved}
            />
        </AppShell>
    );
};

export default Home;
