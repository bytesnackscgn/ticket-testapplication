import type { Knex } from 'knex';
import type { Events } from '../../../types';
import { v4 as uuidv4 } from 'uuid';
import { faker, fakerDE } from '@faker-js/faker';

export async function seed(knex: Knex): Promise<void> {
  try {
    const eventAmount = await knex('events').count({ count: '*' });
    if (eventAmount[0].count > 0) return;

    const eventTitles = [
      'IAA Personenkraftwagen',
      'CeBIT',
      'Hannover-Messe',
      'bauma',
      'Internationale Grüne Woche',
      'Agritechnica',
      'Mannheimer Maimarkt',
      'Essen Motor Show',
      'IdeenExpo',
      'Drupa',
      'gamescom',
      'Internationale Funkausstellung',
      'Boot',
      'IAA Nutzfahrzeuge',
      'Frankfurter Buchmesse',
      'Leipziger Buchmesse',
      'Auto Mobil International',
      'Hannover Messe',
      'Berlin Air Show (ILA)',
      'Infa',
      'K (Kunststoffmesse)',
      'BAU',
      'CMT',
      'Heim+Handwerk',
      'ISH',
      'Consumenta',
      'Light+Building',
      'Du und Deine Welt',
      'Equitana',
      'Internationale Handwerksmesse',
      'Games Convention',
      'Mode-Heim-Handwerk',
      'Holz-Handwerk',
      'EMO – Die Welt der Metallbearbeitung',
      'Caravan Salon',
      'Internationale Spieltage SPIEL',
      'Freizeit, Garten + Touristik',
      'Haus-Garten-Freizeit',
      'f.re.e',
      'interpack',
      'Intermot',
      'Stuttgarter Messeherbst',
      'ACHEMA',
      'Internationale Tourismus-Börse',
      'Anuga',
      'Automechanika',
      'photokina',
      'EuroTier',
      'INTERSCHUTZ',
      'Internationale Dental-Schau (IDS)',
      'Ambiente',
      'imm cologne',
      'hanseboot',
      'Boulevard.DORTMUNDER HERBST',
      'Offerta',
      'InnoTrans',
      'MEDICA',
      'IFAT',
      'ABF',
      'Südwest Messe',
      'Reisen Hamburg',
      'Mainfranken-Messe',
      'SYSTEMS',
      'Allgäuer Festwoche',
      'Reise/Camping',
      'Tarmstedter Ausstellung',
      'Niederbayern-Schau',
      'FIBO',
      'Rheinische Landesausstellung',
      'Tuning World',
      'Garten München',
      'Ligna +',
      'didacta',
      'Fensterbau Frontale',
      'Tendence',
      'Modell-Hobby-Spiel',
      'Interboot',
      'EuroShop',
      'HanseLife',
      'Intermodellbau',
      'DEUBAU',
      'Weser-Ems-Ausstellung',
      'Oberrhein-Messe',
      'Baden Messe',
    ];

    const currentDate = new Date();
    const yesterday = new Date(currentDate);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayIso = yesterday.toISOString();
    const events: Events[] = [];

    for (let i = 0; i < 10; i++) {
      const randomTitle =
        eventTitles[Math.floor(Math.random() * eventTitles.length)];
      const randomCity = fakerDE.location.city();

      events.push({
        id: uuidv4(),
        date: faker.date.soon({ refDate: yesterdayIso }).toISOString(),
        title: `${randomTitle} - ${randomCity}`,
        city: randomCity,
      });
    }
    await knex('events').insert(events);
  } catch (e) {
    console.warn(e);
  }
}
