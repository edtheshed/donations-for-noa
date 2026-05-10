import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xmcncycgwcuklohqwyup.supabase.co',
  'sb_publishable_iuEVV2azEliaX3wSZmvXcA_Hrf_SmWc'
);

const donations = [
  { name: 'Sarah Mitchell', donated_at: '2026-04-28', location: 'NHS Blood Donor Centre, Manchester', message: 'Donating in honour of Noa — every drop counts!' },
  { name: 'James Thornton', donated_at: '2026-04-25', location: 'Sheffield Teaching Hospitals', message: null },
  { name: 'Priya Sharma', donated_at: '2026-05-01', location: 'King\'s College Hospital, London', message: 'Such a beautiful cause. Registered as a regular donor now.' },
  { name: 'Oliver Webb', donated_at: '2026-04-30', location: 'Bristol Blood Donation Centre', message: 'First time donating — Noa inspired me to finally do it.' },
  { name: 'Emma Lawson', donated_at: '2026-05-03', location: 'Edinburgh Royal Infirmary', message: 'Sending all my love to the family.' },
  { name: 'Daniel Okafor', donated_at: '2026-04-22', location: 'Guy\'s Hospital, London', message: null },
  { name: 'Charlotte Hughes', donated_at: '2026-05-05', location: 'Leeds General Infirmary', message: 'This registry is such a wonderful idea.' },
  { name: 'Finn McCarthy', donated_at: '2026-04-18', location: 'Cork University Hospital', message: 'Done it! Booked my next appointment already.' },
  { name: 'Aisha Patel', donated_at: '2026-05-07', location: 'NHS Blood Donor Centre, Birmingham', message: 'Noa\'s story moved me deeply. Happy to help in whatever way I can.' },
  { name: 'Tom Gallagher', donated_at: '2026-04-10', location: 'NHS Blood Donor Centre, Liverpool', message: null },
  { name: 'Megan Foster', donated_at: '2026-05-02', location: 'Oxford Radcliffe Hospital', message: 'Regular donor for 3 years — donating this one for Noa.' },
  { name: 'Ravi Nair', donated_at: '2026-04-15', location: 'St Thomas\' Hospital, London', message: 'Hoping this makes a difference.' },
  { name: 'Lucy Bancroft', donated_at: '2026-04-27', location: 'NHS Blood Donor Centre, Cambridge', message: 'Shared this with my whole team at work — we\'re all going together next month!' },
  { name: 'Ben Ashworth', donated_at: '2026-05-06', location: 'University Hospital Southampton', message: null },
  { name: 'Naomi Clarke', donated_at: '2026-04-20', location: 'Aberdeen Royal Infirmary', message: 'Never knew how easy it was. Will definitely be back.' },
  { name: 'Marcus Reid', donated_at: '2026-04-12', location: 'NHS Blood Donor Centre, Nottingham', message: 'For Noa and for everyone waiting on a transfusion right now.' },
  { name: 'Isla Mackenzie', donated_at: '2026-05-04', location: 'Glasgow Royal Infirmary', message: 'Did this with my mum — our first time donating together.' },
  { name: 'Harry Sutton', donated_at: '2026-04-08', location: 'NHS Blood Donor Centre, Bristol', message: null },
  { name: 'Amara Diallo', donated_at: '2026-04-24', location: 'King\'s College Hospital, London', message: 'Signed up as a platelet donor too after reading Noa\'s story.' },
  { name: 'George Whitfield', donated_at: '2026-05-08', location: 'Leeds General Infirmary', message: 'Proud to be donation number 20!' },
  { name: 'Chloe Brennan', donated_at: '2026-04-16', location: 'Dublin Donor Centre, D\'Olier Street', message: 'Came across this page and couldn\'t not go. Booked same day.' },
  { name: 'Ethan Morley', donated_at: '2026-04-29', location: 'NHS Blood Donor Centre, Newcastle', message: null },
  { name: 'Sophie Cunningham', donated_at: '2026-05-09', location: 'Addenbrooke\'s Hospital, Cambridge', message: 'Been meaning to do this for years. Noa gave me the push I needed.' },
  { name: 'Liam Fitzgerald', donated_at: '2026-04-05', location: 'Galway University Hospital', message: 'Thinking of the whole family.' },
  { name: 'Rachel Kim', donated_at: '2026-04-19', location: 'St Bartholomew\'s Hospital, London', message: null },
  { name: 'Jack Humphries', donated_at: '2026-04-11', location: 'NHS Blood Donor Centre, Sheffield', message: 'Went with three friends — we made an afternoon of it. Highly recommend.' },
  { name: 'Freya Anderson', donated_at: '2026-05-01', location: 'NHS Blood Donor Centre, Edinburgh', message: 'Sending so much love to Noa and the family.' },
  { name: 'Samuel Obi', donated_at: '2026-04-23', location: 'University College Hospital, London', message: 'Second time donating this year. Will keep going.' },
  { name: 'Hannah Pearce', donated_at: '2026-04-14', location: 'NHS Blood Donor Centre, Cardiff', message: null },
  { name: 'Noah Thompson', donated_at: '2026-04-26', location: 'NHS Blood Donor Centre, Bath', message: 'Registered as a donor for the first time — took about 45 minutes total and the staff were brilliant.' },
  { name: 'Zara Ahmed', donated_at: '2026-05-03', location: 'King\'s College Hospital, London', message: 'This site is so well made. What a meaningful project.' },
  { name: 'Will Patterson', donated_at: '2026-04-09', location: 'NHS Blood Donor Centre, Brighton', message: null },
  { name: 'Mia Sullivan', donated_at: '2026-04-21', location: 'NHS Blood Donor Centre, Manchester', message: 'Brought my boyfriend along — we both donated. Double the impact!' },
  { name: 'Isaac Barker', donated_at: '2026-05-07', location: 'Royal Victoria Hospital, Belfast', message: 'Noa\'s story is one I\'ll carry with me every time I donate.' },
  { name: 'Lily Jennings', donated_at: '2026-04-13', location: 'NHS Blood Donor Centre, Leicester', message: null },
  { name: 'Connor Walsh', donated_at: '2026-04-17', location: 'St James\'s Hospital, Dublin', message: 'Did it! Wasn\'t as scary as I expected. Thanks for the motivation, Noa.' },
  { name: 'Olivia Grant', donated_at: '2026-05-05', location: 'NHS Blood Donor Centre, Wolverhampton', message: 'Organising a group donation at my workplace next month because of this.' },
  { name: 'Callum Fraser', donated_at: '2026-04-06', location: 'NHS Blood Donor Centre, Dundee', message: null },
  { name: 'Tara Higgins', donated_at: '2026-04-30', location: 'Beaumont Hospital, Dublin', message: 'What a wonderful way to channel grief into good. Thinking of you all.' },
  { name: 'Matthew Donovan', donated_at: '2026-05-10', location: 'NHS Blood Donor Centre, Oxford', message: 'Just walked out of the donation centre. Feeling great — go do it!' },
];

async function seed() {
  console.log(`Inserting ${donations.length} donations...`);
  const { data, error } = await supabase.from('donations').insert(donations).select('id');
  if (error) {
    console.error('Insert failed:', error.message);
    process.exit(1);
  }
  console.log(`Done — inserted ${data?.length ?? 0} rows.`);
}

seed();
