import { IonPage, IonContent } from "@ionic/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
    const navigate = useNavigate();
    const [showIntro, setShowIntro] = useState(true);
    const [contentReady, setContentReady] = useState(false);

    useEffect(() => {
        const t1 = setTimeout(() => setShowIntro(false), 2200);
        const t2 = setTimeout(() => setContentReady(true), 2300);
        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
        };
    }, []);

    return (
        <IonPage>
            <IonContent
                fullscreen
                scrollY={false}
                className="[--background:#1912d1] [&::part(scroll)]:flex [&::part(scroll)]:items-center [&::part(scroll)]:justify-center"
            >
                <div className="relative w-full h-dvh bg-[#1912d1] overflow-hidden flex flex-col justify-between text-white">
                    {/* Intro splash */}
                    {showIntro && (
                        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white">
                            <img
                                src="images/petti-home.png"
                                alt="Petti"
                                className="w-28 rounded-full"
                                style={{
                                    animation: "fadeIn 0.6s ease-out forwards",
                                }}
                            />
                            <p
                                className="mt-4 font-[Mistral,Brush_Script_MT,cursive] text-[42px] leading-none text-[#1912d1]"
                                style={{
                                    animation:
                                        "fadeIn 0.6s ease-out 0.3s forwards",
                                    opacity: 0,
                                }}
                            >
                                Petti
                            </p>
                        </div>
                    )}

                    {/* Original content */}
                    <div
                        className={`w-full pt-10 transition-opacity duration-700 ${contentReady ? "opacity-100" : "opacity-0"}`}
                    />
                    <main
                        className={`flex-1 flex flex-col justify-center items-center px-8 py-4 text-center tracking-[-0.015em] transition-opacity duration-700 ${contentReady ? "opacity-100" : "opacity-0"}`}
                    >
                        <div className="space-y-6 max-w-100">
                            <p className="text-[50px] font-[Mistral,Brush_Script_MT,cursive] text-white font-medium tracking-tight leading-snug">
                                Welcome back, Lei.
                            </p>
                            <img
                                src="/images/petti.png"
                                alt="Petti pets"
                                className="w-full max-w-70 mx-auto"
                            />
                            <p className="text-[14px] leading-[1.65] text-white/90 font-normal">
                                Store your pet's name, animal type, breed, age,
                                owner name, and important notes all in one
                                place.
                            </p>
                        </div>
                    </main>
                    <footer
                        className={`w-full px-8 pb-10 pt-2 flex flex-col items-center justify-center transition-opacity duration-700 ${contentReady ? "opacity-100" : "opacity-0"}`}
                    >
                        <button
                            type="button"
                            aria-label="Continue"
                            onClick={() => navigate("/home")}
                            className="flex h-16 w-16 cursor-pointer items-center justify-center rounded-xl! bg-white text-2xl font-medium text-[#1912d1] shadow-xl shadow-black/25 transition-all duration-150 hover:bg-neutral-100 active:scale-95 active:brightness-90 focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#ffcf40]"
                        >
                            <span className="inline-flex items-center justify-center transition-transform duration-150">
                                <svg
                                    className="w-6 h-6 text-[#1912d1]"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M5 12h14M13 5l7 7-7 7" />
                                </svg>
                            </span>
                        </button>
                    </footer>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default Welcome;
