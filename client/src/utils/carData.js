const carBrands = {
  Toyota: ['Corolla', 'Camry', 'RAV4', 'Land Cruiser', 'Hilux', 'Yaris', 'Fortuner', 'Avanza', 'Rush'],
  Hyundai: ['Elantra', 'Accent', 'Tucson', 'Creta', 'Santa Fe', 'Kona', 'Verna', 'i10', 'i20'],
  Nissan: ['Sunny', 'Sentra', 'Altima', 'X-Trail', 'Kicks', 'Qashqai', 'Patrol', 'Juke'],
  Kia: ['Cerato', 'Rio', 'Sportage', 'Sorento', 'Picanto', 'Seltos', 'Carnival', 'K5'],
  Chevrolet: ['Aveo', 'Optra', 'Cruze', 'Malibu', 'Tahoe', 'Captiva', 'Trax', 'Spark'],
  Peugeot: ['301', '308', '2008', '3008', '5008', '508', 'Partner', 'Expert'],
  Renault: ['Logan', 'Duster', 'Megane', 'Captur', 'Koleos', 'Talisman', 'Dokker'],
  Skoda: ['Octavia', 'Superb', 'Rapid', 'Fabia', 'Kodiaq', 'Karoq', 'Scala'],
  Mitsubishi: ['Lancer', 'Attrage', 'Eclipse Cross', 'Outlander', 'Pajero', 'ASX', 'L200'],
  Honda: ['Civic', 'Accord', 'CR-V', 'HR-V', 'City', 'Pilot'],
  Mazda: ['Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-9', 'MX-5'],
  Ford: ['Focus', 'Fiesta', 'Fusion', 'Edge', 'Explorer', 'Escape', 'Ranger'],
  Volkswagen: ['Jetta', 'Passat', 'Tiguan', 'Touareg', 'Golf', 'Polo', 'Teramont'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'A-Class'],
  BMW: ['Series 1', 'Series 3', 'Series 5', 'Series 7', 'X1', 'X3', 'X5', 'X6'],
  Audi: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'Q8'],
  Suzuki: ['Swift', 'Ciaz', 'Vitara', 'Ertiga', 'Dzire', 'Alto'],
  Fiat: ['Tipo', '500', 'Panda', 'Uno', 'Doblo'],
  Geely: ['Emgrand 7', 'Emgrand X7', 'Coolray', 'Azkarra', 'Okavango'],
  MG: ['MG5', 'MG6', 'ZS', 'RX5', 'HS', 'RX8'],
  Chery: ['Tiggo 2', 'Tiggo 3', 'Tiggo 7', 'Tiggo 8', 'Arrizo 5', 'Arrizo 6'],
  BYD: ['F3', 'G6', 'S6', 'Tang', 'Han'],
  JAC: ['S3', 'S4', 'S5', 'J7', 'T6'],
  Brilliance: ['V5', 'V3', 'H530', 'H330'],
  Haval: ['H2', 'H6', 'Jolion', 'Dargo'],
  Changan: ['CS35', 'CS55', 'CS75', 'CS85', 'Alsvin'],
  GAC: ['GS3', 'GS4', 'GS8', 'GA4', 'GA6'],
  Dongfeng: ['AX7', 'S30', '580', '560'],
  Opel: ['Astra', 'Insignia', 'Crossland', 'Grandland'],
  Seat: ['Ibiza', 'Leon', 'Ateca', 'Arona', 'Tarraco'],
  Jeep: ['Renegade', 'Compass', 'Cherokee', 'Grand Cherokee', 'Wrangler'],
  'Land Rover': ['Discovery', 'Range Rover', 'Range Rover Sport', 'Defender', 'Evoque'],
  Volvo: ['S60', 'S90', 'XC40', 'XC60', 'XC90'],
  Lexus: ['ES', 'IS', 'LS', 'RX', 'NX', 'LX'],
  Infiniti: ['Q50', 'Q60', 'QX50', 'QX60', 'QX80']
};

const currentYear = new Date().getFullYear();
const years = [];
for (let year = currentYear; year >= 1990; year -= 1) {
  years.push(year);
}

export function getBrands() {
  return Object.keys(carBrands).sort();
}

export function getModels(brand) {
  return carBrands[brand] || [];
}

export function getYears() {
  return years;
}
