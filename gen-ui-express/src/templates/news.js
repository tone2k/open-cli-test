
  export const formatNewsHtml = (articles) => {
    const randomIndex = Math.floor(Math.random() * articles.length);
  
    const article = articles[randomIndex]; 
    return `
      <div style="display: flex; align-items: center; justify-content: center; min-height: 25vh; font-family: Arial, sans-serif; padding: 20px;">
        <div style="background-color: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-radius: 24px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 400px; width: 100%;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
            <div>
              <h2 style="font-size: 24px; font-weight: bold; color: white; margin: 0 0 4px 0;">${article.title}</h2>
              <p style="font-size: 14px; color: rgba(255, 255, 255, 0.8); margin: 0;">${article.author || 'Unknown Author'}</p>
            </div>
            <p style="font-size: 14px; color: rgba(255, 255, 255, 0.8);">${new Date(article.publishedAt).toLocaleDateString()}</p>
          </div>
  
          <div style="margin-bottom: 32px;">
            <img src="${article.urlToImage}" alt="${article.title}" style="max-width: 100%; border-radius: 12px; margin-bottom: 16px;" />
            <p style="font-size: 16px; color: rgba(255, 255, 255, 0.8); margin: 0 0 16px 0; line-height: 1.5;">${article.description}</p>
            <a href="${article.url}" target="_blank" rel="noopener noreferrer" style="display: inline-block; color: white; text-decoration: none; font-weight: 600; font-size: 14px;">Read more →</a>
          </div>
        </div>
      </div>
    `;
  };
  