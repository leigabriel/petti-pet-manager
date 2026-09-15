import { signInAnonymously } from "firebase/auth";
import {
    onValue,
    orderByChild,
    push,
    query,
    ref,
    remove,
    serverTimestamp,
    set,
    update,
    type DataSnapshot,
    type Unsubscribe,
} from "firebase/database";
import { auth, db } from "../lib/firebase";
import type { Pet, PetInput } from "../types/pet";

let authentication: Promise<string> | null = null;

export const getPetDataErrorMessage = (
    error: unknown,
    action: "saved" | "loaded" | "updated" | "deleted",
) => {
    const code =
        typeof error === "object" && error && "code" in error
            ? String(error.code).toLowerCase().replaceAll("_", "-")
            : "";

    if (code.includes("permission-denied")) {
        return "Realtime Database denied access. Publish database.rules.json in Firebase Console.";
    }

    if (
        code.includes("configuration-not-found") ||
        code.includes("operation-not-allowed")
    ) {
        return "Anonymous Authentication is not enabled for this Firebase project.";
    }

    if (
        code.includes("network-request-failed") ||
        code.includes("network-error")
    ) {
        return `Pet could not be ${action}. Check your connection and try again.`;
    }

    return `Pet could not be ${action}. Firebase error${code ? `: ${code}` : "."}`;
};

const requireUser = () => {
    if (auth.currentUser) {
        return Promise.resolve(auth.currentUser.uid);
    }

    authentication ??= signInAnonymously(auth)
        .then(({ user }) => user.uid)
        .catch((error) => {
            authentication = null;
            throw error;
        });

    return authentication;
};

const toPet = (snapshot: DataSnapshot): Pet => {
    const data = snapshot.val() as PetInput & {
        createdAt?: number;
        updatedAt?: number;
    };

    return {
        id: snapshot.key!,
        name: data.name,
        animalType: data.animalType,
        breed: data.breed,
        age: data.age,
        ownerName: data.ownerName,
        notes: data.notes,
        createdAt: data.createdAt ? new Date(data.createdAt) : null,
        updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
    };
};

export const savePet = async (pet: PetInput) => {
    const uid = await requireUser();
    const petReference = push(ref(db, `users/${uid}/pets`));

    await set(petReference, {
        ...pet,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
};

export const updatePet = async (pet: Pet, values: PetInput) => {
    const uid = await requireUser();
    await update(ref(db, `users/${uid}/pets/${pet.id}`), {
        ...values,
        updatedAt: serverTimestamp(),
    });
};

export const deletePet = async (pet: Pet) => {
    const uid = await requireUser();
    await remove(ref(db, `users/${uid}/pets/${pet.id}`));
};

export const subscribeToPets = async (
    onPets: (pets: Pet[]) => void,
    onError: (error: Error) => void,
): Promise<Unsubscribe> => {
    const uid = await requireUser();
    const petsQuery = query(
        ref(db, `users/${uid}/pets`),
        orderByChild("createdAt"),
    );

    return onValue(
        petsQuery,
        (snapshot) => {
            const pets: Pet[] = [];
            snapshot.forEach((child) => {
                pets.push(toPet(child));
            });
            onPets(pets.reverse());
        },
        onError,
    );
};
