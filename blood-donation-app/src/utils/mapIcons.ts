import L from 'leaflet';

const createCustomIcon = (iconName: string, color: string) => {
    return L.divIcon({
        className: 'custom-div-icon',
        html: `
            <div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; justify-content: center; align-items: center;">
                <span class="material-icons" style="color: white; font-size: 18px;">${iconName}</span>
            </div>
        `,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15],
    });
};

export const donorIcon = createCustomIcon('person', '#2196f3');
export const hospitalIcon = createCustomIcon('hospital', '#4caf50');
export const bloodBankIcon = createCustomIcon('bloodtype', '#f44336');
export const requestIcon = createCustomIcon('error', '#ff9800'); 