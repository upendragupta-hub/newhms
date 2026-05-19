const DOCTOR_TOKEN_KEY = "doctorToken";
const DOCTOR_PROFILE_KEY = "doctorProfile";
export const doctorAuthEvent = "doctor-auth-changed";

export const getDoctorToken = () => localStorage.getItem(DOCTOR_TOKEN_KEY);

export const getStoredDoctor = () => {
    const rawValue = localStorage.getItem(DOCTOR_PROFILE_KEY);

    if (!rawValue) {
        return null;
    }

    try {
        return JSON.parse(rawValue);
    } catch (error) {
        localStorage.removeItem(DOCTOR_PROFILE_KEY);
        return null;
    }
};

export const setDoctorSession = ({ token, doctor }) => {
    if (token) {
        localStorage.setItem(DOCTOR_TOKEN_KEY, token);
    }

    if (doctor) {
        localStorage.setItem(DOCTOR_PROFILE_KEY, JSON.stringify(doctor));
    }

    window.dispatchEvent(new Event(doctorAuthEvent));
};

export const clearDoctorSession = () => {
    localStorage.removeItem(DOCTOR_TOKEN_KEY);
    localStorage.removeItem(DOCTOR_PROFILE_KEY);
    window.dispatchEvent(new Event(doctorAuthEvent));
};

export const getDoctorAuthHeaders = () => {
    const token = getDoctorToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};
