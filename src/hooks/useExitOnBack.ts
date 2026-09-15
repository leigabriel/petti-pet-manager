import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { useEffect } from "react";

export function useExitOnBack() {
    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return;

        let handler: { remove: () => void } | undefined;

        App.addListener("backButton", ({ canGoBack }) => {
            if (canGoBack) {
                window.history.back();
            } else {
                void App.exitApp();
            }
        }).then((listener) => {
            handler = listener;
        });

        return () => handler?.remove();
    }, []);
}
