import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { IonIcon } from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { useNavigate } from "react-router-dom";

interface AppHeaderProps {
    title: string;
}

const AppHeader = ({ title }: AppHeaderProps) => {
    const navigate = useNavigate();

    const handleExit = async () => {
        if (!Capacitor.isNativePlatform()) {
            navigate("/welcome");
            return;
        }

        if (window.confirm("Exit Petti?")) {
            await CapacitorApp.exitApp();
        }
    };

    return (
        <header className="pointer-events-none fixed inset-x-0 top-0 z-20 flex h-[calc(62px+env(safe-area-inset-top))] items-center justify-between bg-transparent px-4.5 pt-[calc(env(safe-area-inset-top)+9px)] pb-2.25 text-[#1912d1]">
            <button
                className="pointer-events-auto grid size-11 cursor-pointer place-items-center border-0 bg-transparent p-0 text-inherit focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#ffcf40]"
                type="button"
                aria-label="Profile"
            >
                <img
                    className="size-10.5 rounded-full border border-[#1912d1] object-cover shadow-[0_7px_18px_rgb(17_17_42/22%)]"
                    src="/images/user-profile.png"
                    alt=""
                />
            </button>
            <span className="sr-only">{title}</span>
            <button
                className="pointer-events-auto grid size-11 cursor-pointer place-items-center border-0 bg-transparent p-0 text-inherit focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-[#ffcf40]"
                type="button"
                aria-label="Exit Petti"
                onClick={handleExit}
            >
                <IonIcon
                    className="text-3xl drop-shadow-[0_3px_5px_rgb(25_18_209/18%)]"
                    icon={closeOutline}
                />
            </button>
        </header>
    );
};

export default AppHeader;
