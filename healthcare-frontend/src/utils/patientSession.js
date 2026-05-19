const PATIENT_TOKEN_KEY = "patientToken";
const PATIENT_PROFILE_KEY = "patientProfile";
export const patientAuthEvent = "patient-auth-changed";

export const getPatientToken = () => localStorage.getItem(PATIENT_TOKEN_KEY);

export const getStoredPatient = () => {
    const rawValue = localStorage.getItem(PATIENT_PROFILE_KEY);

    if (!rawValue) {
        return null;
    }

    try {
        return JSON.parse(rawValue);
    } catch (error) {
        localStorage.removeItem(PATIENT_PROFILE_KEY);
        return null;
    }
};

export const setPatientSession = ({ token, patient }) => {
    if (token) {
        localStorage.setItem(PATIENT_TOKEN_KEY, token);
    }

    if (patient) {
        localStorage.setItem(PATIENT_PROFILE_KEY, JSON.stringify(patient));
    }

    window.dispatchEvent(new Event(patientAuthEvent));
};

export const clearPatientSession = () => {
    localStorage.removeItem(PATIENT_TOKEN_KEY);
    localStorage.removeItem(PATIENT_PROFILE_KEY);
    window.dispatchEvent(new Event(patientAuthEvent));
};

export const getPatientAuthHeaders = () => {
    const token = getPatientToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};
