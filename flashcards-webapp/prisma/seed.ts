import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding baze...')

  const adminPassword = await bcrypt.hash('admin123', 10)
  const agentPassword = await bcrypt.hash('agent123', 10)
  const clientPassword = await bcrypt.hash('klijent123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@agencija.com' },
    update: {},
    create: { firstName: 'Marko', lastName: 'Marković', email: 'admin@agencija.com', password: adminPassword, role: 'ADMIN', status: 'ACTIVE' },
  })

  const agent = await prisma.user.upsert({
    where: { email: 'agent@agencija.com' },
    update: {},
    create: { firstName: 'Ana', lastName: 'Anić', email: 'agent@agencija.com', password: agentPassword, role: 'AGENT', status: 'ACTIVE' },
  })

  const client1 = await prisma.user.upsert({
    where: { email: 'petar@gmail.com' },
    update: {},
    create: { firstName: 'Petar', lastName: 'Petrović', email: 'petar@gmail.com', password: clientPassword, role: 'CLIENT', status: 'ACTIVE' },
  })

  const client2 = await prisma.user.upsert({
    where: { email: 'jovana@gmail.com' },
    update: {},
    create: { firstName: 'Jovana', lastName: 'Jovanović', email: 'jovana@gmail.com', password: clientPassword, role: 'CLIENT', status: 'ACTIVE' },
  })

  const client3 = await prisma.user.upsert({
    where: { email: 'stefan@gmail.com' },
    update: {},
    create: { firstName: 'Stefan', lastName: 'Stefanović', email: 'stefan@gmail.com', password: clientPassword, role: 'CLIENT', status: 'ACTIVE' },
  })

  const client4 = await prisma.user.upsert({
    where: { email: 'milica@gmail.com' },
    update: {},
    create: { firstName: 'Milica', lastName: 'Nikolić', email: 'milica@gmail.com', password: clientPassword, role: 'CLIENT', status: 'ACTIVE' },
  })

  console.log('✅ Korisnici kreirani')

  const more = await prisma.category.upsert({ where: { name: 'More' }, update: {}, create: { name: 'More' } })
  const planine = await prisma.category.upsert({ where: { name: 'Planine' }, update: {}, create: { name: 'Planine' } })
  const gradovi = await prisma.category.upsert({ where: { name: 'Gradovi' }, update: {}, create: { name: 'Gradovi' } })
  const spa = await prisma.category.upsert({ where: { name: 'Spa & Wellness' }, update: {}, create: { name: 'Spa & Wellness' } })
  const avantura = await prisma.category.upsert({ where: { name: 'Avantura' }, update: {}, create: { name: 'Avantura' } })
  const krstarenje = await prisma.category.upsert({ where: { name: 'Krstarenje' }, update: {}, create: { name: 'Krstarenje' } })

  console.log('✅ Kategorije kreirane')

  const arrangements = await Promise.all([
    prisma.arrangement.create({ data: { destination: 'Grčka - Santorini', description: 'Luksuzni odmor na najlepšem ostrvu Mediterana. Bele kućice, plave kupole i neverovatni zalasci sunca nad kalderom.', price: 1200, startDate: new Date('2026-07-01'), endDate: new Date('2026-07-08'), numberOfNights: 7, imageUrl: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800', categoryId: more.id, isActive: true, capacity: 20 } }),
    prisma.arrangement.create({ data: { destination: 'Turska - Antalija', description: 'All-inclusive odmor na turskoj rivijeri. Kristalno čisto more, bogati bifei i sjajni hoteli sa aquaparkom.', price: 850, startDate: new Date('2026-06-15'), endDate: new Date('2026-06-22'), numberOfNights: 7, imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800', categoryId: more.id, isActive: true, capacity: 30 } }),
    prisma.arrangement.create({ data: { destination: 'Španija - Ibiza', description: 'Živopisno ostrvo poznato po kristalno čistom moru, prelepim plažama i nezaboravnoj noćnoj zabavi.', price: 1100, startDate: new Date('2026-08-01'), endDate: new Date('2026-08-08'), numberOfNights: 7, imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', categoryId: more.id, isActive: true, capacity: 25 } }),
    prisma.arrangement.create({ data: { destination: 'Hrvatska - Dubrovnik', description: 'Bisер Jadrana. Stari grad pod zaštitom UNESCO-a, kristalno more i bogata istorija na dlanu.', price: 750, startDate: new Date('2026-07-15'), endDate: new Date('2026-07-22'), numberOfNights: 7, imageUrl: 'https://images.unsplash.com/photo-1555990793-da11153b2473?w=800', categoryId: more.id, isActive: true, capacity: 20 } }),
    prisma.arrangement.create({ data: { destination: 'Egipat - Hurgada', description: 'Sunce, pesak i koralni grebeni. Hurgada nudi odlične uslove za ronjenje i snorkelovanje u Crvenom moru.', price: 680, startDate: new Date('2026-05-20'), endDate: new Date('2026-05-27'), numberOfNights: 7, imageUrl: 'https://images.unsplash.com/photo-1539768942893-daf53e448371?w=800', categoryId: more.id, isActive: true, capacity: 35 } }),
    prisma.arrangement.create({ data: { destination: 'Kopaonik', description: 'Zimska bajka na Kopaoniku. Ski staze za sve nivoe, udobni apartmani i bogata apreski ponuda.', price: 450, startDate: new Date('2026-12-20'), endDate: new Date('2026-12-27'), numberOfNights: 7, imageUrl: 'https://images.unsplash.com/photo-1551524559-8af4e6624178?w=800', categoryId: planine.id, isActive: true, capacity: 25 } }),
    prisma.arrangement.create({ data: { destination: 'Švajcarska - Alpi', description: 'Nezaboravno iskustvo u Švajcarskim Alpima. Skijanje, planinarenje i predivni pogledi na snežne vrhove.', price: 1800, startDate: new Date('2026-01-10'), endDate: new Date('2026-01-17'), numberOfNights: 7, imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', categoryId: planine.id, isActive: true, capacity: 15 } }),
    prisma.arrangement.create({ data: { destination: 'Austrija - Tirolo', description: 'Alpska idila u srcu Evrope. Prekrasne planinske staze, zimski sportovi i topla austrijska gostoljubivost.', price: 1350, startDate: new Date('2026-02-05'), endDate: new Date('2026-02-12'), numberOfNights: 7, imageUrl: 'https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=800', categoryId: planine.id, isActive: true, capacity: 20 } }),
    prisma.arrangement.create({ data: { destination: 'Tara - Bajina Bašta', description: 'Planinski raj na Tari. Nacionalni park, kanjon reke Drine i netaknuta priroda Srbije.', price: 280, startDate: new Date('2026-09-05'), endDate: new Date('2026-09-08'), numberOfNights: 3, imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800', categoryId: planine.id, isActive: true, capacity: 30 } }),
    prisma.arrangement.create({ data: { destination: 'Pariz - Francuska', description: 'Romantičan vikend u gradu svetlosti. Ajfelova kula, Luvr, šetnja duž Seine i vrhunska francuska kuhinja.', price: 980, startDate: new Date('2026-05-10'), endDate: new Date('2026-05-14'), numberOfNights: 4, imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', categoryId: gradovi.id, isActive: true, capacity: 15 } }),
    prisma.arrangement.create({ data: { destination: 'Rim - Italija', description: 'Večni grad čeka vas! Koloseum, Vatikan, Trevi fontana i nezaboravna italijanska kuhinja.', price: 890, startDate: new Date('2026-04-20'), endDate: new Date('2026-04-25'), numberOfNights: 5, imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800', categoryId: gradovi.id, isActive: true, capacity: 20 } }),
    prisma.arrangement.create({ data: { destination: 'Barselona - Španija', description: 'Gaudi arhitektura, La Rambla, plažе i vibrantni noćni život. Barselona nudi sve što jedan grad može.', price: 920, startDate: new Date('2026-06-01'), endDate: new Date('2026-06-06'), numberOfNights: 5, imageUrl: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800', categoryId: gradovi.id, isActive: true, capacity: 18 } }),
    prisma.arrangement.create({ data: { destination: 'Prag - Češka', description: 'Grad sto kula. Bajkoviti stari grad, Karlov most, Praški zamak i odlično češko pivo.', price: 650, startDate: new Date('2026-10-10'), endDate: new Date('2026-10-14'), numberOfNights: 4, imageUrl: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800', categoryId: gradovi.id, isActive: true, capacity: 22 } }),
    prisma.arrangement.create({ data: { destination: 'Beč - Austrija', description: 'Carska elegancija i kulturno bogatstvo. Opere, muzeji, bečke kafane i čuveni Sachertorte.', price: 780, startDate: new Date('2026-11-15'), endDate: new Date('2026-11-19'), numberOfNights: 4, imageUrl: 'https://images.unsplash.com/photo-1516550893923-42d28e5677af?w=800', categoryId: gradovi.id, isActive: true, capacity: 20 } }),
    prisma.arrangement.create({ data: { destination: 'Slovenija - Terme Čatež', description: 'Relaksacija i obnova u poznatim slovenačkim termama. Bazeni, masaže i wellness programi za celu porodicu.', price: 380, startDate: new Date('2026-04-05'), endDate: new Date('2026-04-08'), numberOfNights: 3, imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800', categoryId: spa.id, isActive: true, capacity: 20 } }),
    prisma.arrangement.create({ data: { destination: 'Mađarska - Budimpešta Terme', description: 'Budimpešta je svetska prestonica termalnih kupki. Széchényi terme, Gellért i Rudas su obavezna poseta.', price: 520, startDate: new Date('2026-03-20'), endDate: new Date('2026-03-24'), numberOfNights: 4, imageUrl: 'https://images.unsplash.com/photo-1555990793-b5f06c9c1db9?w=800', categoryId: spa.id, isActive: true, capacity: 25 } }),
    prisma.arrangement.create({ data: { destination: 'Island - Gejziri i Aurore', description: 'Čudesna zemlja leda i vatre. Severna svetlost, gejziri, vodopadi i geotermalni bazeni Blue Lagoon.', price: 2200, startDate: new Date('2026-02-20'), endDate: new Date('2026-02-27'), numberOfNights: 7, imageUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800', categoryId: avantura.id, isActive: true, capacity: 12 } }),
    prisma.arrangement.create({ data: { destination: 'Novi Zeland - Avantura', description: 'Zemlja dugog belog oblaka. Bungee jumping, planinarenje, hobbit sela i predivna netaknuta priroda.', price: 3500, startDate: new Date('2026-10-01'), endDate: new Date('2026-10-15'), numberOfNights: 14, imageUrl: 'https://images.unsplash.com/photo-1469521669194-babb45599def?w=800', categoryId: avantura.id, isActive: true, capacity: 10 } }),
    prisma.arrangement.create({ data: { destination: 'Mediteransko krstarenje', description: 'Krstarenje Mediteranom sa zaustavljanjima u Barseloni, Rimu, Napulju, Atenama i Dubrovniku.', price: 2800, startDate: new Date('2026-08-15'), endDate: new Date('2026-08-25'), numberOfNights: 10, imageUrl: 'https://images.unsplash.com/photo-1548574505-5e239809ee19?w=800', categoryId: krstarenje.id, isActive: true, capacity: 40 } }),
    prisma.arrangement.create({ data: { destination: 'Karibi - Krstarenje', description: 'Luksuzno krstarenje Karibima. Kristalno plavo more, bele peščane plaže i egzotična ostrva.', price: 3200, startDate: new Date('2026-12-01'), endDate: new Date('2026-12-11'), numberOfNights: 10, imageUrl: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?w=800', categoryId: krstarenje.id, isActive: true, capacity: 35 } }),
  ])

  console.log('✅ Aranžmani kreirani:', arrangements.length)

  // Popusti
  await prisma.discount.create({ data: { type: 'percentage', value: 15, startDate: new Date('2026-03-01'), endDate: new Date('2026-06-01'), arrangementId: arrangements[0].id } })
  await prisma.discount.create({ data: { type: 'fixed', value: 100, startDate: new Date('2026-03-01'), endDate: new Date('2026-05-01'), arrangementId: arrangements[1].id } })
  await prisma.discount.create({ data: { type: 'percentage', value: 20, startDate: new Date('2026-04-01'), endDate: new Date('2026-07-01'), arrangementId: arrangements[4].id } })
  await prisma.discount.create({ data: { type: 'percentage', value: 10, startDate: new Date('2026-11-01'), endDate: new Date('2026-12-31'), arrangementId: arrangements[5].id } })

  console.log('✅ Popusti kreirani')

  // Rezervacije
  await prisma.reservation.createMany({ data: [
    { userId: client1.id, arrangementId: arrangements[0].id, status: 'CONFIRMED' },
    { userId: client1.id, arrangementId: arrangements[5].id, status: 'PENDING' },
    { userId: client1.id, arrangementId: arrangements[9].id, status: 'COMPLETED' },
    { userId: client2.id, arrangementId: arrangements[1].id, status: 'CONFIRMED' },
    { userId: client2.id, arrangementId: arrangements[3].id, status: 'CANCELLED' },
    { userId: client2.id, arrangementId: arrangements[10].id, status: 'PENDING' },
    { userId: client3.id, arrangementId: arrangements[6].id, status: 'CONFIRMED' },
    { userId: client3.id, arrangementId: arrangements[16].id, status: 'PENDING' },
    { userId: client4.id, arrangementId: arrangements[18].id, status: 'CONFIRMED' },
    { userId: client4.id, arrangementId: arrangements[2].id, status: 'PENDING' },
  ]})

  console.log('✅ Rezervacije kreirane')
  console.log('')
  console.log('🎉 Seed završen! Kredencijali:')
  console.log('   Admin:   admin@agencija.com  /  admin123')
  console.log('   Agent:   agent@agencija.com  /  agent123')
  console.log('   Klijent: petar@gmail.com     /  klijent123')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })