export interface CitasVet {
    completadas: any[];
    pendientes:  Pendiente[];
}

export interface Pendiente {
    id:           number;
    veterinaryId: number;
    petId:        number;
    userId:       number;
    date:         Date;
    hourId:       number;
    done:         boolean;
    createdAt:    Date;
    pet:          Pet;
    hour:         Hour;
}

export interface Hour {
    id:           number;
    veterinaryId: number;
    hour:         string;
    day:          string;
}

export interface Pet {
    id:            number;
    ownerId:       number;
    name:          string;
    gender:        string;
    weight:        number;
    height:        string;
    animal:        string;
    age:           number;
    img:           string;
    img_public_id: string;
    createdAt:     Date;
    updatedAt:     Date;
}
