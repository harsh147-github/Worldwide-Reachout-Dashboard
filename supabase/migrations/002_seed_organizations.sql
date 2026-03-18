-- ============================================================
-- SEED: Worldwide Organizations for Aero-Structural Engineer
-- Profile: Composites, FEA, MDO, CFD, UAV/eVTOL, Manufacturing
-- ============================================================

INSERT INTO organizations (name, short_name, country, region, city, org_type, website, relevance_tags) VALUES

-- ============================================================
-- JAPAN
-- ============================================================
('Japan Aerospace Exploration Agency', 'JAXA', 'Japan', 'japan', 'Tsukuba', 'national_lab', 'https://www.jaxa.jp', '{composites,structures,uav,cfd,aerospace}'),
('Okinawa Institute of Science and Technology', 'OIST', 'Japan', 'japan', 'Okinawa', 'university', 'https://www.oist.jp', '{cfd,fluid_mechanics,computational}'),
('University of Tokyo - Dept of Aeronautics', 'UTokyo', 'Japan', 'japan', 'Tokyo', 'university', 'https://www.u-tokyo.ac.jp', '{structures,composites,mdo,aerospace}'),
('Tohoku University - Institute of Fluid Science', 'Tohoku IFS', 'Japan', 'japan', 'Sendai', 'university', 'https://www.ifs.tohoku.ac.jp', '{cfd,fluid_mechanics,aerospace}'),
('Mitsubishi Heavy Industries Aerospace', 'MHI', 'Japan', 'japan', 'Nagoya', 'aerospace_company', 'https://www.mhi.com', '{composites,structures,manufacturing,defense}'),
('Kawasaki Heavy Industries Aerospace', 'KHI', 'Japan', 'japan', 'Kobe', 'aerospace_company', 'https://www.khi.co.jp', '{composites,aerospace,manufacturing,defense}'),
('Subaru Aerospace', 'Subaru Aero', 'Japan', 'japan', 'Utsunomiya', 'aerospace_company', 'https://www.subaru.co.jp', '{composites,structures,manufacturing}'),
('IHI Corporation Aero Engine', 'IHI', 'Japan', 'japan', 'Tokyo', 'aerospace_company', 'https://www.ihi.co.jp', '{propulsion,structures,manufacturing}'),
('SkyDrive Inc', 'SkyDrive', 'Japan', 'japan', 'Toyota City', 'evtol_startup', 'https://en.skydrive2020.com', '{evtol,structures,composites,uav}'),
('Nagoya University - Aerospace Engineering', 'Nagoya', 'Japan', 'japan', 'Nagoya', 'university', 'https://www.nagoya-u.ac.jp', '{composites,structures,cfd,aerospace}'),
('National Institute for Materials Science', 'NIMS', 'Japan', 'japan', 'Tsukuba', 'national_lab', 'https://www.nims.go.jp', '{composites,materials,manufacturing}'),

-- ============================================================
-- EUROPE — WEST (France, Netherlands, Belgium, Switzerland)
-- ============================================================
('Airbus Defence and Space', 'Airbus DS', 'France', 'europe_west', 'Toulouse', 'aerospace_company', 'https://www.airbus.com', '{composites,structures,manufacturing,uav,aerospace}'),
('ONERA - French Aerospace Lab', 'ONERA', 'France', 'europe_west', 'Palaiseau', 'national_lab', 'https://www.onera.fr', '{cfd,structures,composites,mdo,aerospace}'),
('ISAE-SUPAERO', 'ISAE', 'France', 'europe_west', 'Toulouse', 'university', 'https://www.isae-supaero.fr', '{mdo,structures,composites,cfd,aerospace}'),
('Safran Group', 'Safran', 'France', 'europe_west', 'Paris', 'aerospace_company', 'https://www.safran-group.com', '{composites,propulsion,manufacturing,structures}'),
('Dassault Aviation', 'Dassault', 'France', 'europe_west', 'Saint-Cloud', 'aerospace_company', 'https://www.dassault-aviation.com', '{structures,cfd,composites,defense,aerospace}'),
('TU Delft - Aerospace Structures', 'TU Delft', 'Netherlands', 'europe_west', 'Delft', 'university', 'https://www.tudelft.nl', '{composites,structures,mdo,cfd,aerospace}'),
('NLR - Netherlands Aerospace Centre', 'NLR', 'Netherlands', 'europe_west', 'Amsterdam', 'national_lab', 'https://www.nlr.nl', '{composites,structures,cfd,uav}'),
('EPFL - Composite Construction Lab', 'EPFL', 'Switzerland', 'europe_west', 'Lausanne', 'university', 'https://www.epfl.ch', '{composites,structures,mdo,computational}'),
('ETH Zurich - Composite Materials', 'ETH', 'Switzerland', 'europe_west', 'Zurich', 'university', 'https://www.ethz.ch', '{composites,structures,manufacturing,computational}'),
('Von Karman Institute', 'VKI', 'Belgium', 'europe_west', 'Brussels', 'research_lab', 'https://www.vki.ac.be', '{cfd,aerodynamics,aerospace}'),

-- ============================================================
-- EUROPE — CENTRAL (Germany, Austria)
-- ============================================================
('DLR - German Aerospace Center', 'DLR', 'Germany', 'europe_central', 'Cologne', 'national_lab', 'https://www.dlr.de', '{composites,structures,cfd,mdo,uav,aerospace}'),
('DLR Institute of Composite Structures', 'DLR Composites', 'Germany', 'europe_central', 'Braunschweig', 'national_lab', 'https://www.dlr.de', '{composites,structures,manufacturing,fea}'),
('Airbus Hamburg', 'Airbus HH', 'Germany', 'europe_central', 'Hamburg', 'aerospace_company', 'https://www.airbus.com', '{composites,structures,manufacturing,aerospace}'),
('TU Munich - Aerospace', 'TUM', 'Germany', 'europe_central', 'Munich', 'university', 'https://www.tum.de', '{composites,structures,cfd,mdo,aerospace}'),
('RWTH Aachen - Structural Mechanics', 'RWTH', 'Germany', 'europe_central', 'Aachen', 'university', 'https://www.rwth-aachen.de', '{structures,composites,fea,mdo}'),
('University of Stuttgart - IFB', 'Stuttgart IFB', 'Germany', 'europe_central', 'Stuttgart', 'university', 'https://www.uni-stuttgart.de', '{composites,structures,manufacturing,aerospace}'),
('TU Braunschweig - iAF', 'TU BS', 'Germany', 'europe_central', 'Braunschweig', 'university', 'https://www.tu-braunschweig.de', '{structures,composites,aerospace,mdo}'),
('Lilium GmbH', 'Lilium', 'Germany', 'europe_central', 'Munich', 'evtol_startup', 'https://www.lilium.com', '{evtol,composites,structures,aerospace}'),
('Volocopter GmbH', 'Volocopter', 'Germany', 'europe_central', 'Bruchsal', 'evtol_startup', 'https://www.volocopter.com', '{evtol,structures,composites}'),
('Premium AEROTEC (now Airbus Aerostructures)', 'AEROTEC', 'Germany', 'europe_central', 'Augsburg', 'aerospace_company', 'https://www.airbus.com', '{composites,structures,manufacturing}'),
('TU Wien - Inst. of Lightweight Design', 'TU Wien', 'Austria', 'europe_central', 'Vienna', 'university', 'https://www.tuwien.at', '{composites,structures,lightweight}'),
('DAAD Fellowship', 'DAAD', 'Germany', 'europe_central', 'Bonn', 'fellowship', 'https://www.daad.de', '{fellowship,research}'),

-- ============================================================
-- EUROPE — NORTH (Sweden, Denmark, Finland, Norway)
-- ============================================================
('KTH Royal Institute of Technology', 'KTH', 'Sweden', 'europe_north', 'Stockholm', 'university', 'https://www.kth.se', '{composites,structures,mdo,aerospace}'),
('Saab Aeronautics', 'Saab', 'Sweden', 'europe_north', 'Linkoping', 'aerospace_company', 'https://www.saab.com', '{composites,structures,defense,aerospace}'),
('Chalmers University - Mechanics and Maritime', 'Chalmers', 'Sweden', 'europe_north', 'Gothenburg', 'university', 'https://www.chalmers.se', '{composites,structures,fea}'),
('DTU Denmark - Wind Energy', 'DTU', 'Denmark', 'europe_north', 'Copenhagen', 'university', 'https://www.dtu.dk', '{composites,structures,cfd,wind_energy}'),
('Aalto University - Lightweight Structures', 'Aalto', 'Finland', 'europe_north', 'Espoo', 'university', 'https://www.aalto.fi', '{composites,structures,manufacturing}'),
('NTNU - Structural Engineering', 'NTNU', 'Norway', 'europe_north', 'Trondheim', 'university', 'https://www.ntnu.edu', '{composites,structures,marine}'),

-- ============================================================
-- UK
-- ============================================================
('University of Bristol - ACCIS', 'Bristol ACCIS', 'UK', 'uk', 'Bristol', 'university', 'https://www.bristol.ac.uk', '{composites,structures,manufacturing,mdo,aerospace}'),
('Imperial College - Aeronautics', 'Imperial', 'UK', 'uk', 'London', 'university', 'https://www.imperial.ac.uk', '{structures,composites,cfd,mdo,aerospace}'),
('Cranfield University - Aerospace', 'Cranfield', 'UK', 'uk', 'Cranfield', 'university', 'https://www.cranfield.ac.uk', '{composites,structures,manufacturing,aerospace}'),
('University of Bath - CAME', 'Bath', 'UK', 'uk', 'Bath', 'university', 'https://www.bath.ac.uk', '{composites,structures,mdo}'),
('Rolls-Royce', 'RR', 'UK', 'uk', 'Derby', 'aerospace_company', 'https://www.rolls-royce.com', '{composites,propulsion,manufacturing,structures}'),
('BAE Systems', 'BAE', 'UK', 'uk', 'Farnborough', 'aerospace_company', 'https://www.baesystems.com', '{composites,structures,defense,uav,aerospace}'),
('GKN Aerospace', 'GKN', 'UK', 'uk', 'Bristol', 'aerospace_company', 'https://www.gknaerospace.com', '{composites,structures,manufacturing}'),
('Vertical Aerospace', 'Vertical', 'UK', 'uk', 'Bristol', 'evtol_startup', 'https://www.vertical-aerospace.com', '{evtol,composites,structures}'),
('National Composites Centre', 'NCC', 'UK', 'uk', 'Bristol', 'research_lab', 'https://www.nccuk.com', '{composites,manufacturing,aerospace}'),

-- ============================================================
-- NORTH AMERICA
-- ============================================================
('Stanford University - Farhat Group', 'Stanford Farhat', 'USA', 'north_america', 'Stanford', 'university', 'https://web.stanford.edu/group/frg/', '{mdo,structures,cfd,rom,computational}'),
('MIT - Aerospace Computational Design Lab', 'MIT ACDL', 'USA', 'north_america', 'Cambridge', 'university', 'https://acdl.mit.edu', '{mdo,structures,cfd,computational,aerospace}'),
('University of Michigan - Aerospace', 'UMich Aero', 'USA', 'north_america', 'Ann Arbor', 'university', 'https://aero.engin.umich.edu', '{mdo,structures,composites,cfd}'),
('Georgia Tech - ASDL', 'GT ASDL', 'USA', 'north_america', 'Atlanta', 'university', 'https://www.asdl.gatech.edu', '{mdo,structures,composites,aerospace}'),
('NASA Langley Research Center', 'NASA LaRC', 'USA', 'north_america', 'Hampton', 'national_lab', 'https://www.nasa.gov/langley', '{composites,structures,cfd,aerospace}'),
('NASA Glenn Research Center', 'NASA Glenn', 'USA', 'north_america', 'Cleveland', 'national_lab', 'https://www.nasa.gov/glenn', '{composites,structures,propulsion}'),
('Joby Aviation', 'Joby', 'USA', 'north_america', 'Santa Cruz', 'evtol_startup', 'https://www.jobyaviation.com', '{evtol,composites,structures,aerospace}'),
('Archer Aviation', 'Archer', 'USA', 'north_america', 'San Jose', 'evtol_startup', 'https://www.archer.com', '{evtol,composites,structures}'),
('Wisk Aero (Boeing)', 'Wisk', 'USA', 'north_america', 'Mountain View', 'evtol_startup', 'https://wisk.aero', '{evtol,uav,structures,composites}'),
('Boeing Research & Technology', 'Boeing R&T', 'USA', 'north_america', 'St Louis', 'aerospace_company', 'https://www.boeing.com', '{composites,structures,manufacturing,aerospace}'),
('Lockheed Martin Skunk Works', 'LM Skunk Works', 'USA', 'north_america', 'Palmdale', 'aerospace_company', 'https://www.lockheedmartin.com', '{structures,composites,defense,aerospace}'),
('Northrop Grumman', 'NGC', 'USA', 'north_america', 'Falls Church', 'aerospace_company', 'https://www.northropgrumman.com', '{composites,structures,uav,defense}'),
('Raytheon / RTX', 'RTX', 'USA', 'north_america', 'Arlington', 'aerospace_company', 'https://www.rtx.com', '{structures,defense,propulsion}'),
('Spirit AeroSystems', 'Spirit', 'USA', 'north_america', 'Wichita', 'aerospace_company', 'https://www.spiritaero.com', '{composites,structures,manufacturing}'),
('NRC Canada - Aerospace', 'NRC', 'Canada', 'north_america', 'Ottawa', 'national_lab', 'https://www.nrc-cnrc.gc.ca', '{composites,structures,cfd,aerospace}'),
('University of Toronto - UTIAS', 'UTIAS', 'Canada', 'north_america', 'Toronto', 'university', 'https://www.utias.utoronto.ca', '{structures,cfd,mdo,aerospace}'),
('Bombardier Aerospace', 'Bombardier', 'Canada', 'north_america', 'Montreal', 'aerospace_company', 'https://www.bombardier.com', '{composites,structures,manufacturing,aerospace}'),
('Embraer', 'Embraer', 'Brazil', 'south_america', 'Sao Jose dos Campos', 'aerospace_company', 'https://www.embraer.com', '{composites,structures,manufacturing,aerospace}'),
('Eve Air Mobility (Embraer)', 'Eve', 'Brazil', 'south_america', 'Melbourne FL', 'evtol_startup', 'https://www.eveairmobility.com', '{evtol,composites,structures}'),

-- ============================================================
-- AUSTRALIA / NZ
-- ============================================================
('University of Sydney - Aerospace', 'USyd', 'Australia', 'australia_nz', 'Sydney', 'university', 'https://www.sydney.edu.au', '{composites,structures,cfd,aerospace}'),
('RMIT University - Aerospace', 'RMIT', 'Australia', 'australia_nz', 'Melbourne', 'university', 'https://www.rmit.edu.au', '{composites,structures,uav}'),
('CSIRO - Manufacturing', 'CSIRO', 'Australia', 'australia_nz', 'Melbourne', 'national_lab', 'https://www.csiro.au', '{composites,manufacturing,materials}'),
('Boeing Australia', 'Boeing AU', 'Australia', 'australia_nz', 'Brisbane', 'aerospace_company', 'https://www.boeing.com.au', '{composites,structures,uav,aerospace}'),

-- ============================================================
-- SOUTH KOREA
-- ============================================================
('KAIST - Aerospace', 'KAIST', 'South Korea', 'south_korea', 'Daejeon', 'university', 'https://www.kaist.ac.kr', '{composites,structures,cfd,mdo,aerospace}'),
('Korea Aerospace Industries', 'KAI', 'South Korea', 'south_korea', 'Sacheon', 'aerospace_company', 'https://www.koreaaero.com', '{composites,structures,manufacturing,aerospace}'),
('Korea Aerospace Research Institute', 'KARI', 'South Korea', 'south_korea', 'Daejeon', 'national_lab', 'https://www.kari.re.kr', '{structures,cfd,aerospace}'),

-- ============================================================
-- SINGAPORE
-- ============================================================
('NUS - Temasek Laboratories', 'NUS Temasek', 'Singapore', 'singapore', 'Singapore', 'university', 'https://www.nus.edu.sg', '{structures,composites,uav,defense}'),
('NTU - School of MAE', 'NTU', 'Singapore', 'singapore', 'Singapore', 'university', 'https://www.ntu.edu.sg', '{composites,structures,cfd,manufacturing}'),
('ST Engineering Aerospace', 'STE Aero', 'Singapore', 'singapore', 'Singapore', 'aerospace_company', 'https://www.stengg.com', '{structures,composites,manufacturing,aerospace}'),

-- ============================================================
-- MIDDLE EAST
-- ============================================================
('Khalifa University - Aerospace', 'Khalifa', 'UAE', 'middle_east', 'Abu Dhabi', 'university', 'https://www.ku.ac.ae', '{composites,structures,manufacturing,aerospace}'),
('KAUST - Materials Science', 'KAUST', 'Saudi Arabia', 'middle_east', 'Thuwal', 'university', 'https://www.kaust.edu.sa', '{composites,materials,computational}'),
('Strata Manufacturing (Mubadala)', 'Strata', 'UAE', 'middle_east', 'Al Ain', 'aerospace_company', 'https://www.strata.ae', '{composites,manufacturing,structures,aerospace}'),

-- ============================================================
-- FELLOWSHIP / EXCHANGE PROGRAMS
-- ============================================================
('JSPS Fellowship (Japan)', 'JSPS', 'Japan', 'japan', 'Tokyo', 'fellowship', 'https://www.jsps.go.jp', '{fellowship,research,japan}'),
('Fulbright Program', 'Fulbright', 'USA', 'north_america', 'Washington DC', 'fellowship', 'https://www.fulbright.org', '{fellowship,research}'),
('Marie Skłodowska-Curie Actions', 'MSCA', 'EU', 'europe_west', 'Brussels', 'fellowship', 'https://ec.europa.eu/research/mariecurieactions/', '{fellowship,research,europe}'),
('Endeavour Scholarships (Australia)', 'Endeavour', 'Australia', 'australia_nz', 'Canberra', 'fellowship', 'https://www.dese.gov.au', '{fellowship,research,australia}'),
('Commonwealth Scholarships', 'Commonwealth', 'UK', 'uk', 'London', 'fellowship', 'https://cscuk.fcdo.gov.uk', '{fellowship,research,uk}'),
('Mitacs Globalink (Canada)', 'Mitacs', 'Canada', 'north_america', 'Vancouver', 'fellowship', 'https://www.mitacs.ca', '{fellowship,research,canada}'),
('KGSP (South Korea)', 'KGSP', 'South Korea', 'south_korea', 'Sejong', 'fellowship', 'https://www.studyinkorea.go.kr', '{fellowship,research,korea}');
