const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const App = require('../models/App');
const String = require('../models/String');
const Translation = require('../models/Translation');

// Charger les variables d'environnement
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('MongoDB URI:', process.env.MONGODB_URI);

// Connecter à MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB successfully');
  return seedData();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});

// Fonction pour créer les données initiales
const seedData = async () => {
  try {
    console.log('Starting to seed database...');
    
    // Nettoyer la base de données
    console.log('Clearing existing data...');
    await User.deleteMany();
    await App.deleteMany();
    await String.deleteMany();
    await Translation.deleteMany();

    console.log('Database cleared successfully');

    // Créer les utilisateurs 
    console.log('Creating users...');
    
    // Hacher les mots de passe
    const adminPassword = await bcrypt.hash('admin123', 10);
    const poPassword = await bcrypt.hash('po123', 10);
    const devPassword = await bcrypt.hash('dev123', 10);

    const admin = await User.create({
      email: 'admin@admin.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      company: 'Admin Company'
    });
    console.log('Admin user created:', admin.email);

    const po = await User.create({
      email: 'ayoubzokrii@gmail.com',
      password: poPassword,
      firstName: 'ayoub',
      lastName: 'zokri',
      role: 'po',
      company: 'GlobeEditor'
    });
    console.log('PO user created:', po.email);

    const dev = await User.create({
      email: 'globecoder@gmail.com',
      password: devPassword,
      firstName: 'issam',
      lastName: 'cherkaoui',
      role: 'dev',
      company: 'GlobeCoder'
    });
    console.log('Dev user created:', dev.email);

    console.log('All users created successfully');

    // Créer une application
    console.log('Creating test application...');
    const app = await App.create({
      name: 'Test App',
      description: 'Application de test',
      owner: admin._id,
      languages: ['en', 'fr'],
      defaultLanguage: 'en',
      settings: {
        autoApprove: false,
        notificationEmail: 'admin@admin.com'
      }
    });
    console.log('Test application created:', app.name);

    // Créer des chaînes de traduction
    console.log('Creating translation strings...');
    const string1 = await String.create({
      key: 'welcome_message',
      app: app._id,
      context: 'Welcome message on homepage',
      tags: ['homepage', 'welcome'],
      createdBy: admin._id,
      lastModifiedBy: admin._id,
      translations: [
        {
          language: 'en',
          value: 'Welcome to our application',
          status: 'approved'
        },
        {
          language: 'fr',
          value: 'Bienvenue dans notre application',
          status: 'approved'
        }
      ]
    });
    console.log('String 1 created:', string1.key);

    const string2 = await String.create({
      key: 'login_button',
      app: app._id,
      context: 'Login button text',
      tags: ['auth', 'button'],
      createdBy: admin._id,
      lastModifiedBy: admin._id,
      translations: [
        {
          language: 'en',
          value: 'Login',
          status: 'approved'
        },
        {
          language: 'fr',
          value: 'Connexion',
          status: 'approved'
        }
      ]
    });
    console.log('String 2 created:', string2.key);

    console.log('All seed data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error creating seed data:', error);
    process.exit(1);
  }
}; 