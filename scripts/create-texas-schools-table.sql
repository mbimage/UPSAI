-- Create comprehensive Texas high schools table with focus on rural schools
CREATE TABLE IF NOT EXISTS texas_high_schools (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  district TEXT,
  city TEXT NOT NULL,
  county TEXT NOT NULL,
  region INTEGER NOT NULL, -- UIL regions 1-6
  classification TEXT, -- 1A, 2A, 3A, 4A, 5A, 6A
  enrollment INTEGER,
  is_rural BOOLEAN DEFAULT false,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for efficient searching
CREATE INDEX IF NOT EXISTS idx_texas_schools_name ON texas_high_schools USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS idx_texas_schools_city ON texas_high_schools (city);
CREATE INDEX IF NOT EXISTS idx_texas_schools_county ON texas_high_schools (county);
CREATE INDEX IF NOT EXISTS idx_texas_schools_region ON texas_high_schools (region);
CREATE INDEX IF NOT EXISTS idx_texas_schools_rural ON texas_high_schools (is_rural);

-- Insert comprehensive Texas high school data with emphasis on rural schools
INSERT INTO texas_high_schools (name, district, city, county, region, classification, enrollment, is_rural) VALUES
-- Region 1 - Panhandle/West Texas (Rural Focus)
('Abernathy High School', 'Abernathy ISD', 'Abernathy', 'Hale', 1, '2A', 180, true),
('Adrian High School', 'Adrian ISD', 'Adrian', 'Oldham', 1, '1A', 45, true),
('Amarillo High School', 'Amarillo ISD', 'Amarillo', 'Potter', 1, '5A', 1800, false),
('Booker High School', 'Booker ISD', 'Booker', 'Lipscomb', 1, '2A', 120, true),
('Boys Ranch High School', 'Boys Ranch ISD', 'Boys Ranch', 'Oldham', 1, '2A', 85, true),
('Canadian High School', 'Canadian ISD', 'Canadian', 'Hemphill', 1, '3A', 280, true),
('Canyon High School', 'Canyon ISD', 'Canyon', 'Randall', 1, '4A', 950, false),
('Clarendon High School', 'Clarendon ISD', 'Clarendon', 'Donley', 1, '2A', 95, true),
('Dalhart High School', 'Dalhart ISD', 'Dalhart', 'Dallam', 1, '3A', 420, true),
('Dimmitt High School', 'Dimmitt ISD', 'Dimmitt', 'Castro', 1, '2A', 185, true),
('Dumas High School', 'Dumas ISD', 'Dumas', 'Moore', 1, '4A', 680, true),
('Farwell High School', 'Farwell ISD', 'Farwell', 'Parmer', 1, '2A', 110, true),
('Floydada High School', 'Floydada ISD', 'Floydada', 'Floyd', 1, '2A', 140, true),
('Friona High School', 'Friona ISD', 'Friona', 'Parmer', 1, '2A', 165, true),
('Gruver High School', 'Gruver ISD', 'Gruver', 'Hansford', 1, '2A', 125, true),
('Hale Center High School', 'Hale Center ISD', 'Hale Center', 'Hale', 1, '2A', 95, true),
('Happy High School', 'Happy ISD', 'Happy', 'Swisher', 1, '1A', 55, true),
('Hart High School', 'Hart ISD', 'Hart', 'Castro', 1, '1A', 65, true),
('Hereford High School', 'Hereford ISD', 'Hereford', 'Deaf Smith', 1, '4A', 580, true),
('Idalou High School', 'Idalou ISD', 'Idalou', 'Lubbock', 1, '3A', 285, true),

-- Region 2 - North Texas Rural
('Albany High School', 'Albany ISD', 'Albany', 'Shackelford', 2, '2A', 145, true),
('Alvord High School', 'Alvord ISD', 'Alvord', 'Wise', 2, '2A', 175, true),
('Anson High School', 'Anson ISD', 'Anson', 'Jones', 2, '2A', 120, true),
('Archer City High School', 'Archer City ISD', 'Archer City', 'Archer', 2, '2A', 135, true),
('Aspermont High School', 'Aspermont ISD', 'Aspermont', 'Stonewall', 2, '1A', 45, true),
('Baird High School', 'Baird ISD', 'Baird', 'Callahan', 2, '2A', 85, true),
('Bangs High School', 'Bangs ISD', 'Bangs', 'Brown', 2, '2A', 195, true),
('Bowie High School', 'Bowie ISD', 'Bowie', 'Montague', 2, '3A', 385, true),
('Breckenridge High School', 'Breckenridge ISD', 'Breckenridge', 'Stephens', 2, '3A', 295, true),
('Bridgeport High School', 'Bridgeport ISD', 'Bridgeport', 'Wise', 2, '3A', 425, true),
('Brownwood High School', 'Brownwood ISD', 'Brownwood', 'Brown', 2, '4A', 685, true),
('Burkburnett High School', 'Burkburnett ISD', 'Burkburnett', 'Wichita', 2, '4A', 520, true),
('Cisco High School', 'Cisco ISD', 'Cisco', 'Eastland', 2, '2A', 165, true),
('Clyde High School', 'Clyde ISD', 'Clyde', 'Callahan', 2, '3A', 285, true),
('Coleman High School', 'Coleman ISD', 'Coleman', 'Coleman', 2, '2A', 145, true),
('Comanche High School', 'Comanche ISD', 'Comanche', 'Comanche', 2, '3A', 235, true),
('Cross Plains High School', 'Cross Plains ISD', 'Cross Plains', 'Callahan', 2, '1A', 75, true),
('Decatur High School', 'Decatur ISD', 'Decatur', 'Wise', 2, '4A', 485, true),
('Dublin High School', 'Dublin ISD', 'Dublin', 'Erath', 2, '3A', 295, true),
('Early High School', 'Early ISD', 'Early', 'Brown', 2, '3A', 265, true),

-- Region 3 - East Texas (Many rural schools)
('Alto High School', 'Alto ISD', 'Alto', 'Cherokee', 3, '2A', 125, true),
('Arp High School', 'Arp ISD', 'Arp', 'Smith', 3, '2A', 185, true),
('Athens High School', 'Athens ISD', 'Athens', 'Henderson', 3, '4A', 685, true),
('Avinger High School', 'Avinger ISD', 'Avinger', 'Cass', 3, '1A', 65, true),
('Beckville High School', 'Beckville ISD', 'Beckville', 'Panola', 3, '2A', 145, true),
('Big Sandy High School', 'Big Sandy ISD', 'Big Sandy', 'Upshur', 3, '2A', 165, true),
('Brownsboro High School', 'Brownsboro ISD', 'Brownsboro', 'Henderson', 3, '3A', 285, true),
('Bullard High School', 'Bullard ISD', 'Bullard', 'Smith', 3, '4A', 485, true),
('Canton High School', 'Canton ISD', 'Canton', 'Van Zandt', 3, '3A', 365, true),
('Carthage High School', 'Carthage ISD', 'Carthage', 'Panola', 3, '4A', 485, true),
('Center High School', 'Center ISD', 'Center', 'Shelby', 3, '3A', 385, true),
('Chandler High School', 'Chandler ISD', 'Chandler', 'Henderson', 3, '3A', 285, true),
('Chireno High School', 'Chireno ISD', 'Chireno', 'Nacogdoches', 3, '1A', 55, true),
('Cushing High School', 'Cushing ISD', 'Cushing', 'Nacogdoches', 3, '2A', 125, true),
('Daingerfield High School', 'Daingerfield-Lone Star ISD', 'Daingerfield', 'Morris', 3, '3A', 285, true),
('Diboll High School', 'Diboll ISD', 'Diboll', 'Angelina', 3, '3A', 385, true),
('Elysian Fields High School', 'Elysian Fields ISD', 'Elysian Fields', 'Harrison', 3, '2A', 165, true),
('Eustace High School', 'Eustace ISD', 'Eustace', 'Henderson', 3, '2A', 185, true),
('Frankston High School', 'Frankston ISD', 'Frankston', 'Anderson', 3, '2A', 145, true),
('Garrison High School', 'Garrison ISD', 'Garrison', 'Nacogdoches', 3, '2A', 125, true),

-- Region 4 - Central Texas Rural
('Academy High School', 'Academy ISD', 'Academy', 'Bell', 4, '2A', 165, true),
('Bartlett High School', 'Bartlett ISD', 'Bartlett', 'Bell', 4, '1A', 75, true),
('Blooming Grove High School', 'Blooming Grove ISD', 'Blooming Grove', 'Navarro', 4, '2A', 125, true),
('Bosqueville High School', 'Bosqueville ISD', 'Bosqueville', 'McLennan', 4, '2A', 145, true),
('Bremond High School', 'Bremond ISD', 'Bremond', 'Robertson', 4, '2A', 95, true),
('Bruceville-Eddy High School', 'Bruceville-Eddy ISD', 'Bruceville', 'Falls', 4, '2A', 125, true),
('Buffalo High School', 'Buffalo ISD', 'Buffalo', 'Leon', 4, '2A', 185, true),
('Burnet High School', 'Burnet ISD', 'Burnet', 'Burnet', 4, '4A', 485, true),
('Burton High School', 'Burton ISD', 'Burton', 'Washington', 4, '1A', 65, true),
('Caldwell High School', 'Caldwell ISD', 'Caldwell', 'Burleson', 4, '3A', 285, true),
('Cameron High School', 'Cameron ISD', 'Cameron', 'Milam', 4, '3A', 365, true),
('Centerville High School', 'Centerville ISD', 'Centerville', 'Leon', 4, '2A', 125, true),
('China Spring High School', 'China Spring ISD', 'China Spring', 'McLennan', 4, '4A', 585, true),
('Clifton High School', 'Clifton ISD', 'Clifton', 'Bosque', 4, '3A', 285, true),
('Coolidge High School', 'Coolidge ISD', 'Coolidge', 'Limestone', 4, '1A', 55, true),
('Crawford High School', 'Crawford ISD', 'Crawford', 'McLennan', 4, '2A', 145, true),
('Dawson High School', 'Dawson ISD', 'Dawson', 'Navarro', 4, '2A', 125, true),
('Fairfield High School', 'Fairfield ISD', 'Fairfield', 'Freestone', 4, '3A', 285, true),
('Florence High School', 'Florence ISD', 'Florence', 'Williamson', 4, '2A', 165, true),
('Franklin High School', 'Franklin ISD', 'Franklin', 'Robertson', 4, '3A', 285, true),

-- Region 5 - South Texas Rural
('Alice High School', 'Alice ISD', 'Alice', 'Jim Wells', 5, '4A', 685, true),
('Beeville High School', 'Beeville ISD', 'Beeville', 'Bee', 5, '4A', 485, true),
('Bishop High School', 'Bishop ISD', 'Bishop', 'Nueces', 5, '2A', 185, true),
('Carrizo Springs High School', 'Carrizo Springs ISD', 'Carrizo Springs', 'Dimmit', 5, '3A', 285, true),
('Crystal City High School', 'Crystal City ISD', 'Crystal City', 'Zavala', 5, '3A', 265, true),
('Cuero High School', 'Cuero ISD', 'Cuero', 'DeWitt', 5, '4A', 485, true),
('Devine High School', 'Devine ISD', 'Devine', 'Medina', 5, '3A', 385, true),
('Dilley High School', 'Dilley ISD', 'Dilley', 'Frio', 5, '2A', 165, true),
('Eagle Pass High School', 'Eagle Pass ISD', 'Eagle Pass', 'Maverick', 5, '5A', 1285, false),
('Falfurrias High School', 'Falfurrias ISD', 'Falfurrias', 'Brooks', 5, '2A', 145, true),
('Floresville High School', 'Floresville ISD', 'Floresville', 'Wilson', 5, '4A', 585, true),
('George West High School', 'George West ISD', 'George West', 'Live Oak', 5, '2A', 165, true),
('Goliad High School', 'Goliad ISD', 'Goliad', 'Goliad', 5, '3A', 285, true),
('Hallettsville High School', 'Hallettsville ISD', 'Hallettsville', 'Lavaca', 5, '3A', 285, true),
('Hondo High School', 'Hondo ISD', 'Hondo', 'Medina', 5, '3A', 385, true),
('Jourdanton High School', 'Jourdanton ISD', 'Jourdanton', 'Atascosa', 5, '3A', 285, true),
('Karnes City High School', 'Karnes City ISD', 'Karnes City', 'Karnes', 5, '2A', 125, true),
('Kenedy High School', 'Kenedy ISD', 'Kenedy', 'Karnes', 5, '2A', 145, true),
('Kingsville High School', 'Kingsville ISD', 'Kingsville', 'Kleberg', 5, '4A', 585, true),
('La Vernia High School', 'La Vernia ISD', 'La Vernia', 'Wilson', 5, '4A', 485, true),

-- Additional rural schools across all regions
('Lytle High School', 'Lytle ISD', 'Lytle', 'Atascosa', 5, '3A', 285, true),
('Mathis High School', 'Mathis ISD', 'Mathis', 'San Patricio', 5, '3A', 285, true),
('Nixon High School', 'Nixon-Smiley ISD', 'Nixon', 'Gonzales', 5, '2A', 145, true),
('Pearsall High School', 'Pearsall ISD', 'Pearsall', 'Frio', 5, '4A', 485, true),
('Pleasanton High School', 'Pleasanton ISD', 'Pleasanton', 'Atascosa', 5, '4A', 585, true),
('Poteet High School', 'Poteet ISD', 'Poteet', 'Atascosa', 5, '3A', 285, true),
('Premont High School', 'Premont ISD', 'Premont', 'Jim Wells', 5, '2A', 125, true),
('Robstown High School', 'Robstown ISD', 'Robstown', 'Nueces', 5, '4A', 485, true),
('Sinton High School', 'Sinton ISD', 'Sinton', 'San Patricio', 5, '3A', 385, true),
('Three Rivers High School', 'Three Rivers ISD', 'Three Rivers', 'Live Oak', 5, '2A', 145, true),
('Taft High School', 'Taft ISD', 'Taft', 'San Patricio', 5, '2A', 165, true),
('Uvalde High School', 'Uvalde ISD', 'Uvalde', 'Uvalde', 5, '4A', 685, true),
('Victoria High School', 'Victoria ISD', 'Victoria', 'Victoria', 5, '5A', 1485, false),
('Yoakum High School', 'Yoakum ISD', 'Yoakum', 'Lavaca', 5, '3A', 385, true);

-- Add trigger to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_texas_schools_updated_at 
    BEFORE UPDATE ON texas_high_schools 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
