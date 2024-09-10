
export const fetchForm = (weatherData) => {
    return `
          <div style="display: flex; align-items: center; justify-content: center; min-height: 30vh; font-family: Arial, sans-serif; padding: 20px;">
        <div style="background-color: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-radius: 24px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 400px; width: 100%;">
          <h2 style="font-size: 24px; font-weight: bold; color: white; margin-bottom: 24px; text-align: center;">Interactive Form</h2>
  
          <form id="interactiveForm" onsubmit="localStorage.setItem('formData', document.querySelector('[name=emailInput]').value); return false;" style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">
            <input class="interactive-input"  id="nameInput" type="text" placeholder="Your Name" class="interactive-input" style="padding: 12px; border-radius: 12px; border: none; background-color: rgba(255, 255, 255, 0.2); color: white; font-size: 14px;"/>
            <input class="interactive-input" name="emailInput"id="emailInput" type="email" placeholder="Your Email" class="interactive-input" style="padding: 12px; border-radius: 12px; border: none; background-color: rgba(255, 255, 255, 0.2); color: white; font-size: 14px;"/>
            <textarea class="interactive-input" id="messageInput" placeholder="Your Message" class="interactive-input" rows="4" style="padding: 12px; border-radius: 12px; border: none; background-color: rgba(255, 255, 255, 0.2); color: white; font-size: 14px;"></textarea>
            <button id="dynamic-button" class="interactive-btn" type="submit" style="padding: 12px; border-radius: 12px; background-color: rgba(0, 123, 255, 0.8); color: white; font-weight: bold; border: none; font-size: 14px;">Submit Form & Store Locally</button>
          </form>
        </div>
      </div>
          `;
};
