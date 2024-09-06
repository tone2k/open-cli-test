  export const formatStockHtml = (stockData) => {
    const metaData = stockData["Meta Data"];
    const timeSeries = stockData["Time Series (Daily)"];
    const latestDate = Object.keys(timeSeries)[0]; // Get the latest date
    const latestData = timeSeries[latestDate];
    
    // Calculate price change for display
    const priceChange = (parseFloat(latestData["4. close"]) - parseFloat(latestData["1. open"])).toFixed(2);
    const changePercentage = ((priceChange / parseFloat(latestData["1. open"])) * 100).toFixed(2);
    const changeClass = priceChange >= 0 ? 'change' : 'change negative';
  
    return `
    <div style="display: flex; align-items: center; justify-content: center; min-height: 30vh; font-family: Arial, sans-serif; padding: 20px;">
      <div style="background-color: rgba(255, 255, 255, 0.2); backdrop-filter: blur(10px); border-radius: 24px; padding: 32px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); max-width: 400px; width: 100%;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
          <div>
            <h2 style="font-size: 24px; font-weight: bold; color: white; margin: 0 0 4px 0;">${metaData["2. Symbol"]} Stock</h2>
            <p style="font-size: 14px; color: rgba(255, 255, 255, 0.8); margin: 0;">${metaData["1. Information"]}</p>
          </div>
          <p style="font-size: 14px; color: rgba(255, 255, 255, 0.8);">${latestDate}</p>
        </div>
  
        <div style="margin-bottom: 32px;">
          <h1 class="price" style="font-size: 48px; font-weight: bold; color: white; margin: 0;">$${latestData["4. close"]}</h1>
          <p class="${changeClass}" style="font-size: 18px; color: ${priceChange >= 0 ? '#0a8d48' : '#d64545'}; margin: 0 0 16px 0;">${priceChange >= 0 ? '+' : ''}${priceChange} (${changePercentage}%)</p>
        </div>
  
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div style="background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 16px; display: flex; align-items: center;">
            <div>
              <p style="font-size: 14px; color: rgba(255, 255, 255, 0.8); margin: 0 0 4px 0;">Open</p>
              <p style="font-size: 16px; font-weight: bold; color: white; margin: 0;">$${latestData["1. open"]}</p>
            </div>
          </div>
  
          <div style="background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 16px; display: flex; align-items: center;">
            <div>
              <p style="font-size: 14px; color: rgba(255, 255, 255, 0.8); margin: 0 0 4px 0;">High</p>
              <p style="font-size: 16px; font-weight: bold; color: white; margin: 0;">$${latestData["2. high"]}</p>
            </div>
          </div>
  
          <div style="background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 16px; display: flex; align-items: center;">
            <div>
              <p style="font-size: 14px; color: rgba(255, 255, 255, 0.8); margin: 0 0 4px 0;">Low</p>
              <p style="font-size: 16px; font-weight: bold; color: white; margin: 0;">$${latestData["3. low"]}</p>
            </div>
          </div>
  
          <div style="background-color: rgba(255, 255, 255, 0.2); border-radius: 12px; padding: 16px; display: flex; align-items: center;">
            <div>
              <p style="font-size: 14px; color: rgba(255, 255, 255, 0.8); margin: 0 0 4px 0;">Volume</p>
              <p style="font-size: 16px; font-weight: bold; color: white; margin: 0;">${parseInt(latestData["5. volume"]).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
  };
  