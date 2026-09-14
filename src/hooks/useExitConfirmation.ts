import { useEffect, useState } from "react";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";

export function useExitConfirmation() {
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;

        let handler: { remove: () => void } | undefined;

        App.addListener("backButton", ({ canGoBack }) => {
            if (canGoBack) {
                window.history.back();
            } else {
                setShowConfirm(true);
            }
        }).then((h) => {
            handler = h;
        });

        return () => {
            handler?.remove();
        };
    }, []);

    const confirmExit = () => {
        setShowConfirm(false);
        if (Capacitor.isNativePlatform()) {
            App.exitApp();
        }
    };

    const cancelExit = () => {
        setShowConfirm(false);
    };

    return { showConfirm, confirmExit, cancelExit };
}
