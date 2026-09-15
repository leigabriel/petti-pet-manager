export interface PetInput {
    name: string;
    animalType: string;
    breed: string;
    age: number;
    ownerName: string;
    notes: string;
}

export interface Pet extends PetInput {
    id: string;
    createdAt: Date | null;
    updatedAt: Date | null;
}
