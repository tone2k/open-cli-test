export const formatWeatherHtml = (weatherData) => {
  return `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 20vh; font-family: Arial, sans-serif;">
        <div style="background-color: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-radius: 24px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 400px; width: 100%;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
            <div>
              <h2 style="font-size: 24px; font-weight: bold; color: white; margin: 0 0 4px 0;">${weatherData.location.name}</h2>
              <p style="font-size: 14px; color: rgba(255, 255, 255, 0.8); margin: 0;">${weatherData.location.country}</p>
            </div>
            <p style="font-size: 14px; color: rgba(255, 255, 255, 0.8);">${weatherData.location.localtime}</p>
          </div>
  
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px;">
            <div style="width: 64px; height: 64px; color: white;">
              <img src="${weatherData.current.condition.icon}" alt="${weatherData.current.condition.text}" style="width: 100%; height: 100%;">
            </div>
            <div style="text-align: right;">
              <h1 style="font-size: 48px; font-weight: bold; color: white; margin: 0;">${weatherData.current.temp_c}°C</h1>
              <p style="font-size: 18px; color: rgba(255, 255, 255, 0.8); margin: 0;">${weatherData.current.condition.text}</p>
            </div>
          </div>
  
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <div style="background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 16px; display: flex; align-items: center;">
              <div style="width: 24px; height: 24px; color: rgba(255, 255, 255, 0.8); margin-right: 12px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
                  <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
                  <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
                </svg>
              </div>
              <div>
                <p style="font-size: 14px; color: rgba(255, 255, 255, 0.8); margin: 0 0 4px 0;">Wind</p>
                <p style="font-size: 16px; font-weight: bold; color: white; margin: 0;">${weatherData.current.wind_kph} km/h ${weatherData.current.wind_dir}</p>
              </div>
            </div>
  
            <div style="background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 16px; display: flex; align-items: center;">
              <div style="width: 24px; height: 24px; color: rgba(255, 255, 255, 0.8); margin-right: 12px;">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7.29 6.75 7 5.3c-.29 1.45-1.14 2.84-2.29 3.76S3 11.1 3 12.25c0 2.22 1.8 4.05 4 4.05z"/>
                  <path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.1c.5 2.5 2.04 4.58 4.18 5.65C20.32 9.82 22 12.06 22 14.6c0 3.5-2.98 6.3-6.66 6.3-3.68 0-6.67-2.8-6.67-6.3 0-2.53 1.68-4.78 3.9-5.85"/>
                </svg>
              </div>
              <div>
                <p style="font-size: 14px; color: rgba(255, 255, 255, 0.8); margin: 0 0 4px 0;">Humidity</p>
                <p style="font-size: 16px; font-weight: bold; color: white; margin: 0;">${weatherData.current.humidity}%</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
};
