export interface MapLocation {
    latitude: number;
    longitude: number;
}

export interface Donor {
    id: number;
    name: string;
    blood_type: string;
    latitude: number;
    longitude: number;
    is_available: boolean;
    // distance: number;  // Distance in meters from the user's location
}

export interface Hospital {
    id: number;
    name: string;
    address: string;
    contact_phone: string;
    latitude: number;
    longitude: number;
}

export interface BloodBank {
    id: number;
    name: string;
    address: string;
    contact_phone: string;
    latitude: number;
    longitude: number;
    available_blood_types: string[];
}

export interface BloodRequest {
    id: number;
    hospital_name: string;
    blood_type: string;
    units_needed: number;
    urgency_level: string;
    contact_phone: string;
    latitude: number;
    longitude: number;
}

export interface LocationData {
    latitude: number;
    longitude: number;
    radius: number;  // Radius in kilometers
} 