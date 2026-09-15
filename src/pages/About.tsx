import AppShell from "../components/AppShell";

const About = () => (
    <AppShell title="About">
        <section className="mx-auto grid min-h-[calc(100dvh-184px-env(safe-area-inset-top)-env(safe-area-inset-bottom))] w-full max-w-137.5 place-items-center content-center gap-5.5">
            <img
                className="max-h-[23dvh] w-[min(45vw,180px)] object-contain"
                src="/images/petti.png"
                alt="Petti pets"
            />
            <article className="w-full px-[clamp(4px,4vw,24px)] text-[#11112a]">
                <h1 className="mt-3 mb-5 font-[Mistral,Brush_Script_MT,cursive] text-[clamp(42px,12vw,58px)] leading-[.92] font-normal text-[#1912d1]">
                    About Petti
                </h1>
                <p className="mb-3 text-xs leading-7 text-[#43435b]">
                    Petti keeps the everyday details about your companions
                    together in one calm place.
                </p>
                <p className="mb-3 text-xs leading-7 text-[#43435b]">
                    Names, breeds, ages, owners, and important notes stay
                    organized and easy to find whenever you need them.
                </p>
                <p className="mb-3 text-xs leading-7 text-[#43435b]">
                    Each collection belongs to its own private app session, so
                    your pet records remain yours.
                </p>
            </article>
        </section>
    </AppShell>
);

export default About;
