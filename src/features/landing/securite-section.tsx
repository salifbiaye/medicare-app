export function SecuriteSection() {
  return (
    <div className="py-8 border-b border-gray-200 dark:border-gray-800">
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">
            Engagement envers la Précision et la Sécurité des Données Médicales
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2">Innovation</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Nous sommes à la pointe de l'innovation médicale au Sénégal, développant des outils qui transforment les
              données de santé brutes en informations exploitables, avec une préparation pour l'intégration future de
              l'IA pour l'analyse prédictive.
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2">Résultats Patients</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Notre logiciel est conçu pour soutenir des diagnostics rapides et précis, réduisant les déplacements des
              patients et conduisant à des traitements efficaces pour les maladies chroniques comme le diabète et les
              pathologies cardiovasculaires.
            </p>
          </div>

          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-900/20">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-blue-600 dark:text-blue-400"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-bold mb-2">Sécurité des Données</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Notre plateforme est construite avec des mesures de sécurité robustes incluant chiffrement SSL/TLS, VPN
              pour les échanges inter-hôpitaux, et authentification forte pour protéger les informations sensibles des
              patients, en conformité avec le RGPD et HIPAA.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4"></div>
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4"></div>
          <div className="border-t border-gray-200 dark:border-gray-800 pt-4"></div>
        </div>
      </div>
    </div>
  )
}
