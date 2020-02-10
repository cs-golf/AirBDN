To do:
* github page
    * Add a github project description here
    * migrate the project to open source (after we pretty up this page)
* front
    * map page
        * hover over sensor for info box
    * sensor page
        * page for viewing one sensor's values and history and predictions?
        * graphs 
    * raw data download page?
    * about page
        * add text to about page
        * maybe donate button to charity? or donate to fund more sensors     
* back
    * add other sources than luftdaten
    * GraphQl?
    * correction tool
      * humidity correction - this will be added in periodic_update
         * aberdeen weather web scraper - a site still need to be chosen
         * correction algorithm
         
            IF sensor is DHT22 AND has BME280 near THEN
               DHT22 humidity equals BME280 humidity
            ELSEIF sensor is DHT22 THEN
               DHT22 humidity equals web scraped average of Aberdeen
               
      * correction algorithim - this will also be added in periodic_update
         
            float normalizePM25(float pm25, float humidity){
               return pm25/(1.0+0.48756*pow((humidity/100.0), 8.60068));
            }        
            
            float normalizePM10(float pm10, float humidity){
               return pm10/(1.0+0.81559*pow((humidity/100.0), 5.83411));
            }
