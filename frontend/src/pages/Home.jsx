import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Bienvenue sur la Plateforme de Traduction
          </h1>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            À propos du projet
          </h2>
          <p className="text-gray-600 mb-4">
            Notre plateforme de traduction est conçue pour faciliter la gestion et la traduction de contenu
            entre différentes langues. Elle offre des fonctionnalités avancées pour les traducteurs,
            les gestionnaires de projet et les administrateurs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Fonctionnalités principales
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li>• Interface intuitive pour les traducteurs</li>
              <li>• Gestion des projets de traduction</li>
              <li>• Suivi des progrès en temps réel</li>
              <li>• Support multilingue</li>
              <li>• Système de révision intégré</li>
            </ul>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Comment commencer
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li>1. Connectez-vous à votre compte</li>
              <li>2. Accédez à vos projets de traduction</li>
              <li>3. Commencez à traduire ou à gérer vos projets</li>
              <li>4. Suivez vos progrès et statistiques</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-white shadow rounded-lg p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Support et assistance
          </h3>
          <p className="text-gray-600">
            Si vous avez des questions ou besoin d'aide, n'hésitez pas à contacter notre équipe de support.
            Nous sommes là pour vous aider à tirer le meilleur parti de notre plateforme de traduction.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home; 