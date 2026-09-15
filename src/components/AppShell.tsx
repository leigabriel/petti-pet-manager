import { IonContent, IonPage } from "@ionic/react";
import type { ReactNode } from "react";
import AppHeader from "./AppHeader";
import FloatingDock from "./FloatingDock";

interface AppShellProps {
    title: string;
    children: ReactNode;
}

const AppShell = ({ title, children }: AppShellProps) => (
    <IonPage className="[--background:#fff] text-[#11112a]">
        <AppHeader title={title} />
        <IonContent
            fullscreen
            className="[--background:#fff] [--color:#11112a]"
        >
            <main className="mx-auto min-h-full w-full max-w-190 px-5 pt-[calc(78px+env(safe-area-inset-top))] pb-[calc(106px+env(safe-area-inset-bottom))] [@media(max-height:650px)]:pt-[calc(70px+env(safe-area-inset-top))]">
                {children}
            </main>
        </IonContent>
        <FloatingDock />
    </IonPage>
);

export default AppShell;
